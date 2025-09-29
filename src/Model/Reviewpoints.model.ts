// models/expenditure.js

import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const Reviewpoints = sequelize.define(
  "Reviewpoints",
  {
    SNo: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    Point: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ReviewedBy: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        name: "idx_reviewpoints_sno",
        unique: true,
        fields: ["SNo"],
      },
    ],
  }
);
