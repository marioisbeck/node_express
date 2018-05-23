const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';

// following line instead of the commented once, as
// useMongoClient is no longer required by mongoose
const connect = mongoose.connect(url)
// const connect = mongoose.connect(url, {
//     useMongoClient: true
// });

// adjusted the following two lines because of mongo v3.x
connect.then((db) => {
    var db = mongoose.connection;

    console.log('Connected correctly to server');

    Dishes.create({
        name: 'Fun7',
        description: 'test'
    })
    .then((dish) => {
        console.log(dish);

        return Dishes.find({}).exec();
    })
    .then((dishes) => {
        console.log(dishes);

        return db.collection('dishes').drop();
    })
    .then(() => {
        return db.close();
    })
    .catch((err) => {
        console.log(err);
    });

});