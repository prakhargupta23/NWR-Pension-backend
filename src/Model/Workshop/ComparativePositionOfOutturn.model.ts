import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ComparativePositionOfOutturn = sequelize.define(
  "ComparativePositionOfOutturn",
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
    nameOfActivity: { type: DataTypes.STRING, allowNull: true },
    targetAnnual: { type: DataTypes.STRING, allowNull: true },
    targetUptotheMonth: { type: DataTypes.STRING, allowNull: true },
    outturnfortheMonth: { type: DataTypes.STRING, allowNull: true },
    outturnUptotheMonth: { type: DataTypes.STRING, allowNull: true },
    outturnUptotheMonthofCorrospondingPeriod: { type: DataTypes.STRING, allowNull: true },
    difference: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ComparativePositionOfOutturn;
