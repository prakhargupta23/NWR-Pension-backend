// models/Earning.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const Earning = sequelize.define(
  "Earning",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    figure: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    actualLastFinancialYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    targetThisMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actualThisMonthLastYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actualThisMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    targetYTDThisMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actualYTDThisMonthLastYear: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    actualYTDThisMonth: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    subCategory: {
      type: DataTypes.STRING(255), // Pass, OCH etc.
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["division"],
      },
      {
        fields: ["date"],
      },
    ],
  }
);

module.exports = Earning;
