// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const ModificationInvoice = sequelize.define(
  "ModificationAdvice",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    PONo: {
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
    POSr: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    PLNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    VCode: {
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

