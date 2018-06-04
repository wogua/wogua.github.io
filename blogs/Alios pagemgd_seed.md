---
title: Alios PageIPC getRunningPages源码分析
date: 2018-05-18
categories:
- Javascript学习
tags:
- Alios
- PageIPC
- getRunningPages

---
Alios有两个非常重要的native进程：pagemanagerd和seed  
pagemanagerd管理系统的domain和page，这其中包含大家熟知的DPMS和SPMS(类似于Android的AMS和PMS)  
seed则为所有page的孵化进程(类似于Android的zygote)
这两个进程一个用于管理Page，一个用于创建Page，两者必然需要频繁通信，因此了解二者的通信实现方可知道Page的创建流程。
二者皆在开机时启动，开机流程：BootLoader->kernel->systemd->native services->runtime->Key apps
pagemanagerd和seed为native services，二者相互联系且依赖，下面我们来看看二者如何通信的。

首先要明确，pagemanagerd和seed IPC通信是直接用socket实现的，要知道alios进程通信主要采用的是ubus，即封装好的socket通信。
至于为什么直接用socket，原因必然是socket更合适，更高效。ubus kernel层调用的是kdbus，kdbus是可以传输大块数据的，中间应该用了共享缓存机制，pagemanagerd和seed
的通信仅为少量消息的传递，且需要相对较高的实时性，所以直接采取socket方式。
这里的socket通信不同于网络socket，本地socket实际上是client端读写设备文件，services端监听设备文件从而达到消息传递。

pagemanagerd和seed对应的设备文件如下
```
static const String kSeedSocketName("/dev/socket/seed");//实际的设备文件名需要根据systemd去确定
static const String kDPMSSocketName("/dev/socket/dpms");
```

pagemanagerd和seed关键代码
framework\nativeservice\seed\src\Seed.cpp
framework\nativeservice\pagemgrd\dpms\src\ipc\SocketMessageCenter.cpp
framework\nativeservice\pagemgrd\dpms\src\DynamicPageManagerService.cpp

###seed发送消息给pagemanagerd
framework\nativeservice\seed\src\Seed.cpp

```
bool Seed::sendMessageToDPMS(const String& msg) {
    LOG_D("sendMessageToDPMS: %s", msg.c_str());
    if (!mDPMSSockClient) {
        mDPMSSockClient = YUNOS_NEW(SockClient, kDPMSSocket);//kDPMSSocket == "/dev/socket/dpms"
        if (!mDPMSSockClient) {
            YUNOS_HANDLE_OOM();
            return false;
        }
    }
    return mDPMSSockClient->sendMessage(msg);
}
```
Seed中用SockClient发消息给pagemanagerd的设备节点`/dev/socket/dpms`

###seed监听来至pagemanagerd的消息
实现socket监听即实现Socklisener，然后用SockServer绑定对应设备文件，并监听该Socklisener，当设备文件有新写入时socket机制会回调Socklisener的onReceived函数去做具体的消息处理。
Socklisener实现如下

```
class Listener : public SockListener {
public:
    explicit Listener(Seed* seed) : mSeed(seed) {
    }
    virtual ~Listener() {
    }

    virtual void onReceived(const String& inMessage, String& outMessage) {
        if (mSeed) {
            mSeed->handleMessage(inMessage);
        }
    }

private:
    Seed* mSeed;
};
```
SockServer的实例化和绑定在Seed.cpp的run函数中，如下是代码片段

```
int socketFd = ProcessUtil::retrieveSeedSocketFd();//获取"/dev/socket/seed_xxx"设备节点
……
mSeedSockServer = YUNOS_NEW(SockServer, socketFd);//初始化SockServer并绑定设备节点
mListener = YUNOS_NEW(Listener, this);//初始化Listener并传递Seed本身作为回调句柄
……
mSeedSockServer->setMainLoop(env->event_loop());//用loop机制去轮询消息
ret = mSeedSockServer->listen(mListener);//开始监听
```

当pagemanagerd向seed设备节点发消息后，Listener的onReceived会被调用，然后回调Seed.cpp的handleMessage函数，handleMessage中
有3个消息，`"pagemanagerd start"`,`"homeshell ready"`,page的创建销毁，详细如下代码片段

```
void Seed::handleMessage(const String& msg) {
	……
	if (msg.find("pagemanagerd start") == 0) {//pagemanagerd启动后通知seed
		……
		sendMessageToDPMS(String("seed ready"));//发消息告诉pagemanagerd seed已经准备好了
		……
	} else if (msg.find("homeshell ready") == 0) {
        invokeHomeshellReadyCB();
    } else {//其他消息则为进程的创建和销毁消息
		SharedPtr<ProcessInfo> info = YUNOS_NEW(ProcessInfo);
        if (!info.pointer()) {
            YUNOS_ABORT_OOM();
            return;
        }
        if (!info->parseJson(msg)) {//解析msg中的信息到ProcessInfo
            LOG_E("Seed Socket Failed to parse domain infomation from json string");
            return;
        }
        if (info->action() == "fork") {
            forkDomainProcess(info);//创建进程
        } else if (info->action() == "kill") {
            killDomainProcess(info);//销毁进程
        }
	}
}
```

