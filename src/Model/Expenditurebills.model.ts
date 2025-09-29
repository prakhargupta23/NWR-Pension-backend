// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import { InspectionCertificate } from "./InspectionCertificate.model";

export const expenditurebills = sequelize.define(
  "expenditurebills",
  {
    SNo: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    ReceiptNote: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    TaxInvoice: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    GSTInvoice: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ModificationAdvice: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    PurchaseOrder: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    InspectionCertificate: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    VerificationTime: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    AuthorizationCommittee: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    //uploads time for each document
    ReceiptNoteUploadTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    TaxInvoiceUploadTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    GSTInvoiceUploadTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ModificationAdviceUploadTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    PurchaseOrderUploadTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    InspectionCertificateUploadTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    NoteGeneration: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: true,  // Changed from false to true
    createdAt: 'createdAt', // This ensures createdAt is added
    updatedAt: false,  // This disables updatedAt
    indexes: [
      {
        fields: ["SNo"],
      },
      {
        fields: ["createdAt"], // Add index for sorting
      }
    ],
  }
);

// module.exports = expenditurebills;
