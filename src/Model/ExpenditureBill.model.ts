// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const ExpenditureBill = sequelize.define(
  "ExpenditureBill",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false
    },
    TaxInvoiceNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TaxInvoiceDate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TaxInvoiceAmt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RNoteNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RNoteDate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RNoteQty: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RNoteValue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    POSrNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    PLNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    PONo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    HSNCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
      
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
