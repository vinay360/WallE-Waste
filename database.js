const { MongoClient } = require("mongodb");

const accountSid = 'AC35c62cfe81eeda9388f8f1675a9ccb15'; // Your Account SID from www.twilio.com/console
const authToken = '72e33326cfa87c88f3cc1a4cc0946148'; // Your Auth Token from www.twilio.com/console

function sendOtp(mobileNo,otp,orderID){
    const client = require('twilio')(accountSid, authToken);
    client.messages
    .create({body: `Hi, OTP for order id ${orderID}  is ${otp}!`, from: '+19377779515', to: `${mobileNo}`})
    .then(message => console.log(message.sid));
}

// Replace the uri string with your connection string.
const uri ="mongodb://root:root@ac-zn2jlrl-shard-00-00.dtc2lff.mongodb.net:27017,ac-zn2jlrl-shard-00-01.dtc2lff.mongodb.net:27017,ac-zn2jlrl-shard-00-02.dtc2lff.mongodb.net:27017/?ssl=true&replicaSet=atlas-l8hou5-shard-0&authSource=admin&retryWrites=true&w=majority";


// Insert Functions
async function insertCitizen(name,email,password,phoneNo) {
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');

    try{
        // Connecting to the database
        const citizen = database.collection('Citizen');

        // Creating a doc to insert
        const doc = {
            "name" : name,
            "email" : email,
            "password": password,
            "phoneNumber" : phoneNo,
        };

        // Inserting using insertOne function.
        const result = await citizen.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    }
    finally{
        await client.close();
    }
}

module.exports.insertCitizen=insertCitizen;

async function insertOrder(email,category,amount,address,latitude,longitude,date,slot,image,orderId,phoneNo,otp) {
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    sendOtp(phoneNo,otp,orderId);
    try{
        // Connecting to the database
        const order = database.collection('Orders');

        // Creating a doc to insert
        const doc = {
            "email":email,
            "category": category,
            "amount": amount,
            "address": address,
            "coordinates" : {
                "latitude": latitude,
                "longitude": longitude
            },
            "date": date,
            "slot": slot,
            "image": image,
            "orderId":orderId,
            "phoneNo":phoneNo,
            "otp":otp,
            "Pending":true
        };

        // Inserting using insertOne function.
        const result = await order.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    }
    finally{
        await client.close();
    }
}

module.exports.insertOrder=insertOrder;

async function insertReceiver(name,email,password,phoneNo) {
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');

    try{
        // Connecting to the database
        const receiver = database.collection('garbageReceiver');

        // Creating a doc to insert
        const doc = {
            "name" : name,
            "email" : email,
            "password": password,
            "phoneNumber" : phoneNo,
        };

        // Inserting using insertOne function.
        const result = await receiver.insertOne(doc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    }
    finally{
        await client.close();
    }
}

module.exports.insertReceiver = insertReceiver;


// Query Function
async function findCitizen(email){
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    try{
        const citizen = database.collection('Citizen');

        // Creating a query
        const query = { "email" : email, };

        // Finding one
        const man = await citizen.findOne(query);
        // console.log(man);
        return man
    }
    finally{
        await client.close();
    }
}

async function findReceiver(email){
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    try{
        const receiver = database.collection('garbageReceiver');
        
        // Creating a query
        const query = { "email" : email, };
        
        // Finding one
        const man = await receiver.findOne(query);
        // console.log(man);
        return man;
    }
    finally{
        await client.close();
    }
}

module.exports.findReceiver = findReceiver;

async function findCitizenOrders(email){
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    try{
        const citizen = database.collection('Orders');
        
        // Creating a query
        const query = { "email" : email };
        
        // Finding one
        const man = await citizen.find(query).toArray();
        // console.log(man);
        return man
    }
    finally{
        await client.close();
    }
}

module.exports.findCitizenOrders = findCitizenOrders;

async function findPendingOrders(email){
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    try{
        const citizen = database.collection('Orders');
        
        // Creating a query
        const query = { "email" : email , "Pending" : true};
        
        // Finding one
        const man = await citizen.find(query).toArray();
        // console.log(man);
        return man
    }
    finally{
        await client.close();
    }
}

module.exports.findPendingOrders = findPendingOrders;

async function findCompletedOrders(email){
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    try{
        const citizen = database.collection('Orders');
        
        // Creating a query
        const query = { "email" : email , "Pending" : false};
        
        // Finding one
        const man = await citizen.find(query).toArray();
        // console.log(man);
        return man
    }
    finally{
        await client.close();
    }
}

module.exports.findCompletedOrders = findCompletedOrders;

async function ordersDetails(orderId){
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    try{
        const citizen = database.collection('Orders');
        
        // Creating a query
        const query = { "orderId" : orderId };
        const man = await citizen.findOne(query);
        
        // Finding one
        // console.log(man);
        return man;
    }
    finally{
        await client.close();
    }
}
// ordersDetails(5061677773);

module.exports.ordersDetails = ordersDetails;

async function findCollectorOrders(){
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    try{
        const citizen = database.collection('Orders');

        // Creating a query
        const query = { "Pending" : true };

        const man = await citizen.find(query).toArray();
        // console.log(man);
        return man;
    }
    finally{
        await client.close();
    }
}

module.exports.findCollectorOrders = findCollectorOrders;

module.exports.findCitizen =findCitizen;

// async function insertOrder(email,category,amount,address,latitude,longitude,date,slot,image,orderId,phoneNo,otp) {
//     const client = new MongoClient(uri);
//     const database = client.db('EWasteManagement');
//     sendOtp(phoneNo,otp,orderId);
//     try{
//         // Connecting to the database
//         const order = database.collection('Orders');

//         // Creating a doc to insert
//         const doc = {
//             "email":email,
//             "category": category,
//             "amount": amount,
//             "address": address,
//             "coordinates" : {
//                 "latitude": latitude,
//                 "longitude": longitude
//             },
//             "date": date,
//             "slot": slot,
//             "image": image,
//             "orderId":orderId,
//             "phoneNo":phoneNo,
//             "otp":otp,
//             "Pending":true
//         };

//         // Inserting using insertOne function.
//         const result = await order.insertOne(doc);
//         console.log(`A document was inserted with the _id: ${result.insertedId}`);
//     }
//     finally{
//         await client.close();
//     }
// }

async function updateValidationStatus(collectorsEmail,Id) {
    const client = new MongoClient(uri);
    const database = client.db('EWasteManagement');
    try{
        const citizen = database.collection('Orders');
        const filter = {orderId: Id};
        const options = {upsert: true};
        const updateStatus = {$set: {
            Pending: false},
        };
        const updateEmail = {$set: {
            collectorsEmailId: collectorsEmail},
        };
        const result1 = await citizen.updateOne(filter, updateStatus, options);
        const result2 = await citizen.updateOne(filter, updateEmail, options);
    }
    finally{
        await client.close();
    }
}
module.exports.updateValidationStatus = updateValidationStatus;
//updateValidationStatus("shdb",2523323624);
updateValidationStatus("shdb",8051644361);