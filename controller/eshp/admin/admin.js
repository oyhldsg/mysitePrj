'use strict';

import AdminModel from '../../../models/eshp/admin/admin';
import AddressComponent from '../../../prototype/eshp/addressComponent';
import crypto from 'crypto';
import formidable from 'formidable';
import dtime from 'time-formater';

class Admin extends AddressComponent {
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.encryption = this.encryption.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
    }

    async login(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if (err) {
                res.send({
                    status: 0,
                    type: 'FORM_DATA_ERROR',
                    message: 'form info error'
                });
                return;
            }

            const {user_name, password, status = 1} = fields;
            try {
                if (!user_name) {
                    throw new Error('user name param error');
                } else if (!password) {
                    throw new Error('password param error');
                }
            } catch(err) {
                console.log(err.message, err);
                res.send({
                    status: 0,
                    type: 'GET_ERROR_PARAM',
                    message: err.message,
                });
                return;
            }

            const newpassword = this.encryption(password);
            try {
                const admin = await AdminModel.findOne({user_name});
                if (!admin) {
                    const adminTip = status == 1 ? 'admin' : 'super admin';
                    const admin_id = await this.getId('admin_id');
                    const cityInfo = await this.guessPosition(req);
                    const newAdmin = {
                        user_name,
                        password: newpassword,
                        id: admin_id,
                        create_time: dtime().format('YYYY-MM-DD HH:mm'),
                        admin: adminTip,
                        status,
                        city: cityInfo.city
                    };
                    await AdminModel.create(newAdmin);
                    req.session.admin_id = admin_id;
                    res.send({
                        status: 1,
                        success: 'registe admin success',
                    })
                } else if (newpassword.toString() != admin.password.toString()) {
                    console.log('admin password error');
                    res.send({
                        status: 0,
                        type: 'ERROR_PASSWORD',
                        message: 'user exist, password error',
                    })
                } else {
                    req.session.admin_id = admin.id;
                    res.send({
                        status: 1,
                        success: 'login success'
                    })
                }
            } catch(err) {
                console.log('admin login failed', err);
                res.send({
                    status: 0,
                    type: 'LOGIN_ADMIN_FAILED',
                    message: 'admin login failed',
                })
            }
        })
    }

    async register(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            if (err) {
                res.send({
                    status: 0,
                    type: 'FORM_DATA_ERROR',
                    message: 'form info error'
                });
                return;
            }

            const {user_name, password, status = 1} = fields;
            try {
                if (!user_name) {
                    throw new Error('username error');
                } else if (!password) {
                    throw new Error('password error');
                }
            } catch(err) {
                console.log(err.message, err);
                res.send({
                    status: 0,
                    type: 'GET_ERROR_PARAM',
                    message: err.message
                });
                return;
            }
            try {
                const admin = await AdminModel.findOne({user_name});
                if (admin) {
                    console.log('user exist');
                    res.send({
                        status: 0,
                        type: 'USER_HAS_EXIST',
                        message: 'user exist',
                    })
                } else {
                    const adminTip = status == 1 ? 'admin' : 'super admin';
                    const admin_id = await this.getId('admin_id');
                    const newpassword = this.encryption(password);
                    const newAdmin = {
                        user_name,
                        password: newpassword,
                        id: admin_id,
                        create_time: dtime().format('YYYY-MM-DD');
                        admin: adminTip,
                        status,
                    };
                    await AdminModel.create(newAdmin);
                    req.session.admin_id = admin_id;
                    res.send({
                        status: 1,
                        message: 'registe admin success',
                    })
                }
            } catch(err) {
                console.log('registe admin failed', err);
                res.send({
                    status: 0,
                    type: 'REGISTER_ADMIN_FAILED',
                    message: 'registe admin failed',
                })
            }
        })
    }

    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword;
    }
    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }

    async signout(req, res, next) {
        try {
            delete req.session.admin_id;
            res.send({
                status: 1,
                success: 'exit success'
            })
        } catch(err) {
            console.log('exit failed', err);
            res.send({
                status: 0,
                message: 'exit failed'
            })
        }
    }

    async getAllAdmin(req, res, next) {
        const {limit = 20, offset = 0} = req.query;
        try {
            const allAdmin = await AdminModel.find({}, '-_id -password').sort({id: -1}).skip(Number(offset)).limit(Number(limit));
            res.send({
                status: 1,
                data: allAdmin,
            })
        } catch(err) {
            console.log('get super admin list failed', err);
            res.send({
                status: 0,
                type: 'ERROR_GET_ADMIN_LIST',
                message: 'get super admin list failed'
            })
        }
    }

    async getAdminCount(req, res, next) {
        try {
            const count = await AdminModel.count();
            res.send({
                status: 1,
                count,
            })
        } catch(err) {
            console.log('get admin count failed', err);
            res.send({
                status: 0,
                type: 'ERROR_GET_ADMIN_COUNT',
                message: 'get admin count failed'
            })
        }
    }

    async getAdminInfo(req, res, next) {
        const admin_id = req.session.admin_id;
        if (!admin_id || !Number(admin_id)) {
            res.send({
                status: 0,
                type: 'ERROR_SESSION',
                message: 'get admin info failed'
            });
            return;
        }

        try {
            const info = await AdminModel.findOne({id: admin_id}, '-_id -__v -password');
            if (!info) {
                throw new Error('not found the admin');
            } else {
                res.send({
                    status: 1,
                    data: info
                })
            }
        } catch(err) {
            console.log('get admin info failed');
            res.send({
                status: 0,
                type: 'GET_ADMIN_INFO_FAILED',
                message: 'get admin info failed'
            })
        }
    }

    async updateAvatar(req, res, next) {
        const admin_id = req.params.admin_id;
        if (!admin_id || !Number(admin_id)) {
            console.log('admin_id param error', admin_id);
            res.send({
                status: 0,
                type: 'ERROR_ADMINID',
                message: 'admin_id param error',
            });
            return;
        }

        try {
            const image_path = await this.getPath(req);
            await AdminModel.findOneAndUpdate({id: admin_id}, {$set: {avatar: image_path}});
            res.send({
                status: 1,
                image_path,
            });
            return;
        } catch(err) {
            console.log('upload image failed', err);
            res.send({
                status: 0,
                type: 'ERROR_UPLOAD_IMG',
                message: 'upload image failed'
            });
            return;
        }
    }
}

export default new Admin();
