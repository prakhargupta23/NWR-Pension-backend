import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const hrinspection = sequelize.define(
  "rbinespection",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    yearOfReport: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    typeOfPara: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    totalParas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parasAtStartOfMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    closedDuringMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    parasOutstanding: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = hrinspection;
