// models/comment.js

import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const Workshopcomment = sequelize.define(
  "workshopcomment",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING(1000), // You can adjust the length as needed
      allowNull: false,
    },
    division: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tableName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Workshopcomment;
