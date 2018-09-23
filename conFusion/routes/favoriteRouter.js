const express = require('express');
const bodyParser = require('body-parser');
const moongose = require('mongoose');
const Favorites = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id}, (err, favorite) =>
    {
        if (err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
        }
        else if (favorite){
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);           
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else
        {
            res.statusCode = 200;
            res.end('Favorites for user ' + req.user.username + ' not found!!!');
            return;
        }
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id}, (err, favorite) =>
    {
        if (favorite != null) {
            var dishes = req.body;
            for (var i = (dishes.length - 1); i >= 0; i--){
                if(favorite.dishes.indexOf(dishes[i]._id) == -1)
                    favorite.dishes.push(dishes[i]);
            }
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
        else {
            var favorite = {
                "user": req.user._id,
                "dishes": req.body
            }
            Favorites.create(favorite)
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }   
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id}, (err, favorite) =>{
        if (favorite != null) {
            favorite.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp); 
            }, (err) => next(err));
        }
        else {
            res.statusCode = 200;
            res.end('Favorites for user ' + req.user.username + ' not found!!!');
            return;
        } 
    });
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({
            user: req.user._id
        })
        .then((favorites) => {
            if (!favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({
                    "exists": false,
                    "favorites": favorites
                });
            } else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({
                        "exists": false,
                        "favorites": favorites
                    });
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({
                        "exists": true,
                        "favorites": favorites
                    });
                }
            }

        }, (err) => next(err))
        .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id}, (err, favorite) =>
    {
        if (favorite != null) {
            var toAdd = true;

            if(favorite.dishes.indexOf(req.params.dishId) != -1)
                toAdd = false;
            
            if (toAdd){
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
            }
            else {
                err = new Error('Dish ' + req.params.dishId + ' already added a favorite for user ' + req.user._id + '!!');
                err.status = 500;
                return next(err);
            }
        }
        else {
            var favorite = {
                "user": req.user._id,
                "dishes": req.params.dishId
            }
            Favorites.create(favorite)
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }   
    });
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id}, (err, favorite) =>
    {
        if (favorite != null) {
            var index = favorite.dishes.indexOf(req.params.dishId);
            if (index != -1){
                favorite.dishes.splice(index, 1);
                favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                                console.log('Favorite Dish Deleted!', favorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                    })
            }
            else {
                err = new Error('Dish ' + req.params.dishId + 
                    ' is not in the list of favorites for user ' + req.user._id + '!!');
                err.status = 404;
                return next(err);
            }  
        }
        else {
            err = new Error('No favorites for user ' + req.user._id + '!!');
            err.status = 404;
            return next(err);
        }   
    })
});

module.exports = favoriteRouter;

// const express = require('express');
// const bodyParser = require('body-parser');
// const authenticate = require('../authenticate');
// const mongoose = require('mongoose');
// const cors = require('./cors');
// const Favorite = require('../models/favorite');

// const favoriteRouter = express.Router();
// favoriteRouter.use(bodyParser.json());

// favoriteRouter.route('/')
//     .all(cors.corsWithOptions, authenticate.verifyUser)
//     .get(function (req, res, next) {
//         Favorite.find({'user': req.user._id})
//             .populate('user')
//             .populate('dishes')
//             .exec(function (err, favorites) {
//                 if (err) return err;
//                 res.json(favorites);
//             });
//     })

//     .post(function (req, res, next) {

//         Favorite.find({'user': req.user._id})
//             .exec(function (err, favorites) {
//                 if (err) throw err;
//                 req.body.user = req.user._id;

//                 if (favorites.length) {
//                     var favoriteAlreadyExist = false;
//                     if (favorites[0].dishes.length) {
//                         for (var i = (favorites[0].dishes.length - 1); i >= 0; i--) {
//                             favoriteAlreadyExist = favorites[0].dishes[i] == req.body._id;
//                             if (favoriteAlreadyExist) break;
//                         }
//                     }
//                     if (!favoriteAlreadyExist) {
//                         favorites[0].dishes.push(req.body._id);
//                         favorites[0].save(function (err, favorite) {
//                             if (err) throw err;
//                             console.log('Um somethings up!');
//                             res.json(favorite);
//                         });
//                     } else {
//                         console.log('Setup!');
//                         res.json(favorites);
//                     }

//                 } else {

//                     Favorite.create({user: req.body.user}, function (err, favorite) {
//                         if (err) throw err;
//                         favorite.dishes.push(req.body._id);
//                         favorite.save(function (err, favorite) {
//                             if (err) throw err;
//                             console.log('Something is up!');
//                             res.json(favorite);
//                         });
//                     })
//                 }
//             });
//     })

//     .
//     delete(function (req, res, next) {
//         Favorite.remove({'user': req.user._id}, function (err, resp) {
//             if (err) throw err;
//             res.json(resp);
//         })
//     });

// favoriteRouter.route('/:dishId')
//     .all(cors.corsWithOptions, authenticate.verifyUser)
//     .delete(function (req, res, next) {

//         Favorite.find({'user': req.user._id}, function (err, favorites) {
//             if (err) return err;
//             const favorite = favorites ? favorites[0] : null;

//             if (favorite) {
//                 for (const i = (favorite.dishes.length - 1); i >= 0; i--) {
//                     if (favorite.dishes[i] == req.params.dishId) {
//                         favorite.dishes.remove(req.params.dishId);
//                     }
//                 }
//                 favorite.save(function (err, favorite) {
//                     if (err) throw err;
//                     console.log('Here you go!');
//                     res.json(favorite);
//                 });
//             } else {
//                 console.log('No favourites!');
//                 res.json(favorite);
//             }

//         });
//     });

// module.exports = favoriteRouter;