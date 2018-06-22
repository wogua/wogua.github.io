"use strict";
let RequireRouter = require("./RequireRouter");
const Page = RequireRouter.getRequire("yunos/page/Page");
const CardsConfig = require("./cards_config.js");
let TAG = "AiCar/HomePage";
const TabConfig = require("./tab_config.js");

class HomePage extends Page {

    onCreate() {
        super.onCreate();
        this.window.removeAllChildren();
        let LayoutManager = RequireRouter.getRequire("yunos/ui/markup/LayoutManager");
        let view = LayoutManager.loadSync("main_layout");
        this.window.addChild(view);

        let CardManager = RequireRouter.getRequire("./card/CardManager");
        this._cardManager = CardManager.getInstance();
        let cardContainer = view.findViewById("card_container"); //中间卡片容器
        this._cardManager.init(cardContainer);

        this._tabBar = view.findViewById("tab_bar"); //底部tab栏
        this._tabBar.init(this);

        this._titleBar = view.findViewById("title_bar"); //顶部title栏
        this._titleBar.init(this);

        this._init();
    }

    _init() {
        if (!this._hasInit) {
            this._hasInit = true;

            if (this.reloadlink) {
                let link = this.reloadlink;
                this.reloadlink = null;
                this.onLink(link);
            }
        }
    }

    onLink(link) {
        this._hasHide = false;
        log.I(TAG, "onLink:" + JSON.stringify(link));
        if (!this._hasInit) {
            this.reloadlink = link;
            return;
        }
        this.linkToCard(link);
    }

    linkToCard(link) {
        //如果有指定跳转页面，则跳到对应card
        if (link && link.action) {
            log.d(link.action);
        } else { //默认跳到车辆检测
            this.gotoCardoctor();
        }
    }

    onStop() {
        this._hasStop = true;
        super.onStop();
        //清空card
        if (this._cardManager) {
            this._cardManager.doDestroy();
            this._cardManager = null;
        }
    }

    onStart() {
        super.onStart();
    }

    onShow() {
        this._hasHide = false;
        this._isShow = true;
        super.onShow();
        this._cardManager.doShow();
    }

    onHide() {
        this._isShow = false;
        super.onHide();
        this._cardManager.doHide();
    }

    //同onStop
    onDestroy() {
        if (this._cardManager) {
            this._cardManager.doDestroy();
            this._cardManager = null;
        }
    }

    /**
     * 退出时页面切换动画
     */
    changeToDown() {
        var PageTransition = RequireRouter.getRequire("core/pageapi/PageTransition");
        let transition = new PageTransition(PageTransition.TransitionType.TRANSITION_TYPE_SLIDE_IN_OUT_BOTTOM);
        this.overridePendingTransition(transition);
    }

    onBackKey() {
        //如果有卡片在显示，且卡片能成功消费掉backkey事件则直接返回
        if (this._isShow && this._cardManager.doBackPress(false)) {
            return true;
        }

        //如果已经在首页，则退出应用
        if (!this.isNormal) {
            if (this._isShow) {
                this.changeToDown();
            }
            this.stopPage();
            return true;
        }
        return super.onBackKey();
    }

    /**
     * 应用内部调用的退出事件
     */
    onBackKeyFromApp() {
        if (!this._cardManager.doBackPress(true)) {
            if (this._isShow && !this.isNormal) {
                this.changeToDown();
            }
            this.hidePageInApp();
        }
    }

    hidePage() {
        this._hasHide = true;
        super.hidePage();
    }

    hidePageInApp() {
        log.D(TAG, "hidePageInApp");
        if (this._hasHide) {
            return;
        }
        this._hasHide = true;
        if (this._isShow && !this.isNormal) {
            this.changeToDown();
        }
        super.stopPage();
    }

    stopPage() {
        if (this._hasStop) {
            return;
        }
        if (this._isShow && !this.isNormal) {
            this.changeToDown();
        }
        super.stopPage();
    }

    //跳到汽车诊断界面
    gotoCardoctor() {
        this._cardManager.showCardByConfig(CardsConfig.CAR_DOCTOR);
    }

    //跳到车辆服务界面
    gotoCarService() {
        this._cardManager.showCardByConfig(CardsConfig.CAR_SERVICE);
    }

    //跳到消息中心界面
    gotoMessagesCenter() {
        this._cardManager.showCardByConfig(CardsConfig.MESSAGE_CENTER);
    }

    //跳到账号管理界面
    gotoUsercenter() {
        this._cardManager.showCardByConfig(CardsConfig.USER_CENTER);
    }

    onTabChanged(tabId) {
        switch (tabId) {
            case TabConfig.TAB_TYPE.CARDOCTOR.id: //车辆检测
                this.gotoCardoctor();
                break;
            case TabConfig.TAB_TYPE.CARSERVICE.id: //车辆服务
                this.gotoCarService();
                break;
            case TabConfig.TAB_TYPE.MESSAGECENTER.id: //消息中心
                this.gotoMessagesCenter();
                break;
            case TabConfig.TAB_TYPE.USERCENTER.id: //用户中心
                this.gotoUsercenter();
                break;
        }
    }
}

module.exports = HomePage;
