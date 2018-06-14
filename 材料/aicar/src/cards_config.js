
/**
* 所有卡片的配置
* 第一层参数: 卡片跳转的标识
* 第二层参数
* 	title：卡片的标题id R.getString(title);
* 	layout: 卡片的布局id LayoutManager.loadSync(layout,);
* 
*/

var cardsList = {
	CAR_DOCTOR:{
		title:"main_aicar_doctor",
		layout:"card_cardoctor"
	},
	CAR_SERVICE:{
		title:"main_aicar_server",
		layout:"card_carservice"
	},
	MESSAGE_CENTER:{
		title:"main_aicar_messages",
		layout:"card_messagecenter"
	},
	USER_CENTER:{
		title:"main_aicar_messages",
		layout:"card_usercenter"
	}
}
module.exports = cardsList;