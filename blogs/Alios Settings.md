---
title: Alios Settings模块学习
date: 2018-05-22
categories:
- YunOS学习
tags:
- YunOS
- Settings
---
### Settings模块概要

- Preference
- 主界面结构
- 子界面跳转
- 二级菜单

#### Preference介绍：  
- Preference通常用于用户修改应用的特性或状态的设置，并保存和UI的同步（值得保持需要自己实现，以file存储json串方式）；
- Preference基本属性：icon，title，detail，summary，pageLink等。
![class picture](http://p9jmdxlv0.bkt.clouddn.com/settings5.jpg)

####Preference的类图继承关系
![class picture](http://p9jmdxlv0.bkt.clouddn.com/settings6.jpg)
 

####Xml定义Preference
![class picture](http://p9jmdxlv0.bkt.clouddn.com/settings7.jpg)
 

####Preference监听数据变化

```
onPreferenceClick(key) {
        this.logger.i("pref click: ", key);
        switch (key) {
        ……
            case KEY_24_HOUR:
                var hour24 = this.mTimeFormat.checked;
                if (hour24 !== this._is24HourFormat) {
                    var value = hour24 ? HOURS_24 : HOURS_12;
                    Settings.System.putString(this._resolver, Settings.System.TIME_12_24, value , (error) => {
                        if (!error) {
                            this._is24HourFormat = hour24;
                            this.logger.i("putString Settings.System.TIME_12_24 suceess  result: ", value);
                            this.updateTimeAndDateDisplay();
                        } else {
                            this.logger.e("save  TIME_12_24 error = ", error);
                        }
                    });
                }
                ……
                break;
        }
    }
```

###Settings主界面结构图

![](http://p9jmdxlv0.bkt.clouddn.com/settings9.jpg)

###Settings 的主界面事一个ListView，其结构图
![](http://p9jmdxlv0.bkt.clouddn.com/settings8.jpg)

Settings的界面分多级，除了主界面的ListView，每个字界面都是一个基础与SubSettings的Page，这些子界面都通过Preference配置中的Link关联。  
下面以sound settings介绍字界面跳转流程,sound settings的preference的配置在
settings/src/pages/private/MainListName.js

```
{
    name: "sound_settings_title",
    itemIcon: "images/ic_settings_sound.png",
    viewType: "interaction",
    pageLink: {
        uri: "page://settings.yunos.com/sound",
        name: "settings.sound"
    }
},
```

Main.js中配置通过preference配置中的pageLink配置itemclick事件，通过sendLink跳转对应uri匹配的Page.

```
this.list.on("itemclick", function(itemTextView, position) {
            log.I(TAG, "Main itemclick position = " + position +
                    " MainListName.name = " + MainListName[position].name);
            if (MainListName[position].pageLink === undefined) {
                log.I("TAG", "list.on pageLink is null");
                return 0;
            }

            let params = {
                name: MainListName[position].pageLink.name,
                data: 60000
            };

            let uri = MainListName[position].pageLink.uri;

            const PageLink = require("yunos/page/PageLink");
            var link = new PageLink(uri);
            link.data = JSON.stringify(params);

            // const PageTransition = require("core/pageapi/PageTransition");
            // link.transition = new PageTransition(PageTransition.TransitionType.TRANSITION_TYPE_NONE);

            this.sendLink(link, function(err, ret) {
                log.I(TAG, "!!!error=" + err + " ret = " + ret);
            });
        }.bind(this));
```
