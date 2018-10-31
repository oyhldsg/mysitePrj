'use strict';

import BaseComponent from './baseComponent';

class AddressComponent extends BaseComponent {
    constructor() {
        super();
        this.tencentkey = 'TODO';
        this.tencentkey2 = 'TODO';
        this.tencentkey3 = 'TODO';
        this.baidukey = 'TODO';
        this.baidukey2 = 'TODO';
    }

    async guessPosition(req) {
        return new Promise(async (resolve, reject) => {
            let ip = req.headers['x-forwarded-for'] || 
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            const ipArr = ip.split(';');
            ip = ipArr[ipArr.length - 1];
            if (process.env.NODE_ENV == 'development') {
                ip = 'TODO';
            }

            try {
                let result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {ip, key: this.tencentkey,});
                if (result.status != 0) {
                    result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {ip, key: this.tencentkey2,});
                }

                if (result.status != 0) {
                    result = await this.fetch('http://apis.map.qq.com/ws/location/v1/ip', {ip, key: this.tencentkey3,});
                }

                if (result.status == 0) {
                    const cityInfo = {
                        lat: result.result.location.lat,
                        lng: result.result.location.lng,
                        city: result.result.ad_info.city,
                    };
                    cityInfo.city = cityInfo.city.replace(/市$/, '');
                    resolve(cityInfo);
                } else {
                    console.log('locate failed', result);
                    reject('locate failed');
                }
            } catch(err) {
                reject(err);
            }
        })
    }

    async searchPlace(keyword, cityName, type = 'search') {
        try {
            const resObj = await this.fetch('http://apis.map.qq.com/ws/place/v1/search', {
                    key: this.tencentkey,
                    keyword: encodeURIComponent(keyword),
                    boundary: 'region(' + encodeURIComponent(cityName) + ',0)',
                    page_size: 10,
                    });

            if (resObj.status == 0) {
                return resObj;
            } else {
                throw new Error('search locate info failed');
            }
        } catch(err) {
            throw new Error(err);
        }
    }

    async getDistance(from, to, type) {
        try {
            let res;
            res = await this.fetch('http://api.map.baidu.com/routematrix/v2/driving', {
                    ak: this.baidukey,
                    output: 'json',
                    origins: from,
                    destinations: to,
                    });
            if (res.status !== 0) {
                res = await this.fetch('http://api.map.baidu.com/routematrix/v2/driving', {
                        ak: this.baidukey2,
                        output: 'json',
                        origins: from,
                        destinations: to,
                        });
            }

            if (res.status == 0) {
                const positionArr = [];
                let timevalue;
                res.result.forEach(item => {
                    timevalue = parseInt(item.duration.value) + 1200;
                    let durationtime = Math.ceil(timevalue % 3600 / 60) + '分钟';
                    if (Math.floor(timevalue / 3600)) {
                        durationtime = Math.floor(timevalue / 3600) + '小时' + durationtime;
                    }

                    positionArr.push({
                        distance: item.distance.text,
                        order_lead_time: durationtime,
                    });
                });

                if (type == 'timevalue') {
                    return timevalue;
                } else {
                    return positionArr;
                }
            } else {
                throw new Error('call Baidu measure failed');
            }
        } catch(err) {
            console.log('get locate failed');
            throw new Error(err);
        }
    }

    async geocoder(req) {
        try {
            const address = await this.guessPosition(req);
            const res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', {
                    key: this.tencentkey,
                    location: address.lat + ',' + address.lng
                    });

            if (res.status == 0) {
                return res;
            } else {
                throw new Error('get locate info failed');
            }
        } catch(err) {
            console.log('geocoder get locate failed');
            throw new Error(err);
        }
    }

    async getpois(lat, lng) {
        try {
            const res = await this.fetch('http://apis.map.qq.com/ws/geocoder/v1/', {
                    key: this.tencentkey,
                    location: lat + ',' + lng
                    });

            if (res.status == 0) {
                return res;
            } else {
                throw new Error('get locate failed by geohash');
            }
        } catch(err) {
            console.log('getpois loate failed');
            throw new Error(err);
        }
    }
}

export default AddressComponent;
