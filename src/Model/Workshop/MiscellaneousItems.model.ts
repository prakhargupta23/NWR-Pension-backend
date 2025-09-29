import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const MiscellaneousItems = sequelize.define(
  "MiscellaneousItems",
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
    sNo: { type: DataTypes.STRING, allowNull: true },
    itemOfWork: { type: DataTypes.STRING, allowNull: true },
    positionAsPerLHR: { type: DataTypes.STRING, allowNull: true },
    ob: { type: DataTypes.STRING, allowNull: true },
    accretion: { type: DataTypes.STRING, allowNull: true },
    clearance: { type: DataTypes.STRING, allowNull: true },
    cb: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = MiscellaneousItems;
