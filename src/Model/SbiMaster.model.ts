const { DataTypes } = require("sequelize");
import sequelize from "../config/sequelize";

const SbiMaster = sequelize.define(
  "sbi_master",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: true,
    },
    accountNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ppoNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dateStart: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pensionType: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dateOfRetirement: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["ppoNumber"], // Index on newPPONo
      },
    ],
  }
);

module.exports = SbiMaster;
