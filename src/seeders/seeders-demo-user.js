'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'thang@gmail.com',
      password: '123456',
      firstName: 'Thang',
      lastName: 'Phan',
      address: 'DongThap',
      gender: 1,
      phone: '0704745647',
      area: 'Tp.HCM',
      roleId: 'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  // email: DataTypes.STRING,
  // firstName: DataTypes.STRING,
  // lastName: DataTypes.STRING,
  // address: DataTypes.STRING,
  // gender: DataTypes.BOOLEAN,
  // phone: DataTypes.INTEGER,
  // khuvuc: DataTypes.STRING,
  // roleid: DataTypes.STRING,
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
