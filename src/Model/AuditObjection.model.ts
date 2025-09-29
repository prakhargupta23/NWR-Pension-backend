// models/auditObjection.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const auditObjection = sequelize.define(
  "auditObjection",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    suspenseHeads: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    positionLhr: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    openingBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clearenceOverOneYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clearenceLessOneYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    accretion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    closingBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["suspenseHeads"],
      },
    ],
  }
);

module.exports = auditObjection;