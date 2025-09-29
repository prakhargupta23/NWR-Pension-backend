// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const Logs = sequelize.define(
  "Logs",
  {
    createdTime: {
      type: DataTypes.DATE,
      primaryKey: true,
      allowNull: false,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    task: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    createdAt: true,
    updatedAt: true,
    timestamps: false,
  }
);
