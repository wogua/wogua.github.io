
"use strict";
/**
* 本应用中的页面的抽象，其中_view是本页面ICard的具体view
*
*/
class ICard {
    constructor() {
        this._isShow = false;
        this._isDestroy = false;
        this._view = null;
    }
    set contentView(view) {
        this._view = view;
    }
    get contentView() {
        return this._view;
    }
    get isShow() {
        return this._isShow;
    }
    get isDestroy() {
        return this._isDestroy;
    }
    get isfinish() {
        return false;
    }
    doShow() {
        this._isShow = true;
    }
    doHide() {
        this._isShow = false;
    }
    doDestroy() {
        this._isDestroy = true;
    }
    doBackPress() {
        return false;
    }
}
module.exports = ICard;
