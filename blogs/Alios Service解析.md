---
title: Alios Service分析
date: 2018-05-10 14:14:39
categories:
- YunOS学习
tags:
- YunOS
- PageService
- getServiceProxy
---
### Android Service简述
本人之前是搞Android开发的，这里先简单说下Android的Service，后面你会发现，除了通信方式不一样，调用方法神似。
Android服务分本地服务和远程服务，本地服务和应用在同一进程，不需要IPC；远程服务需要在AndroidManifest.xm配置android:process=":remote"属性，然后用AIDL定义接口，同时实现一个Service并在Service的onBind方法返回一个AIDL服务的IBinder代理。
客户单通过`bindService(serviceIntent, mConnection, Context.BIND_AUTO_CREATE)`启动服务，在ServiceConnection的回调中获取IBinder并实例化出远程服务对象。

### Alios PageService定义
以源码musicplayer中的音乐播放服务为例

	{
            "title": "__VAR_APPTITLE__",
            "uri": "page://musicplayer.yunos.com/musicservice",
            "content_path": "src/service/MusicService.js",
            "proxy_path": "src/service/MusicServiceProxy.js",
            "background_mode":["mediaplayer"],
            "version_code": 1,
            "version": "1.0.0"
    }
从定义可以看出来，Alios也定义了一个服务类实现和一个代理，如musicplayer中的MusicService.js是服务的实现，MusicServiceProxy.js是给客户端调用的代理。
Alios Service仍然是个Page，只是类型不同，在实现PageService时要重写get type()

	get type() {
        return Page.PageType.SERVICE;
    }

前面讲了Android Activity启动Service并通信是通过bindService，绑定服务成功后回调中获取远程服务对象。
而Alios是通过page的`getServiceProxy`来实现的，我们看看musicplayer中具体调用：

	page.getServiceProxy("page://musicplayer.yunos.com/musicservice", this._connection.connection, true);

看看getServiceProxy源码定义
路径：framework\npm\caf2\src\page\Page.js

	getServiceProxy(serviceUri, connectionListener, keepAlive, userData, defaultProxy) {
        this.pageapi.getServiceProxy(serviceUri, connectionListener, keepAlive, userData,
            defaultProxy);
    }

connectionListener中有connected，disconnected，failed的回调监听，如果getServiceProxy成功会回调connectionListener的connected并传回service，而这个service即远程代理ServiceProxy，对应musicplayer中的MusicServiceProxy。
如下是musicplayer相关代码：

	connect() {
        if (this._isDisConnect) {
            return;
        }
        if (!this._isConnect) {
            this._isConnect = true;
            if (!this._connection) {
                let self = this;
                const ConnectionListener = RequireRouter.getRequire("yunos/page/ServiceProxy").ConnectionListener;
                this._connection = {
                    connection: new ConnectionListener(),
                    connectedOn: function(uri, service) {
                        log.I(TAG, "player service connect success");
                        self._service = service;// 获取远程服务
                        self.initService();
                        self._playManager.queryPlaySate();
                        self._playManager.queryPlayMode();
                        self._playManager.playSceneOnShowIfNeed();
                        self.trigerServerTask();
                    },
                    disconnectedOn: function(uri) {
                        log.I(TAG, "player service disconnect:" + uri);
                        this._stateChangeHandle = null;
                        this._exitMusicHandle = null;
                        self._service = null;
                        self._isConnect = null;
                        self.notifyServiceDisconnect();
                    },
                    failedOn: function(uri, error) {
                        log.I(TAG, "player service connect failed:" + error.toString());

                        // test
                        this._stateChangeHandle = null;
                        this._exitMusicHandle = null;
                        self._service = null;
                        self._isConnect = null;
                        self.notifyServiceDisconnect();
                    },
                    init: function() {
                        // 添加监听
                        this.connection.on("connected", this.connectedOn);
                        this.connection.on("disconnected", this.disconnectedOn);
                        this.connection.on("failed", this.failedOn);
                    },
                    release: function() {
                        this.connection.removeListener("connected", this.connectedOn);
                        this.connection.removeListener("disconnected", this.disconnectedOn);
                        this.connection.removeListener("failed", this.failedOn);
                    }
                };
                this._connection.init();
            }
            const StartPage = RequireRouter.getRequire("./StartPage");
            let page = StartPage.getInstance();
            if (page) {
                // Page 中绑定service和proxy，通过connection回掉服务service给page
                page.getServiceProxy("page://musicplayer.yunos.com/musicservice", this._connection.connection, true);
            }
        }
    }
下面我们就来通过源码分析getServiceProxy是如何获取远程ServiceProxy的。
framework\npm\pageapi\PageInstance.js
loadPage()
```
	var pageName = this._config.pageInfo.name || null;
    var Func = require(filePath, pageName);
    log.I(this._traceInfoTag, "application page is required");
    if (typeof Func === "function") {
        this._pageObject = new Func();
    } else {
        logger.W("Attention: exporting the created object from page will",
            "be not supported.");
        if (typeof Func === "object") {
            this._pageObject = Func;
        }
    }
    log.I(this._traceInfoTag, "application page is constructed");
    if (typeof this._pageObject === "object") {
        this._pageObject.pageapi = this._instance;
    }
```