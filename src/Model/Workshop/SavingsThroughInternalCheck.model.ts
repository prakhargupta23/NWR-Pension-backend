import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const SavingsThroughInternalCheck = sequelize.define(
  "SavingsThroughInternalCheck",
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
    SNo: { type: DataTypes.STRING, allowNull: true },
    particulars: { type: DataTypes.STRING, allowNull: true },
    actualSavingUpToLastMonth: { type: DataTypes.STRING, allowNull: true },
    savingDuringMonth: { type: DataTypes.STRING, allowNull: true },
    savingUpToTheMonth: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = SavingsThroughInternalCheck;
