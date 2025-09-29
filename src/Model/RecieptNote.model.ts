// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const ReceiptNote = sequelize.define(
  "RecieptNote",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    RNoteNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Date: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    VenderCode: {
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
    POAtNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    PLNo: {
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
    RNQuantity: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Rate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    POSrNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    FreightCharges: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InspectionAgency: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ICNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Dated: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InvoiceNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyInvoiced: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyReceived: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyAccepted: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyRejected: {
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

// module.exports = expenditurebills;
