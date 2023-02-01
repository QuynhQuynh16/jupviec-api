import bcrypt from 'bcryptjs';
import { assert } from 'console';
import { resolve } from 'path';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashUserPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashUserPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                phone: data.phone,
                khuvuc: data.khuvuc,
                roleId: data.roleId,
                image: data.image
            })
            resolve('create a new user sussceed!!!  ')

        } catch (e) {
            reject(e);
        }

    })
}
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

let getAllUser = () => {
    return new Promise((resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            })
            if (user) {
                resolve(user)
            }
            else {
                resolve({})
            }
        } catch (e) {
            reject(e);
        }
    })

}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phone = data.phone;

                await user.save();
                let allUser = await db.User.findAll();
                resolve(allUser);
            } else {
                resolve();
            }
        } catch (e) {
            console.log(e);
        }
    }
    )
}
let deteleUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })
            if (user) {
                await user.destroy();
            }
            resolve();
        }
        catch (e) {
            reject(e);
        }
    })
}

let getAllClient = () => {
    return new Promise((resolve, reject) => {
        try {
            let clients = db.Client.findAll({
                raw: true,
            });
            resolve(clients)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deteleUserById: deteleUserById,
    getAllClient: getAllClient
}