/**
 * 所有卡片的配置
 * 第一层参数: 卡片跳转的标识
 * 第二层参数
 * 	title：卡片的标题id R.getString(title);
 * 	layout: 卡片的布局id LayoutManager.loadSync(layout,);
 * 	path: 卡片的具体实现 let customCard = require(path); let card = new customCard(...);
 * 	cardStack: 卡片所在的栈
 *
 */
var CardsConfig = {
    /* ================车辆诊断=============== */
    CAR_DOCTOR: {
        title: "main_aicar_doctor",
        layout: "card_cardoctor",
        cardPath:"xxx",
        cardStack: "STACK_CAR_DOCTOR"
    },

    CAR_REPORT: { //诊断报告
        title: "xxx",
        layout: "xxx",
        cardPath:"xxx",
        cardStack: "STACK_CAR_DOCTOR"
    },

    /* ================车辆服务=============== */
    CAR_SERVICE: {
        title: "main_aicar_server",
        layout: "card_carservice",
        cardPath:"xxx",
        cardStack: "STACK_CAR_SERVICE"
    },

    /* ================消息中心=============== */
    MESSAGE_CENTER: {
        title: "main_aicar_messages",
        layout: "card_messagecenter",
        cardPath:"./usercenter/MessageCenterCard.js",
        cardStack: "STACK_MESSAGE_CENTER"
    },

    MESSAGE_DETAILS: { //消息详情
        title: "xxx",
        layout: "xxx",
        cardPath:"xxx",
        cardStack: "STACK_MESSAGE_CENTER"
    },

    /* ================用户中心=============== */
    USER_CENTER: {
        title: "main_aicar_usercenter",
        layout: "card_usercenter",
        path:"./usercenter/UserCenterCard.js",
        cardStack: "STACK_USER_CENTER"
    },
    USER_LOGIN: { //用户登录
        title: "xxx",
        layout: "xxx",
        cardPath:"xxx",
        cardStack: "STACK_USER_CENTER"
    },
    USER_REGIST: { //新用户注册
        title: "xxx",
        layout: "xxx",
        cardPath:"xxx",
        cardStack: "STACK_USER_CENTER"
    },
    USER_BINDING: { //车辆绑定
        title: "xxx",
        layout: "xxx",
        cardPath:"xxx",
        cardStack: "STACK_USER_CENTER"
    }
}
module.exports = CardsConfig;
