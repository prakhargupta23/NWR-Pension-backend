import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const WmsStoreCharges = sequelize.define(
  "WmsStoreCharges",
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
    figure: { type: DataTypes.STRING, allowNull: true },
    actualLLYMonth: { type: DataTypes.STRING, allowNull: true },
    actualLLYAmount: { type: DataTypes.STRING, allowNull: true },
    actualLYMonth: { type: DataTypes.STRING, allowNull: true },
    actualLYAmount: { type: DataTypes.STRING, allowNull: true },
    actualMonth: { type: DataTypes.STRING, allowNull: true },
    actualAmount: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = WmsStoreCharges;
