'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Clients', [{
            email: 'nhut@gmail.com',
            password: '123456',
            firstName: 'nhut',
            lastName: 'thang11111',
            address: 'DongThap',
            gender: 'nam',
            phone: '0704735647',
            roleId: 'R1',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },
    //firstName: DataTypes.STRING,
    // lastName: DataTypes.STRING,
    // email: DataTypes.STRING,
    // password: DataTypes.STRING,
    // address: DataTypes.STRING,
    // gender: DataTypes.STRING,
    // phone: DataTypes.INTEGER,
    // roleid: DataTypes.STRING,
    // image: DataTypes.STRING
    down: async (queryInterface, Sequelize) => {

    }
};
