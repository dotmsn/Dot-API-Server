import nodemailer from 'nodemailer';
import aws from 'aws-sdk';

aws.config.update({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
});

export default nodemailer.createTransport({
    SES: new aws.SES({
        apiVersion: '2010-12-01',
    }),
});
