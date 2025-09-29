import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const TurnOverRatio = sequelize.define(
  "TurnOverRatio",
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
    year: { type: DataTypes.STRING, allowNull: true },
    OB: { type: DataTypes.STRING, allowNull: true },
    totalCredits: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
    TORAnnualTarget: { type: DataTypes.STRING, allowNull: true },
    TORupToMonth: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TurnOverRatio;


