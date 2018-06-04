---
title: Alios SettingsProvider模块学习
date: 2018-05-10 14:14:39
categories:
- YunOS学习
tags:
- YunOS
- Settings
- SettingsProvider
---
### 1. SettingsProvider目录结构

#### 主要文件：  
- SettingsProvider.js         数据提供者  
- SettingsDb.js               实际的数据存储者  
- defaultSettings.json        默认配置文件  
![class picture](http://p9jmdxlv0.bkt.clouddn.com/setting1.jpg)

####SettingProvider框架图
![class picture](http://p9jmdxlv0.bkt.clouddn.com/setting2.png)

如上图，SettingsProvider是对外的数据提供者，SettingsDb为实际的数据存储者。 而最终实际存储位置为文件，后面会讲到。 

####SettingsDb 内部结构
三个类：SettingsDb，SettingTable，SettingFile  
SettingsDb中有mSettingTables变量存放了三个表（ SettingTable ）的数据（system，secure，global）  
SettingTable中this.data变量存放的文件中解析出来的json数据  
所以取值调用实际是：
mSettingTables[table] .data[name].value
比如取屏幕亮度：  
mSettingTables[“system”] .data[“screen_brightness”].value  
SettingTable 中变量this.settingFile是SettingFile实例，用于读写文件  

####SettingProvider启动流程

SettingsProvider onCreate 初始化

```
   onCreate(onComplete) {
        log.I(TAG, "onCreate() - enter");
		//调用SettingDb.load，成功则回调SettingsDb实例给this.mSettingsDbs
        SettingsDb.load((error, db) => {
            if (!error) {
                this.mSettingsDbs = db;
                log.I(TAG, "onCreateOnLoad() - load settings db successfully");
                onComplete(null);
            } else {
                log.E(TAG, "onCreateOnLoad() - failed to load settings db, error:%s", error);
                onComplete(error);
            }
        });

        log.I(TAG, "onCreate() - leave");

        return true;
    }
```

接下来看SettingDb.load


```
module.exports = {
    load: function (onComplete /* error, SettingsDb */) {
        var db = new SettingsDb();
        load(db, (error) => {
            if (error) {
                onComplete(error);
            } else {
                if (sysprop.get("persist.sys.build.plugin", "0") === "1") {
                    let csdb = require("plugin/settingsprovider/CSettingsDb");
                    if (!csdb.isContainerSettingsInitialized(db)) {
                        log.D(TAG, "load() - load container settings");
                        csdb.loadSecureSettings(db);
                    }
                }
                onComplete(null, db);
            }
        });
    }
};
```
这里调用道SettingDb.load

```
function load(db, onComplete /* error */) {
    var tables = db.mSupportedTables;
    var settingTables = db.mSettingTables;
    var ps = [];
    var i = 0;
    var dataVersion = 0;

    //创建一个Promise数组，每项Promise是一个loadSettingsFromFilePromise函数的任务
    forEachSettingTableDo(db, (settingTable) => {
        ps.push(loadSettingsFromFilePromise(settingTable.settingFile));
    });

	// 每个loadSettingsFromFilePromise会回掉一个settingsArray数组回来，该数组则为对应表的json数据
    Promise.all(ps).then((settingsArray) => {
        for (i = 0; i < tables.length; ++i) {
            if (settingsArray[i][SETTINGS_VERSION_NAME]) {
                dataVersion = Number(settingsArray[i][SETTINGS_VERSION_NAME].value);
            } else {
                dataVersion = NaN;
            }

            if (isNaN(dataVersion) || dataVersion > SETTINGS_VERSION) {
                log.W(TAG, "load() - invalid setting data version:%s current:%s",
                    dataVersion, SETTINGS_VERSION);
                throw new Error("Invalid setting data version");
            } else {
                settingTables[tables[i]].data = settingsArray[i];//用一个二维数组对象保存缓存三张表数据
            }
        }

        if (DEBUG) {
            log.D("SettingsDb.load() - loaded all setting data from file");
        }
        onUpgrade(db, SETTINGS_VERSION);

        onComplete(null);
    }).catch((error) => {
        log.W(TAG, "SettingsDb.load() - failed to load settings from file, error:%s",
            error);

        forEachSettingTableDo(db, (settingTable) => {
            settingTable.settingFile.delete();
            settingTable.data = {};
        });

        log.I(TAG, "SettingsDb.load() - reset wrong settings and create from configured setting files");

        onCreate(db, onComplete);//如果load失败则可能是第一次加载，故走onCreate加载config等默认项
    });
}
```

可以看到这里是通过3个Promise异步加载每个表的内容，具体加载看loadSettingsFromFilePromise

```
function loadSettingsFromFilePromise(settingFile) {
    return new Promise((resolve, reject) => {
        settingFile.load((error, settingData) => {
            if (error) {
                reject(error);
            } else {
                resolve(settingData);
            }
        });
    });
}
```
loadSettingsFromFilePromise中的价值实际上是调用SettingFile的load

```
load(onComplete /* error, settingData */) {
        loadFile(this.filename, (error, data) => {
            if (error) {
                loadFile(this.bkfilename, onComplete);
            } else {
                onComplete(error, data);
            }
        });
    }
```

SettingFile中的load最终又掉到SettingsDb的load方法，中间一系列调用只是封装，并传递实际的文件路径。

```
function loadFile(filename, onComplete /* error, settingData */) {
    log.I(TAG, "SettingFile.loadFile() - file:%s", filename);
    var settingData = null;
    fs.readFile(filename, "utf8", (error, data) => {
        if (error) {
            log.E(TAG, "SettingFile.loadFile() - failed to read file:%s error:%s",
                filename, error);
            onComplete(error);
        } else {
            try {
                settingData = JSON.parse(data);
            } catch (e) {
                log.E(TAG, "SettingFile.loadFile() - failed to parse data from file:%s error:%s",
                    filename, e);
                onComplete(e);
                return;
            }

            log.I(TAG, "SettingFile.loadFile() - read data from file:%s", filename);
            onComplete(null, settingData);
        }
    });

}
```

loadFile的数据会通过回调一步步传递给SettingsDb的load函数，并赋值给settingTables[tables[i]].data，这个二位数组对象即为settings数据的缓存。如果loadFile失败，回掉到load函数后会调用`onCreate(db, onComplete);`,即第一次加载，我们来看onCreate


```
unction onCreate(db, onComplete /* error */) {
    loadVolumeLevels(db);
    // @relyon YUNOS_SYSCAP_PRODUCT.LITE
    if (Feature.has("YUNOS_SYSCAP_PRODUCT.LITE")) {//在config中加载默认设置
        loadFromConfig(db, LITE_SETTINGS_CONFIG_FILENAME);
    } else {
        loadFromConfig(db, SETTINGS_CONFIG_FILENAME);
    }

    loadSettingsExtra(db);//加载额外的设置值
    forEachSettingTableDo(db, (settingTable) => {
        settingTable.data[SETTINGS_VERSION_NAME] = {
            value: String(SETTINGS_VERSION),
            owner: "settingsprovider.yunos.com"
        };
    });

    if (DEBUG) {
        log.D(TAG, "SettingsDb.onCreate() - loaded default settings, begin to save setting files");
    }
    saveAllSettings(db, true);//保存设置值

    onComplete(null);
}
```
可以看到onCreate中加载了config中的默认值，具体看配置的是lite还是非lite，对应的config路径如下

```
const SETTINGS_CONFIG_FILENAME = "/opt/app/settingsprovider.yunos.com/config/defaultSettings.json";
const LITE_SETTINGS_CONFIG_FILENAME = "/opt/app/settingsprovider.yunos.com/config/defaultSettings_lite.json";
```

loadFromConfig中调用读取config文件并解析出json数据然后用loadFromNameValues初始化三个表的缓存数据。

```
function loadFromConfig(db, filename) {
    if (DEBUG) {
        log.D(TAG, "SettingsDb.loadFromConfig() - file:%s", filename);
    }
    var data = null;
    try {
        var content = fs.readFileSync(filename, "utf8");//读取config文件
        if (DEBUG) {
            log.D(TAG, "SettingsDb.loadFromConfig() - read %s chars from file:%s",
                content.length, filename);
        }

        data = JSON.parse(content);//解析出数据
    } catch (e) {
        log.E(TAG, "SettingsDb.loadFromConfig() - failed to parse file:%s error:%s",
            filename, e);
        return;
    }
	//存储数据到各自的缓存并保存为文件
    loadFromNameValues(db, SettingTables.SYSTEM, data.system);
    loadFromNameValues(db, SettingTables.SECURE, data.secure);
    loadFromNameValues(db, SettingTables.GLOBAL, data.global);
}
```

存储文件

```
saveSettings(settingTable) 
……
function doSaveSettings(settingTable)
……
SettingFile.save
……

```

三方应用调用SettingsProvider存取数据的方式和android一样，都是通过系统Settings封装类进行的，如下是调用实例


```
onPreferenceClick(key) {
        switch (key) {
            case KEY_INFORMATION_SERVISE:
                var infostate = this.mInformationService.checked;
                log.I(TAG, "KEY_INFORMATION_SERVISE tap checked  = " + this.mInformationService.checked);
                //设置Settings System表中的information_service字段数据
                Settings.System.putNumber(this._resolver, "information_service", infostate ? 1 : 0 , function(error) {
                    log.I(TAG, "set information_service error: " + error);
                });
        }
    }
    onShow() {
        super.onShow();
        log.I(TAG, "onShow");
        //获取Settings System表中的information_service字段数据
        Settings.System.getNumberWithDefault(this._resolver, "information_service", 1, (value)=> {
            this.mInformationService.checked = value ? true : false;
        });
    }
```
Settings路径在caf2中framework\npm\caf2\src\content\Settings.js，其get，put函数最终都会通过dataResolver调用到SettingProver的processCall。然后通过解析函数名调用SettingsDb的getSettingValue或者setSettingValue。


