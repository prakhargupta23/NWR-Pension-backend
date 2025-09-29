import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";

const AssistanceRequiredFromHO = sequelize.define(
  "AssistanceRequiredFromHO",
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
    figure: { type: DataTypes.STRING, allowNull: true },
    sr: { type: DataTypes.STRING, allowNull: true },
    suspenseHead: { type: DataTypes.STRING, allowNull: true },
    item: { type: DataTypes.STRING, allowNull: true },
    amount: { type: DataTypes.STRING, allowNull: true },
    year: { type: DataTypes.STRING, allowNull: true },
    totalForHead: { type: DataTypes.STRING, allowNull: true },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = AssistanceRequiredFromHO;
