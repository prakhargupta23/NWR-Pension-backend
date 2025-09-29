import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const PohUnitCost = sequelize.define(
  "PohUnitCost",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    division: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    figure: { type: DataTypes.STRING, allowNull: true },
    nameOfActivity: { type: DataTypes.STRING, allowNull: true },
    labour: { type: DataTypes.STRING, allowNull: true },
    material: { type: DataTypes.STRING, allowNull: true },
    onCostLabour: { type: DataTypes.STRING, allowNull: true },
    onCostStore: { type: DataTypes.STRING, allowNull: true },
    unitCostfortheMonth: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PohUnitCost;
