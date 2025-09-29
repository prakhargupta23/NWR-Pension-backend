import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ITImplementationStatus = sequelize.define(
  "ITImplementationStatus",
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
    wams: { type: DataTypes.STRING, allowNull: true },
    yesorno: { type: DataTypes.STRING, allowNull: true },
    targetDate: { type: DataTypes.STRING, allowNull: true },
    actionPlanandRemarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ITImplementationStatus;


