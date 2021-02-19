'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FavoriteGenre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FavoriteGenre.belongsTo(models.User, {foreignKey: 'UserId'})
      FavoriteGenre.belongsTo(models.Genre, {foreignKey: 'GenreId'})
    }
  };
  FavoriteGenre.init({
    UserId: DataTypes.INTEGER,
    GenreId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FavoriteGenre',
  });
  return FavoriteGenre;
};