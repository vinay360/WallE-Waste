// // const twilio = require('twilio');
const accountSid = '########################'; // Your Account SID from www.twilio.com/console
const authToken = '######################'; // Your Auth Token from www.twilio.com/console

// const twilio = require('twilio');
// const client = new twilio(accountSid, authToken);

// client.messages
//   .create({
//     body: 'Hello your otp for order id 69696 is 69696!',
//     to: '+917851875570', // Text this number
//     from: '+18454796532', // From a valid Twilio number
//   })
//   .then((message) => console.log(message.sid));

function sendOtp(mobileNo,otp,orderID){
    const client = require('twilio')(accountSid, authToken);
    client.messages
    .create({body: `Hi, OTP for order id ${orderID}  is ${otp}!`, from: '+18454796532', to: `+917851875570`})
    .then(message => console.log(message.sid));
}

// sendOtp('+919769857233',"1234","5678")
module.exports.sendOtp = sendOtp;

// const client = require('twilio')(accountSid, authToken);
//     client.messages
//     .create({body: `Hi, OTP for order id is `, from: '+19377779515', to: `+919769857233`})
//     .then(message => console.log(message.sid));
