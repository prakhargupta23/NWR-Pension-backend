// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const PurchaseOrder = sequelize.define(
  "PurchaseOrder",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    PONumber: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InspectionAgency: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    BasicRate: {
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
    OrderedQuantity: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    FreightCharges: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SecurityMoney: {
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

