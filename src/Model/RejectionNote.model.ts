// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const RejectionNote = sequelize.define(
  "RejectionNote",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false
    },
    MA: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    GSTR2A: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    CopyTaxIC: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Refund: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InvoiceCO6: {
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
