// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const TaxInvoice = sequelize.define(
  "TaxInvoice",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    SupplierName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SupplierAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    GstNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SupplierPAN: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    CIN: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InvoiceNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Date: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Quantity: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Rate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    FreightCharges: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    GSTAmt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TotalAmt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Destination: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    DispatchThrough: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    EwayBillNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    BillOfLanding: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    HsnCode: {
      type: DataTypes.TEXT,
      allowNull: true,
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

