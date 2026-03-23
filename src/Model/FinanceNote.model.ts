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
    Basic: {
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
    Gross: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    IncomeTax: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TDS: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Rate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Quantity: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    NetPayment: {
      type: DataTypes.TEXT,
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
