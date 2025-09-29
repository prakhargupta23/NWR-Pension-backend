// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const ExpenditureReport = sequelize.define(
  "ExpenditureReport",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false
    },
    IREPSNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Status: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    PONo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Consignee: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InvoiceNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InvoiceDate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RNoteNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyAccepted: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TotalAmt: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Security: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Remarks: {
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
