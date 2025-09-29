import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize"; 

const Debit = sequelize.define(
  "debit",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Automatically generates UUID
      primaryKey: true,
    },
    dateTime: {
      type: DataTypes.STRING(255), // Storing dateTime as a string
      allowNull: false,
    },
    debitAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
    freezeTableName: true, // Prevents Sequelize from pluralizing table names
  }
);

module.exports = Debit;
