const { FavoriteGenre } = require('../models')
const { Op } = require("sequelize");

class Controller {
    static getAll(req, res, next) {
        const UserId = +req.UserId

        FavoriteGenre.findAll({
            where: { UserId }
        })
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                console.log(err)
                next()
            })
    }

    static addFavGenre(req, res, next) {
        const fav = {
            UserId: +req.UserId,
            Genre: req.body.genre
        }

        FavoriteGenre.findOne({
            where: {
                [Op.and]: [
                    { UserId: +req.UserId },
                    { Genre: req.body.genre }
                ]
            }
        })
            .then(data => {
                if (data) {
                    throw ({ msg: 'Item already existed' })
                } else {
                    return FavoriteGenre.create(fav)
                }
            })
            .then(data => {
                const sent = {
                    id: data.id,
                    genre: data.Genre
                }
                console.log(sent)
                res.status(201).json(sent)
            })
            .catch(err => {
                console.log(err)
                // next()
            })
    }

    static deleteFavGenre(req, res, next) {
        const id = +req.params.id

        FavoriteGenre.findOne({
            where: { id }
        })
            .then(data => {
                if (!data) {
                    res.status(404).json({ error: 'Item not found' })
                }

                return FavoriteGenre.destroy({
                    where: { id }
                })
            })
            .then(data => {
                res.status(200).json({ message: 'Genre successfully deleted' })
            })
            .catch(err => {
                res.status(500).json({ error: 'Internal Server Error' })
            })
    }
}

module.exports = Controller