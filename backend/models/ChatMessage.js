const { DataTypes } = require('sequelize');

const sequelize = require('../config/db');

const ChatMessage = sequelize.define(
  'ChatMessage',
  {
    message_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    ride_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    sender_role: {
      type: DataTypes.ENUM(
        'driver',
        'passenger'
      ),
    },

    sender_name: {
      type: DataTypes.STRING,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },

  {
    tableName: 'chat_messages',

    timestamps: true,
  }
);

module.exports = ChatMessage;