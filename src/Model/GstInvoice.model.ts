// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const GstInvoice = sequelize.define(
  "GstInvoice",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    TaxInvoiceNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    IREPSBillRegNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TaxInvoiceDate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InvoiceAmount: {
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
    RONo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RODate: {
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
    PORate: {
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
    SupplierName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SupplierAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SupplierGSTIN: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InspectionAgency: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    VenderCode: {
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

