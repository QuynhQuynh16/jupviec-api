import staffService from "../services/staffService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Vui lòng nhập email hoặc password !!!'
        })
    }
    let staffData = await staffService.handleStaffLogin(email, password);
    console.log(staffData)
    return res.status(200).json({

        errCode: staffData.errCode,
        message: staffData.errMessage,
        staff: staffData.staff ? staffData.staff : {}
    })
}

let handleGetAllStaffs = async (req, res) => {
    let id = req.query.id; //ALL, id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter",
            staffs: []
        })
    }

    let staffs = await staffService.getAllStaffs(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        staffs
    })
}
let handleCreateNewStaff = async (req, res) => {
    let message = await staffService.createNewStaff(req.body);
    console.log(message);
    return res.status(200).json(message);
}
let handleEditStaff = async (req, res) => {
    let data = req.body;
    let message = await staffService.updateStaffData(data);
    return res.status(200).json(message)

}
let handleDeleteStaff = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required prameters!!!"
        })
    }
    let message = await staffService.deleteStaff(req.body.id);
    return res.status(200).json(message);
}
let getLoaitk = async (req, res) => {
    try {
        let data = await userService.getLoaitkService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get all code error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllStaffs: handleGetAllStaffs,
    handleCreateNewStaff: handleCreateNewStaff,
    handleEditStaff: handleEditStaff,
    handleDeleteStaff: handleDeleteStaff,
    getLoaitk: getLoaitk,

}