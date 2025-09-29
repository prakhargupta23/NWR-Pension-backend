// models/stocksheets.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const stocksheets = sequelize.define(
  "stocksheets",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    openingBalanceAsLastYearMonth: {
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
    accretionUpToMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clearanceUpToMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    closingBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["division"],
      },
    ],
  }
);

module.exports = stocksheets;
