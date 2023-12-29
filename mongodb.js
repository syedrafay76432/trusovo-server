// const mongodb = require("mongodb")
// const MongoClient = mongodb.MongoClient
// const ObjectId = mongodb.ObjectId
const { MongoClient, ObjectId } = require("mongodb")


const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("error")
    }
    const db = client.db(databaseName)
    db.collection('users').find({ age: 25 }).countDocuments((error, user) => {
        if (error) {
            return console.log("Unable to connect")

        }
        console.log(user)
    })
        
    db.collection('users').insertOne({
        name: "ali",
        age: 25
    }, (error, result) => {
        if (error) {
            console.log("Unable to connect")

        }
        console.log(result)
    })
    // db.collection('task').insertMany([
    //     {
    //         task:"cooking",
    //         describtion: "have to done for lunch",
    //         completer: true
    //     },
    //     {
    //         task:"mucking",
    //         describtion: "have to done for lunch",
    //         completer: true
    //     },
    //     {
    //         task:"playing",
    //         describtion: "have to done for lunch",
    //         completer:false
    //     }
    // ],(error , result)=>{
    //     if (error) {
    //         return console.log("Unable to insert")   
    //     }
    //     console.log(result)
    // })
})