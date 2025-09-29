// models/accountInspection.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const accountInspection = sequelize.define(
  "accountInspection",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    typeOfReport: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    positionLhr: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    openingBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accretion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clearanceOverOneYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    closingBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clearanceLessThanOneYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["typeOfReport"],
      },
    ],
  }
);

module.exports = accountInspection;
