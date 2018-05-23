const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/conFusion';

// had to add the following two lines to make the example work with mongoDB version: v3.6.5 
MongoClient.connect(url, (err, client) => {
    var db = client.db('mytestingdb');

    assert.equal(err,null);

    console.log('Connected correctly to server');

    const collection = db.collection("dishes");
    collection.insertOne({"name": "Uthappizza", "description": "test"},
    (err, result) => {
        assert.equal(err,null);

        console.log("After Insert:\n");
        console.log(result.ops);

        collection.find({}).toArray((err, docs) => {
            assert.equal(err,null);
            
            console.log("Found:\n");
            console.log(docs);

            db.dropCollection("dishes", (err, result) => {
                assert.equal(err,null);

                // had to change db.close() to client.close()
                client.close();
            });
        });
    });

});


// // Keep the URL intact, but add the following variable to your connect function.
// connect.then((db) => {
//   var db = mongoose.connection;
// });