###pagemanagerd监听seed的消息
来着seed的第一个消息为seed初始化的时候，在Seed.cpp的run函数中

```
bool ret = sendMessageToDPMS(String("seed start"));
```

pagemanagerd中socket监听同样也是实现SockListener，用SockServer绑定设备节点并监听，具体实现代码
framework\nativeservice\pagemgrd\dpms\src\ipc\SocketMessageCenter.cpp

```
class Listener : public SockListener {
public:
    explicit Listener(SocketMessageCenter* center) : mCenter(center) {
        assert(mCenter);
    }

    virtual ~Listener() {
    }

    virtual void onReceived(const String& inMessage, String& outMessage) {
        if (mCenter) {
            mCenter->handleMessage(inMessage);
        }
    }

private:
    SocketMessageCenter* mCenter;
};
```
SocketMessageCenterzhong SockServer绑定和监听放在线程ServerThread中，直接看其run()函数

```
virtual int run() {
	……
	mServer = YUNOS_NEW(SockServer, kDPMSSocketName);//kDPMSSocketName == "/dev/socket/dpms"
    if (!mServer) {
        YUNOS_ABORT_OOM();
    }
    mServer->listen(mListener);//mListener是Listener实例
```

当seed发送的seed start消息到来时，首先调用Listener的onReceived,然后回调给SocketMessageCenter的handleMessage函数：`mCenter->handleMessage(inMessage)`,
handleMessage通过loop发消息回调，最后调用handleMessageCB，而handleMessageCB又调用handleMessageInner

```
	virtual void onReceived(const String& inMessage, String& outMessage) {
        if (mCenter) {
            mCenter->handleMessage(inMessage);
        }
    }
	……
	void SocketMessageCenter::handleMessage(const String& inMessage) {
    if (mMainLooper) {
        mMainLooper->sendTask(Task(handleMessageCB, this, inMessage));
    }
	
	void SocketMessageCenter::handleMessageCB(SocketMessageCenter* self, String inMessage) {
		assert(self);
		self->handleMessageInner(inMessage);
	}
	
```

故最终我们我们只需要关注SocketMessageCenter的handleMessageInner函数即可
void SocketMessageCenter::handleMessageInner(const String& inMessage) {
	if (inMessage.endsWith("seed start")) {
		……
		notifySeedOnStart(client);//发送pagemanagerd start消息给seed
		……
	}
	if (inMessage.endsWith("seed ready")) {
		
	}
	……
}

###pagemanagerd向seed发送消息,发送消息的调用通常如下

```
void DynamicPageManagerService::updatePageStatus(const String& pageId,
        const String& status, int32_t uid) {
	……
	sendRawMessageToSeed(String("homeshell ready"), seeds[i]);
	……
}
```
sendRawMessageToSeed的代码：

```
	bool DynamicPageManagerService::sendRawMessageToSeed(const String& message, const String& seed) {
    if (!mSocketMessageCenter) {
        LOG_E("%s: mSocketMessageCenter is nullptr", __FUNCTION__);
        return false;
    }
    return mSocketMessageCenter->sendRawMessageToSeed(message, seed);
}
```

DynamicPageManagerService发消息给seed还是调到SocketMessageCenter的sendRawMessageToSeed，具体调用栈如下

```
bool SocketMessageCenter::sendRawMessageToSeed(const String& message, const String& seed) {
    SeedSocketClient* client = getSocketClient(seed);
    if (!client->mIsSeedReady) {
        client->mPendingMessageList.push_back(message);
        return true;
    }

    return sendRawMessageToSeedInner(message, client);
}
……

bool SocketMessageCenter::sendRawMessageToSeedInner(const String& message,
        SeedSocketClient* client) {
    LOG_D("Sending message to seed: %s", message.c_str());
    return client->mSeedClient.sendMessage(message);
}
```

通过上面代码分析，seed和pagemanagerd通信基本打通，二者互为socket client和socket service。二者启动后会建立socket连接，从而相互通信。

![](http://p9jmdxlv0.bkt.clouddn.com/dpmsseed1.jpg)

###page的创建

一个page的创建通常是通过page.sendLink开始API调用流程一笔带过
framework\npm\caf2\src\page\Page.js : sendLink
framework\npm\pageapi\PageImpl.js : sendLink
framework\npm\pageapi\PageInstance.js : sendLink
framework\libs\page\manager\src\ipc\DPMS.cpp : sendLink
IPC ->
framework\nativeservice\pagemgrd\dpms\src\DynamicPageManagerService.cpp : requestPageLink

