// models/savingthroughic.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const savingthroughic = sequelize.define(
  "savingthroughic",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    figure: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    actualUpToLastMonth: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    forTheMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    totalToEndOfMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(255),
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

module.exports = savingthroughic;
