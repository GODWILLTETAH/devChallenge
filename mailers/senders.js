const transporter = require("./config");

const forgotPasswordSender = (recipient, name, code) => {
    const message = `
    <p>Hello ${name},</p>
    <p>You have requested to reset your password. Your reset code is: ${code}</p>
    <p>If you didn't request this, you can ignore this email.</p>
    `;

    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: recipient,
        subject: "Password Reset Request",
        html: message,
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

module.exports = {
    forgotPasswordSender
};
