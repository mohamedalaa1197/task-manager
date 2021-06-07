const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

let mailOptions = {
    from: '',
    to: '',
    subject: '',
    text: ''

};

transporter.sendMail(mailOptions, function(error, data) {

    if (error) {
        console.log("There is an Error!");
    } else {
        console.log("Email has been Sent!")
    }
})