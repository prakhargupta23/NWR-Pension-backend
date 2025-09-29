import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const RotationOfStaff = sequelize.define(
  "RotationOfStaff",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    division: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    SNo: { type: DataTypes.STRING, allowNull: true },
    item: { type: DataTypes.STRING, allowNull: true },
    statusAndRemarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = RotationOfStaff; 