'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Users', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: new Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
          type: new Sequelize.STRING,
          allowNull: false,
      },
      middleName: {
          type: new Sequelize.STRING,
          allowNull: false,
      },
      email: {
          type: new Sequelize.STRING,
          allowNull: false,
      },
      password: {
          type: Sequelize.STRING,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,
      },
      temporaryPassword: {
          type: Sequelize.STRING,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,
      }, 
      avatar: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
      },
      token: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,

      },
      lastLogin: {
          type: Sequelize.DATE,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,

      },
      contactNo: {
          type: Sequelize.STRING,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,

      },
      invalidAttempts: {
          type: Sequelize.INTEGER,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,

      },
      iamAdmin:{
          type: Sequelize.BOOLEAN,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,
          defaultValue: false
      },
      loggedIn:{
          type: Sequelize.BOOLEAN,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,
          defaultValue: false
      },
      active: {
          type: Sequelize.BOOLEAN,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,
          defaultValue: true
      },
      createdById: {
          type: Sequelize.INTEGER,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,

      },
      modifiedById: {
          type: Sequelize.INTEGER,
          unique: false,
          allowNull: true,
          autoIncrement: false,
          primaryKey: false,
      },
      createdAt:{
        type: Sequelize.DATE,
        unique: false,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false, 
      },
      deletedAt:{
        type: Sequelize.DATE,
        unique: false,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false, 
      },
      updatedAt:{
        type: Sequelize.DATE,
        unique: false,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false, 
      } 
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
