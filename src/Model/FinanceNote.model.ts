// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const FinanceNote = sequelize.define(
  "FinanceNote",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false
    },
    CO6No: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Ld: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Sd: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Otherdedunctions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    NetPayment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Created: {
      type: DataTypes.DATE,
      allowNull: true
    }
      
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ["SNo"],
      },
    ],
  }
);

// module.exports = expenditurebills;
