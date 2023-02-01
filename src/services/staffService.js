import db from "../models/index";
import bcrypt from 'bcryptjs';


const salt = bcrypt.genSaltSync(10);

let hashStaffPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashStaffPassword = await bcrypt.hashSync(password, salt);
            resolve(hashStaffPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let handleStaffLogin = (email, password) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let staffData = {};

            let isExist = await checkStaffEmail(email);
            if (isExist) {
                let staff = await db.Staff.findOne({
                    attributes: ['email', 'roleid', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (staff) {
                    //let check = true;
                    let check = await bcrypt.compareSync(password, staff.password); //false
                    if (check) {
                        staffData.errCode = 0;
                        staffData.errMessage = 'OK';

                        delete staff.password;
                        staffData.staff = staff;
                    }
                    else {
                        staffData.errCode = 3;
                        staffData.errMessage = 'Sai mật khẩu';
                    }
                }
                else {
                    staffData.errCode = 2;
                    staffData.errMessage = `Không tìm thấy người dùng`
                }
            }
            else {
                staffData.errCode = 1;
                staffData.errMessage = 'Email không tồn tại. Vui lòng kiểm tra email!'
            }
            resolve(staffData)
        } catch (e) {
            rejects(e)
        }
    })
}

let checkStaffEmail = (staffEmail) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let staff = await db.Staff.findOne({
                where: { email: staffEmail }
            })
            if (staff) {
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

let getAllStaffs = (staffId) => {
    return new Promise(async (resolve, rejects) => {
        try {
            let staffs = '';
            if (staffId === 'ALL') {
                staffs = await db.Staff.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (staffId && staffId !== 'ALL') {
                staffs = await db.Staff.findOne({
                    where: { id: staffId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(staffs)
        }
        catch (e) {
            rejects(e);
        }
    })
}

let createNewStaff = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email is exist
            let check = await checkStaffEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Email đã được sử dụng, vui lòng chọn email khác!!!'
                })
            } else {
                let hashStaffPasswordFromBcrypt = await hashStaffPassword(data.password);
                await db.Staff.create({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: hashStaffPasswordFromBcrypt,
                    address: data.address,
                    gender: data.gender,
                    phone: data.phone,
                    roleid: data.roleid,
                    image: data.avatar,
                    salary: data.salary,
                    // star: data.star,
                    // evaluate: data.evaluate
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
let deleteStaff = (staffId) => {
    return new Promise(async (resolve, reject) => {
        let foundStaff = await db.Staff.findOne({
            where: { id: staffId }
        })
        if (!foundStaff) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
        await db.Staff.destroy({
            where: { id: staffId }
        })
        resolve({
            errCode: 0,
            errMessage: `The user is delete`
        })
    })
}
let updateStaffData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleid || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }
            let staff = await db.Staff.findOne({
                where: { id: data.id },
                raw: false
            })
            if (staff) {
                staff.firstName = data.firstName;
                staff.lastName = data.lastName;
                staff.address = data.address;
                staff.phone = data.phone;
                staff.gender = data.gender;
                staff.roleid = data.roleid;
                staff.salary = data.salary;
                // staff.star = data.star;
                // staff.evaluate = data.evaluate;
                if (data.avatar) {
                    staff.image = data.avatar;
                }

                await staff.save();
                resolve({
                    errCode: 0,
                    message: 'Update the staff succeeds!!!!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `Staff's not found!!!`
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
    handleStaffLogin: handleStaffLogin,
    getAllStaffs: getAllStaffs,
    createNewStaff: createNewStaff,
    deleteStaff: deleteStaff,
    updateStaffData: updateStaffData,
    getLoaitkService: getLoaitkService,
}