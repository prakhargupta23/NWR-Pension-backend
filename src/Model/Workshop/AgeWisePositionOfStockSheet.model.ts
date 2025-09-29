import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const AgeWisePositionOfStockSheet = sequelize.define(
  "AgeWisePositionOfStockSheet",
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
    division: { type: DataTypes.STRING, allowNull: false },  // NOT NULL
    date: { type: DataTypes.STRING, allowNull: false },      // NOT NULL
    item: { type: DataTypes.STRING, allowNull: true },
    closingBalance: { type: DataTypes.STRING, allowNull: true },
    over3MonthsOld: { type: DataTypes.STRING, allowNull: true },
    over6MonthsOld: { type: DataTypes.STRING, allowNull: true },
    over1YearOld: { type: DataTypes.STRING, allowNull: true },
    over3YearsOld: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AgeWisePositionOfStockSheet;
