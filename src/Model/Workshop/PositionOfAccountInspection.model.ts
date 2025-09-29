import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const PositionOfAccountInspection = sequelize.define(
  "PositionOfAccountInspection",
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
    particular: { type: DataTypes.STRING, allowNull: true },
    noOfInspectionsDue: { type: DataTypes.STRING, allowNull: true },
    noOfOfficesInspected: { type: DataTypes.STRING, allowNull: true },
    moneyValueInvolvedinInspections: { type: DataTypes.STRING, allowNull: true },
    recoveries: { type: DataTypes.STRING, allowNull: true },
    noOfInspectionsOutstanding: { type: DataTypes.STRING, allowNull: true },
    reasonsForArrears: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PositionOfAccountInspection;
