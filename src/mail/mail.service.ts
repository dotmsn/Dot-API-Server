import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisCacheService } from 'src/cache/redis-cache.service';

import MailConfig from 'src/config/MailConfig';
import { User } from 'src/user/models/user';

import Mail from './mail';

import SES from './transporters/ses.transporter';

import { getMinutes, getSeconds } from '../utils/time.utils';

@Injectable()
export class MailService {

    constructor(private readonly cache: RedisCacheService) {}

    private async getCooldownStatus (mail: string): Promise<number> {
      const rawLastSend = await this.cache.get("mail_last_send:" + mail);
      const lastSend = rawLastSend ? parseInt(rawLastSend) : 0;

      return getSeconds(lastSend, Date.now());
    }

    private setCooldownStatus (mail: string): void {
      this.cache.set("mail_last_send:" + mail, `${Date.now()}`);
    }

    private getBody(layout: string, variables: Record<string, string>): string {
        let body = MailConfig.MAIL_TEMPLATE.replace('{layout}', layout);
        const keys = Object.keys(variables);
        for (const key of keys) {
            body = body.replace(`{${key}}`, variables[key]);
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

    public async sendRegisterConfirm(user: User): Promise<boolean> {
      const emailCooldown = await this.getCooldownStatus(user.email);

      if (emailCooldown < 300) {
        throw new BadRequestException("Wait (" + `${300 - emailCooldown}` + ") after request verification email again.", "EMAIL_VERIFICATION_COOLDOWN")
      } else {
        this.setCooldownStatus(user.email);
      }

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

      this.sendRawMail(mail);
      return true;
    }
}
