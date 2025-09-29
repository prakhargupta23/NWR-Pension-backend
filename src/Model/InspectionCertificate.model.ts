// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import { Certificate } from "crypto";

export const InspectionCertificate = sequelize.define(
  "InspectionCertificate",
  {
    SNo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    CertificateNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    PONo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Date: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ICCountNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    POSerialNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    InspectionQtyDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    OrderQty: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyOffered: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyNotDue: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyPassed: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    QtyRejected: {
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

