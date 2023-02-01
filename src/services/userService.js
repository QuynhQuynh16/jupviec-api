import db from "../models/index";
import bcrypt from 'bcryptjs';
import { resolve } from "path";
// import { resolve } from "path";
// import { rejects } from "assert";
// import { waitForDebugger } from "inspector";
// import { READUNCOMMITTED } from "sequelize/types/table-hints";
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashUserPassword = await bcrypt.hashSync(password, salt);
            resolve(hashUserPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                    //let check = true;
                    let check = await bcrypt.compareSync(password, user.password); //false
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';

                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'Sai mật khẩu';
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = `Không tìm thấy người dùng`
                }
            }
            else {
                userData.errCode = 1;
                userData.errMessage = 'Email không tồn tại. Vui lòng kiểm tra email!'
            }
            resolve(userData)
        } catch (e) {
            rejects(e)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (e) {
            rejects(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }
        catch (e) {
            rejects(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email đã được sử dụng, vui lòng chọn email khác!!!'
                })
            } else {
                let hashUserPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashUserPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    phone: data.phone,
                    area: data.area,
                    roleId: data.roleId,
                    image: data.avatar

                })

                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({
            where: { id: userId }
        })
        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
        // if (foundUser) {
        //     await foundUser.destroy();
        // }
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: `The user is delete`
        })
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.area || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phone = data.phone;
                user.area = data.area;
                user.gender = data.gender;
                user.roleId = data.roleId;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!!!!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!!!`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getLoaitkService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            }
            else {
                let res = {};
                let loaitk = await db.Loaitk.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = loaitk;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getLoaitkService: getLoaitkService,
}