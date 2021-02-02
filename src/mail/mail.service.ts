import { Injectable } from '@nestjs/common';

import MailConfig from 'src/config/MailConfig';
import { User } from 'src/user/models/user';

import Mail from './mail';

import SES from './transporters/ses.transporter';

@Injectable()
export class MailService {
    private getBody(layout: string, variables: Record<string, string>): string {
        let body = MailConfig.MAIL_TEMPLATE.replace('{layout}', layout);
        const keys = Object.keys(variables);
        for (const key of keys) {
            body = body.replace(key, variables[key]);
        }

        return body;
    }

    private getTransporter(name: string) {
        switch (name.toLowerCase()) {
            case 'ses':
                return SES;

            default:
                throw new Error(name + " isn't a valid Mail transporter");
        }
    }

    public async sendRawMail(mail: Mail): Promise<void> {
        const transporter = this.getTransporter(MailConfig.MAIL_TRANSPORTER);
        await transporter.sendMail(mail.toJSON());
    }

    public sendRegisterConfirm(user: User): Promise<void> {
        const mail = new Mail({
            to: user.email,
            from: MailConfig.ACCOUNTS_ADDRESS,
            subject: MailConfig.ACCOUNTS_SUBJECT,
            body: this.getBody(MailConfig.REGISTRATION_LAYOUT, {
                id: user._id,
                username: user.username,
                token: user.confirm_token,
            }),
        });

        return this.sendRawMail(mail);
    }
}
