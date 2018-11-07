import fetch from '../config/fetch';
import {getStore} from '../config/mUtils';

export const cityGuess = () => fetch('/eshp/v1/cities', {
	type: 'guess'
});

export const hotcity = () => fetch('/eshp/v1/cities', {
	type: 'hot'
});

export const groupcity = () => fetch('/eshp/v1/cities', {
	type: 'group'
});

export const currentcity = number => fetch('/eshp/v1/cities/' + number);

export const searchplace = (cityid, value) => fetch('/eshp/v1/pois', {
	type: 'search',
	city_id: cityid,
	keyword: value
});

export const msiteAddress = geohash => fetch('/eshp/v1/pois/' + geohash);

export const msiteFoodTypes = geohash => fetch('/eshp/v1/index_entry', {
	geohash,
	group_type: '1',
	'flags[]': 'F'
});

export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
	let supportStr = '';
	support_ids.forEach(item => {
		if (item.status) {
			supportStr += '&support_ids[]=' + item.id;
		}
	});
	let data = {
		latitude,
		longitude,
		offset,
		limit: '20',
		'extras[]': 'activities',
		keyword: '',
		restaurant_category_id,
		'restaurant_category_ids[]': restaurant_category_ids,
		order_by,
		'delivery_mode[]': delivery_mode + supportStr
	};
	return fetch('/eshp/shopping/restaurants', data);
};

export const searchRestaurant = (geohash, keyword) => fetch('/eshp/v1/restaurants', {
	'extras[]': 'restaurant_activity',
	geohash,
	keyword,
	type: 'search'
});

export const foodCategory = (latitude, longitude) => fetch('/eshp/shopping/restaurant/category', {
	latitude,
	longitude
});

export const foodDelivery = (latitude, longitude) => fetch('/eshp/shopping/restaurants/delivery_modes', {
	latitude,
	longitude,
	kw: ''
});

export const foodActivity = (latitude, longitude) => fetch('/eshp/shopping/restaurants/activity_attributes', {
	latitude,
	longitude,
	kw: ''
});

export const shopDetails = (shopid, latitude, longitude) => fetch('/eshp/shopping/restaurant/' + shopid, {
	latitude,
	longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
});


export const foodMenu = restaurant_id => fetch('/eshp/shopping/menu', {
	restaurant_id
});

export const getRatingList = (shopid, offset, tag_name = '') => fetch('/eshp/ugc/restaurants/' + shopid + '/ratings', {
	has_content: true,
	offset,
	limit: 10,
	tag_name
});

export const ratingScores = shopid => fetch('/eshp/ugc/restaurants/' + shopid + '/ratings/scores');

export const ratingTags = shopid => fetch('/eshp/ugc/restaurants/' + shopid + '/ratings/tags');

export const mobileCode = phone => fetch('/eshp/v1/mobile/verify_code/send', {
	mobile: phone,
	scene: 'login',
	type: 'sms'
}, 'POST');

export const getcaptchas = () => fetch('/eshp/v1/captchas', {},'POST');

export const checkExsis = (checkNumber, type) => fetch('/eshp/v1/users/exists', {
	[type]: checkNumber,
	type
});

export const sendMobile = (sendData, captcha_code, type, password) => fetch('/eshp/v1/mobile/verify_code/send', {
	action: "send",
	captcha_code,
	[type]: sendData,
	type: "sms",
	way: type,
	password,
}, 'POST');

export const checkout = (geohash, entities, shopid) => fetch('/eshp/v1/carts/checkout', {
	come_from: "web",
	geohash,
	entities,
	restaurant_id: shopid,
}, 'POST');

export const getRemark = (id, sig) => fetch('/eshp/v1/carts/' + id + '/remarks', {
	sig
});

export const getAddress = (id, sig) => fetch('/eshp/v1/carts/' + id + '/addresses', {
	sig
});

export const searchNearby = keyword => fetch('/eshp/v1/pois', {
	type: 'nearby',
	keyword
});

export const postAddAddress = (userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => fetch('/eshp/v1/users/' + userId + '/addresses', {
	address,
	address_detail,
	geohash,
	name,
	phone,
	phone_bk,
	poi_type,
	sex,
	tag,
	tag_type,
}, 'POST');

export const placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => fetch('/eshp/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
	address_id,
	come_from: "mobile_web",
	deliver_time: "",
	description,
	entities,
	geohash,
	paymethod_id: 1,
	sig,
}, 'POST');

export const rePostVerify = (cart_id, sig, type) => fetch('/eshp/v1/carts/' + cart_id + '/verify_code', {
	sig,
	type,
}, 'POST');


export const validateOrders = ({
	user_id,
	cart_id,
	address_id,
	description,
	entities,
	geohash,
	sig,
	validation_code,
	validation_token
}) => fetch('/eshp/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
	address_id,
	come_from: "mobile_web",
	deliver_time: "",
	description,
	entities,
	geohash,
	paymethod_id: 1,
	sig,
	validation_code,
	validation_token,
}, 'POST');

export const payRequest = (merchantOrderNo, userId) => fetch('/eshp/payapi/payment/queryOrder', {
	merchantId: 5,
	merchantOrderNo,
	source: 'MOBILE_WAP',
	userId,
	version: '1.0.0',
});


export const getService = () => fetch('/eshp/v1/profile/explain');


export const vipCart = (id, number, password) => fetch('/eshp/member/users/' + id + '/delivery_card/physical_card/bind',{
	number,
	password
}, 'POST')

export const getHongbaoNum = id => fetch('/eshp/promotion/users/' + id + '/hongbaos?limit=20&offset=0');


export const getExpired = id => fetch('/eshp/promotion/users/' + id + '/expired_hongbaos?limit=20&offset=0');

export const exChangeHongbao = (id, exchange_code, captcha_code) => fetch('/eshp/v1/users/' + id + '/hongbao/exchange',{
	exchange_code,
	captcha_code,
}, 'POST');

export const getUser = () => fetch('/eshp/v1/user', {user_id: getStore('user_id')});

var sendLogin = (code, mobile, validate_token) => fetch('/eshp/v1/login/app_mobile', {
	code,
	mobile,
	validate_token
}, 'POST');

export const getOrderList = (user_id, offset) => fetch('/eshp/bos/users/' + user_id + '/orders', {
	limit: 10,
	offset,
});

export const getOrderDetail = (user_id, orderid) => fetch('/eshp/bos/users/' + user_id + '/orders/' + orderid + '/snapshot');

export const getAddressList = (user_id) => fetch('/eshp/v1/users/'+user_id+'/addresses')

export const getSearchAddress = (keyword) => fetch('/eshp/v1/pois',{
	keyword:keyword,
	type:'nearby'
})

export const deleteAddress = (userid, addressid) => fetch( '/eshp/v1/users/' + userid + '/addresses/' + addressid, {}, 'DELETE')

export const accountLogin = (username, password, captcha_code) => fetch('/eshp/v1/login', {username, password, captcha_code}, 'POST');

export const signout = () => fetch('/eshp/v1/signout');

export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) => fetch('/eshp/v1/changepassword', {username, oldpassWord, newpassword, confirmpassword, captcha_code}, 'POST');
