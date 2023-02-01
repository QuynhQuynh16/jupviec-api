const {Sequelize} = require('sequelize');

const sequelize = new Sequelize ('nhutthangtestnodejs', 'root', null,{
    host:'localhost',
    dialect:'mysql',
    logging :false
});

let connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established succesfully.');
        } catch (error){
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;