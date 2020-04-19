const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const Objectid = mongodb.ObjectID;

const connectionUrl = 'mongodb+srv://mihir:brothersoft66@cluster0-wc1wq.mongodb.net/test';
const databaseName = 'task-manager';

MongoClient.connect(connectionUrl, { useNewUrlParser : true} , (error , client) => {
    if(error){
        return console.log('Unable to connecft to database')
    }
    console.log('Connected Succesfully');
    const db =client.db(databaseName)

    // db.collection('users').insertOne({
    //     name : 'Mihir',
    //     age : 20
    // },(error , result) => {
    //     if(error){
    //          return console.log('Unable to complete request')
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('users').insertMany([
    //     {
    //         name : 'Ishan',
    //         age : '19'
    //     },
    //     {
    //         name : 'Anuj',
    //         age : 20
    //     }
    // ], (error, result) => {
    //     if(error){
    //         console.log('Unable to process request')
    //     }
    //     console.log(result.ops)
    // })
    // const updatepromise = db.collection('users').updateOne({
    //     _id : new Objectid("5e88d5a5913fa52ad649cd13")
    // },{
       
    //     $inc : {
    //         age : 4
    //     }
    // })
    // updatepromise.then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    db.collection('users').deleteMany({
        age : 19
    }).then((result) => {
        console.log('Deleted Succesfully')
    }).catch((error) => {
        console.log('Error while executing Deleting command')
    })
})

