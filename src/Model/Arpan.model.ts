import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const Arpan = sequelize.define(
  "arpan",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: true,
    },
    fileNo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dateOfTransaction: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    typeOfPension: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    originalPensionerName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    newPPONo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    oldPPONo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    currentPensionerName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    railwayDept: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    monthOfPension: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    basicPensionAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    deduction: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    residualPension: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    fixMedicalAllowance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    additionalPension80Plus: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    daOnBasicPension: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalPension: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    basicCategory: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    basicMismatch: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    commutationCategory: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    commutationMismatch: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    month: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["newPPONo"], // Index on newPPONo
      },
      {
        fields: ["oldPPONo"], // Index on oldPPONo
      },
    ],
  }
);

module.exports = Arpan;
