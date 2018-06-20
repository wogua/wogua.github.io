/**
 * 所有卡片的配置
 * 第一层参数: 卡片跳转的标识
 * 第二层参数
 * 	title：卡片的标题id R.getString(title);
 * 	layout: 卡片的布局id LayoutManager.loadSync(layout,);
 * 	cardStack: 对应的栈顶card，null表示为栈顶主card
 *
 */
var CardsConfig = {
    /* ================车辆诊断=============== */
    CAR_DOCTOR: {
        title: "main_aicar_doctor",
        layout: "card_cardoctor",
        cardStack: "card_cardoctor"
    },

    CAR_REPORT: { //诊断报告
        title: "xxx",
        layout: "xxx",
        cardStack: "card_cardoctor"
    }，

    /* ================车辆服务=============== */
    CAR_SERVICE: {
        title: "main_aicar_server",
        layout: "card_carservice",
        cardStack: "card_cardoctor"
    },

    /* ================消息中心=============== */
    MESSAGE_CENTER: {
        title: "main_aicar_messages",
        layout: "card_messagecenter",
        cardStack: "card_messagecenter"
    },

    MESSAGE_DETAILS: { //消息详情
        title: "xxx",
        layout: "xxx",
        cardStack: "card_messagecenter"
    },

    /* ================用户中心=============== */
    USER_CENTER: {
        title: "main_aicar_messages",
        layout: "card_usercenter",
        cardStack: "card_usercenter"
    }，
    USER_LOGIN: { //用户登录
        title: "xxx",
        layout: "xxx",
        cardStack: "card_usercenter"
    }，
    USER_REGIST: { //新用户注册
        title: "xxx",
        layout: "xxx",
        cardStack: "card_usercenter"
    },
    USER_REGIST: { //车辆绑定
        title: "xxx",
        layout: "xxx",
        cardStack: "card_usercenter"
    }
}
module.exports = CardsConfig;
