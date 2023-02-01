//import { READUNCOMMITTED } from 'sequelize/types/table-hints';
import db from '../models/index';
import CRUDService from '../services/CRUDService.js';


let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }

}
let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}
let getcrud = (req, res) => {
    return res.render('crud.ejs');
}
let postcrud = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message)
    return res.send('post crud from server')
}

let displayGetCrud = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log('----------------------')
    console.log(data)
    console.log('----------------------')
    return res.render('displaycrud.ejs', {
        dataTable: data
    })
}
let getEditCrud = async (req, res) => {
    let userId = req.query.id;

    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);

        return res.render('editcrud.ejs', {
            user: userData
        });
    }
    else {
        return res.send('User not found!');
    }
}


let putcrud = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    return res.render('displaycrud.ejs', {
        dataTable: allUser
    })
}
let deletecrud = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deteleUserById(id);
        return res.send('delete user')
    }
    else {
        return res.send('user not found')
    }

}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getcrud: getcrud,
    postcrud: postcrud,
    displayGetCrud: displayGetCrud,
    getEditCrud: getEditCrud,
    putcrud: putcrud,
    deletecrud: deletecrud

} 