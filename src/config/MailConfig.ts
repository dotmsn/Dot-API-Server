import fs from 'fs';

export default {
    // Available: ses
    MAIL_TRANSPORTER: 'ses',

    // Mail template for send all emails
    MAIL_TEMPLATE: fs
        .readFileSync('../../assets/mail_template.html')
        .toString(),
    REGISTRATION_LAYOUT: fs
        .readFileSync('../../assets/mail_registration.html')
        .toString(),

    // Addresses
    NO_REPLY: 'no-reply@example.com',

    // Accounts
    ACCOUNTS_ADDRESS: 'accounts@example.com',
    ACCOUNTS_SUBJECT: 'Account Manager',
};
