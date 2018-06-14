"use strict";

const Page = RequireRouter.getRequire("yunos/page/Page");
let TAG = "MusicPlayerTag/StartPage";

class HomePage extends Page {

    onCreate() {
		super.onCreate();

		let CardManager = RequireRouter.getRequire("./card/CardManager");
        this._cardManager = CardManager.getInstance();
		CardManager.init(this.window.width, this.window.height);

		this._tabBar = new TabBar(this);//顶部自定义title栏

		this._titleBar = new TitleBar(this);//底部自定义tab栏

		this.init();
    }

	init(){
		if (!this._hasInit) {
			this._hasInit = true;
			this.window.removeAllChildren();
			const RelativeLayout = RequireRouter.getRequire("yunos/ui/layout/RelativeLayout");
            var layout = new RelativeLayout();
            layout.defaultLayoutParam = {align: {left: "parent", top: "parent", bottom: "parent", right: "parent"}};
            this.window.layout = layout;

			//onLink可能在init前面调用？
			if (this.reloadlink) {
                let link = this.reloadlink;
                this.reloadlink = null;
                this.onLink(link);
            }
		}
	}

	onLink(link){
		this._hasHide = false;
		log.I(TAG, "onLink:" + JSON.stringify(link));
		if (!this._hasInit) {
            this.reloadlink = link;
            return;
        }
        this.linkToCard(link);
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

	linkToCard(link) {
		//如果有指定跳转页面，则跳到对应card
		if (link && link.action) {

		}else {//默认跳到车辆检测
            this.gotoCardoctor();
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
	gotoCardoctor(){
		_cardManager.showCardById(CardManager.CARS.cardoctor);
	}

	//跳到车辆服务界面
	gotoCarService(){
        _cardManager.showCardById(CardManager.CARS.cardoctor);
	}

	//跳到消息中心界面
	gotoMessagesCenter(){
        _cardManager.showCardById(CardManager.CARS.cardoctor);
	}

	//跳到账号管理界面
	gotoUsercenter(){
        _cardManager.showCardById(CardManager.CARS.cardoctor);
	}

	onTabChanged(tabId){
		switch (tabId) {
			case TabBar.TABTYPE.CARDOCTOR://车辆检测
				gotoCardoctor();
				break;
			case TabBar.TABTYPE.CARSERVICE://车辆服务
				gotoCarService();
				break;
			case TabBar.TABTYPE.MESSAGECENTER://消息中心
				gotoMessagesCenter();
				break;
			case TabBar.TABTYPE.USERCENTER://用户中心
				gotoUsercenter();
				break;
		}
	}
}
