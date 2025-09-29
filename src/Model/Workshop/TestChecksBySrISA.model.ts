import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const TestChecksBySrISA = sequelize.define(
  "TestChecksBySrISA",
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
    doneBy: { type: DataTypes.STRING, allowNull: true },
    annualTarget: { type: DataTypes.STRING, allowNull: true },
    dueForTheMonth: { type: DataTypes.STRING, allowNull: true },
    dueUpToTheMonth: { type: DataTypes.STRING, allowNull: true },
    doneForTheMonth: { type: DataTypes.STRING, allowNull: true },
    doneUpToTheMonth: { type: DataTypes.STRING, allowNull: true },
    arrearsForTheMonth: { type: DataTypes.STRING, allowNull: true },
    arrearsUpToTheMonth: { type: DataTypes.STRING, allowNull: true },
    subject: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = TestChecksBySrISA;
