import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ReportOnFacilityAugmentation = sequelize.define(
  "ReportOnFacilityAugmentation",
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
    description: { type: DataTypes.STRING, allowNull: true },
    existingAtStart: { type: DataTypes.STRING, allowNull: true },
    additionsDuringMonth: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ReportOnFacilityAugmentation;
