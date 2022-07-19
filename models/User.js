const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// Create User Model
class User extends Model {}

// Define table column and configuration
User.init(
  {
    // TABLE COLUMN DEFINITIONS GO HERE
    // define an id column
    id: {
      // use special Sequelize DataTypes object provides what type of data it is
      type: DataTypes.INTEGER,
      // equivalent to SQL  `NOT NULL` option
      allowNull: false,
      // instruct that this is the Primary Key
      primaryKey: true,
      // turn on auto increment
      autoIncrement: true,
    },
    // Define username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Define email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // there cannot be duplicate email values in this table
      unique: true,
      // if allowNull is set to fale, we can data trhough validators before creating the table data
      validate: {
        isEmail: true,
      },
    },
    // Define password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // passowrd must be at least 4 characters long
        len: [4],
      },
    },
  },
  {
    hooks: {
      // Set up beforeCreate lifecycle 'hook' functionality
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },

      // Set up beforeUpdate lifecycle 'hook' functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      },
    },
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)

    // pass in our imported sequelize connection (The direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in database
    modelName: 'user',
  }
);

module.exports = User;
