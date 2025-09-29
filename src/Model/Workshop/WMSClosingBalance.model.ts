import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const WMSClosingBalance = sequelize.define(
  "WMSClosingBalance",
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
    breakUp: { type: DataTypes.STRING, allowNull: true },
    Amount: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = WMSClosingBalance;
