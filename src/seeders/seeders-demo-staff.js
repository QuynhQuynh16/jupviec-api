'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Staffs', [{
            email: 'thang11111@gmail.com',
            password: '123456',
            firstName: 'Thang',
            lastName: 'Phan',
            address: 'DongThap',
            gender: 'Nam',
            phone: '0704745647',
            roleId: 'R1',

            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },
    // firstName: DataTypes.STRING,
    // lastName: DataTypes.STRING,
    // email: DataTypes.STRING,
    // password: DataTypes.STRING,
    // address: DataTypes.STRING,
    // gender: DataTypes.STRING,
    // salary: DataTypes.INTEGER,
    // phone: DataTypes.INTEGER,
    // roleid: DataTypes.STRING,
    // star: DataTypes.STRING,
    // evaluate: DataTypes.STRING,
    // image: DataTypes.STRING
    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
