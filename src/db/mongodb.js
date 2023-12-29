const { MongoClient } = require("mongodb")


const connectionURL = 'mongodb://127.0.0.1:27017'//127.0.0.1 is localhost ip.we want to connect local host server which is running in our first terminal tabs
const databseName = 'practicing_mongodb'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log("CAN't connect db")
    }
    const db = client.db(databseName)
    // db.collection('admin').insertOne({
    //     name: "Ayan",
    //     age : 17
    // },(error,user)=>{
    //     if(error){
    //         console.log(error)
    //     }
    //     console.log(user)
    // })
    // db.collection('admin').findOne({name:"Ayan"}
    // ,(error,user)=>{
    // if(error){
    //     console.log(error)
    // }
    //         console.log(user)
        // }
        // ).then((r)=>{
            // console.log(r)
        // })
    db.collection('admin').find({}).toArray(
        (error, user) => {
            if (error) {
                console.log(error)
            }
            console.log(user)
        }
    )

})