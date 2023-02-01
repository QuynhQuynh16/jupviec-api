import db from "../models/index";
import bcrypt from 'bcryptjs';


const salt = bcrypt.genSaltSync(10);

let hashClientPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashClientPassword = await bcrypt.hashSync(password, salt);
            resolve(hashClientPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleClientLogin = (email, password) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let clientData = {};

            let isExist = await checkClientEmail(email);
            if (isExist) {
                let client = await db.Client.findOne({
                    attributes: ['email', 'roleid', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (client) {
                    //let check = true;
                    let check = await bcrypt.compareSync(password, client.password); //false
                    if (check) {
                        clientData.errCode = 0;
                        clientData.errMessage = 'OK';

                        delete client.password;
                        clientData.client = client;
                    }
                    else {
                        clientData.errCode = 3;
                        clientData.errMessage = 'Sai mật khẩu';
                    }
                }
                else {
                    clientData.errCode = 2;
                    clientData.errMessage = `Không tìm thấy người dùng`
                }
            }
            else {
                clientData.errCode = 1;
                clientData.errMessage = 'Email không tồn tại. Vui lòng kiểm tra email!'
            }
            resolve(clientData)
        } catch (e) {
            rejects(e)
        }
    })
}

let checkClientEmail = (clientEmail) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let client = await db.Client.findOne({
                where: { email: clientEmail }
            })
            if (client) {
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

let getAllClients = (clientId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clients = '';
            if (clientId === 'ALL') {
                clients = await db.Client.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (clientId && clientId !== 'ALL') {
                clients = await db.Client.findOne({
                    where: { id: clientId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(clients)
        }
        catch (e) {
            reject(e);
        }
    })
}

let createNewClient = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist
            let check = await checkClientEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email đã được sử dụng, vui lòng chọn email khác!!!'
                })
            } else {
                let hashClientPasswordFromBcrypt = await hashClientPassword(data.password);
                await db.Client.create({
                    email: data.email,
                    password: hashClientPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    phone: data.phone,
                    roleid: data.roleid,
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
let deleteClient = (clientId) => {
    return new Promise(async (resolve, reject) => {
        let foundClient = await db.Client.findOne({
            where: { id: clientId }
        })
        if (!foundClient) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
        await db.Client.destroy({
            where: { id: clientId }
        })
        resolve({
            errCode: 0,
            errMessage: `The client is delete`
        })
    })
}
let updateClientData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleid || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let client = await db.Client.findOne({
                where: { id: data.id },
                raw: false
            })
            if (client) {
                client.firstName = data.firstName;
                client.lastName = data.lastName;
                client.address = data.address;
                client.phone = data.phone;
                client.gender = data.gender;
                client.roleid = data.roleid;
                if (data.avatar) {
                    client.image = data.avatar;
                }
                await client.save();
                resolve({
                    errCode: 0,
                    message: 'Update the client succeeds!!!!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Client's not found!!!`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

// let getLoaitkService = (typeInput) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!typeInput) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Missing required parameters !'
//                 })
//             }
//             else {
//                 let res = {};
//                 let loaitk = await db.Loaitk.findAll({
//                     where: { type: typeInput }
//                 });
//                 res.errCode = 0;
//                 res.data = loaitk;
//                 resolve(res);
//             }
//         } catch (e) {
//             reject(e);
//         }
//     })
// }

module.exports = {
    handleClientLogin: handleClientLogin,
    getAllClients: getAllClients,
    createNewClient: createNewClient,
    deleteClient: deleteClient,
    updateClientData: updateClientData,
    // getLoaitkService: getLoaitkService,
}