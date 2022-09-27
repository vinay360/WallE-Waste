// // const twilio = require('twilio');
const accountSid = 'AC35c62cfe81eeda9388f8f1675a9ccb15'; // Your Account SID from www.twilio.com/console
const authToken = '72e33326cfa87c88f3cc1a4cc0946148'; // Your Auth Token from www.twilio.com/console

// const twilio = require('twilio');
// const client = new twilio(accountSid, authToken);

// client.messages
//   .create({
//     body: 'Hello your otp for order id 69696 is 69696!',
//     to: '+917851875570', // Text this number
//     from: '+19377779515', // From a valid Twilio number
//   })
//   .then((message) => console.log(message.sid));

function sendOtp(mobileNo,otp,orderID){
    const client = require('twilio')(accountSid, authToken);
    client.messages
    .create({body: `Hi, OTP for order id ${orderID}  is ${otp}!`, from: '+19377779515', to: `${mobileNo}`})
    .then(message => console.log(message.sid));
}

// sendOtp('+919769857233',"1234","5678")
module.exports.sendOtp = sendOtp;

// const client = require('twilio')(accountSid, authToken);
//     client.messages
//     .create({body: `Hi, OTP for order id is `, from: '+19377779515', to: `+919769857233`})
//     .then(message => console.log(message.sid));
