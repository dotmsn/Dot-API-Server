import fs from 'fs';
import { join } from 'path';

export default {
    // Available: ses
    MAIL_TRANSPORTER: 'ses',

    // Mail template for send all emails
    MAIL_TEMPLATE: fs
        .readFileSync(
            join(__dirname, '..', '..', 'assets', 'mail_template.html'),
        )
        .toString(),
    REGISTRATION_LAYOUT: fs
        .readFileSync(
            join(__dirname, '..', '..', 'assets', 'mail_registration.html'),
        )
        .toString(),

    // Addresses
    NO_REPLY: 'no-reply@dotmsn.com',

    // Accounts
    ACCOUNTS_ADDRESS: '"Dot Messenger" <accounts@dotmsn.com>',
    ACCOUNTS_SUBJECT: 'Verify your Dot account',
};
