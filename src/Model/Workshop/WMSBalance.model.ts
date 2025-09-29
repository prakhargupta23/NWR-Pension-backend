import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const WMSBalance = sequelize.define(
  "WMSBalance",
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
    Particulars: { type: DataTypes.STRING, allowNull: true },
    ActualLY: { type: DataTypes.STRING, allowNull: true },
    ActualLLY: { type: DataTypes.STRING, allowNull: true },
    RGB: { type: DataTypes.STRING, allowNull: true },
    BPuptoMonth: { type: DataTypes.STRING, allowNull: true },
    ActualfortheMonth: { type: DataTypes.STRING, allowNull: true },
    ActualtotheEndofMonth: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = WMSBalance;
