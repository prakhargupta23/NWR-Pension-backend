import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const PositionOfImpRecoverableItems = sequelize.define(
  "PositionOfImpRecoverableItems",
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
    sn: { type: DataTypes.STRING, allowNull: true },
    nameOfParty: { type: DataTypes.STRING, allowNull: true },
    itemsCategory: { type: DataTypes.STRING, allowNull: true },
    itemsDescription: { type: DataTypes.STRING, allowNull: true },
    period: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.STRING, allowNull: true },  // changed from FLOAT → STRING
    remarks: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = PositionOfImpRecoverableItems;
