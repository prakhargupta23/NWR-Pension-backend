import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const WorkshopManufacturingSuspense = sequelize.define(
  "WorkshopManufacturingSuspense",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    index: { type: DataTypes.INTEGER, allowNull: true },
    division: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    figure: { type: DataTypes.STRING, allowNull: true },
    foriegnRailwayTransactions: { type: DataTypes.STRING, allowNull: true },
    duringtheMonth: { type: DataTypes.STRING, allowNull: true },
    upToMonth: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = WorkshopManufacturingSuspense;


