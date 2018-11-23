import fetch from '@/config/fetch';

export const login = data => fetch('/eshp/admin/login', data, 'POST');

export const signout = () => fetch('/eshp/admin/signout');

export const getAdminInfo = () => fetch('/eshp/admin/info');

export const apiCount = date => fetch('/eshp/statis/api/' + date + '/count');

export const apiAllCount = () => fetch('/eshp/statis/api/count');

export const apiAllRecord = () => fetch('/eshp/statis/api/all');

export const userCount = date => fetch('/eshp/statis/user/' + date + '/count');

export const orderCount = date => fetch('/eshp/statis/order/' + date + '/count');

export const adminDayCount = date => fetch('/eshp/statis/admin/' + date + '/count');

export const adminList = data => fetch('/eshp/admin/all', data);

export const adminCount = () => fetch('/eshp/admin/count');

export const cityGuess = () => fetch('/eshp/v1/cities', {
    type: 'guess'
});

export const addShop = date => fetch('/eshp/shopping/addShop', data, 'POST');

export const searchplace = (cityid, value) => fetch('/eshp/v1/pois',  {
    type: 'search',
    city_id: cityid,
    keyword: value
});

export const getCategory = restaurant_id => fetch('/eshp/shopping/getcategory/' + restaurant_id);

export const addCategory = data => fetch('/eshp/shopping/addcategory', data, 'POST');

export const addFood = data => fetch('/eshp/shopping/addfood', data, 'POST');

export const foodCategory = (latitude, longitude) => fetch('/eshp/shopping/v1/restaurant/category');

export const getRestaurants = data => fetch('/eshp/shopping/restaurants', data);

export const getRestaurantDetail = restaurant_id => fetch('/eshp/shopping/restaurant/' + restaurant_id);

export const getRestaurantsCount = () => fetch('/eshp/shopping/restaurants/count');

export const updateRestaurant = data => fetch('/eshp/shopping/updateshop', data, 'POST');

export const deleteRestaurant = restaurant_id => fetch('/eshp/shopping/restaurant/' + restaurant_id, {}, 'DELETE');

export const getFoods =  data => fetch('/eshp/shopping/v1/foods', data);

export const getFoodsCount = data => fetch('/eshp/shopping/v1/foods/count', data);

export const getMenu = data => fetch('/eshp/shopping/v1/menu', data);

export const getMenuById = category_id => fetch('/eshp/shopping/v1/menu/' + category_id);

export const updateFood = data => fetch('/eshp/shopping/v1/updatefood', data, 'POST');

export const deleteFood = food_id => fetch('/eshp/shopping/v1/food/' + food_id, {}, 'DELETE');

export const getUserList = data => fetch('/eshp/v1/users/list', data);

export const getUserCount = data => fetch('/eshp/v1/users/count', data);

export const getOrderList = data => fetch('/eshp/bos/orders', data);

export const getOrderCount = data => fetch('/eshp/bos/orders/count', data);

export const getUserInfo = user_id => fetch('/eshp/v1/user/', user_id);

export const getAddressById = address_id => fetch('/eshp/v1/address/', address_id);

export const getUserCity = () => fetch('/eshp/v1/user/city/count');
