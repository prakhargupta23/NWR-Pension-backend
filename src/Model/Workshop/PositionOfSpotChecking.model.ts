import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const PositionOfSpotChecking = sequelize.define(
  "PositionOfSpotChecking",
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
    spotCheckDuringMonth: { type: DataTypes.STRING, allowNull: true },       // changed from INTEGER
    spotCheckUpToMonth: { type: DataTypes.STRING, allowNull: true },         // changed from INTEGER
    recoveryDetectedDuringMonth: { type: DataTypes.STRING, allowNull: true }, // changed from FLOAT
    recoveryDetectedUpToMonth: { type: DataTypes.STRING, allowNull: true },   // changed from FLOAT
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PositionOfSpotChecking;
