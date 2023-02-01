import { rejects } from "assert";
import { resolve } from "path";
import db from "../models";
import clientService from "../services/clientService";

// let handleLogin = async (req, res) => {
//     let email = req.body.email;
//     let password = req.body.password;

//     if (!email || !password) {
//         return res.status(500).json({
//             errCode: 1,
//             message: 'Vui lòng nhập email hoặc password !!!'
//         })
//     }
//     let clientData = await clientService.handleClientLogin(email, password);
//     console.log(clientData)
//     return res.status(200).json({

//         errCode: clientData.errCode,
//         message: clientData.errMessage,
//         khachhang: clientData.khachhang ? clientData.khachhang : {}
//     })
// }

let handleGetAllClients = async (req, res) => {
    let id = req.query.id; //ALL, id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter",
            clients: []
        })
    }

    let clients = await clientService.getAllClients(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        clients
    })
}
let handleCreateNewClient = async (req, res) => {
    let message = await clientService.createNewClient(req.body);
    console.log(message);
    return res.status(200).json(message);
}
let handleEditClient = async (req, res) => {
    let data = req.body;
    let message = await clientService.updateClientData(data);
    return res.status(200).json(message)

}
let handleDeleteClient = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required prameters!!!"
        })
    }
    let message = await clientService.deleteClient(req.body.id);
    return res.status(200).json(message);
}
// let getLoaitk = async (req, res) => {
//     try {
//         let data = await clientService.getLoaitkService(req.query.type);
//         return res.status(200).json(data);
//     } catch (e) {
//         console.log('Get all code error: ', e)
//         return res.status(200).json({
//             errCode: -1,
//             errMessage: 'Error from server'
//         })
//     }
// }

module.exports = {
    //handleLogin: handleLogin,
    handleGetAllClients: handleGetAllClients,
    handleCreateNewClient: handleCreateNewClient,
    handleEditClient: handleEditClient,
    handleDeleteClient: handleDeleteClient,
    // getLoaitk: getLoaitk,

}