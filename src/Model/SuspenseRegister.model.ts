// models/suspenseregisters.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

const suspenseregisters = sequelize.define(
  "suspenseregisters",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    suspenseHeads: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    positionItem: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    positionLhr: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    positionLhrItem: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    closingBalance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    closingBalanceItem: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    reconciliationMonth: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    indexes: [
      {
        fields: ["date"],
      },
      {
        fields: ["division"],
      },
      {
        fields: ["suspenseHeads"],
      },
    ],
  }
);

module.exports = suspenseregisters;
