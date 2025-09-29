import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const ScrapSale = sequelize.define(
  "ScrapSale",
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
    target: { type: DataTypes.STRING, allowNull: true },
    actualDuringTheMonth: { type: DataTypes.STRING, allowNull: true },
    actualUpToMonth: { type: DataTypes.STRING, allowNull: true },
    actualLastYear: { type: DataTypes.STRING, allowNull: true },
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = ScrapSale;


