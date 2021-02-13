import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MailModule,
    ],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UserModule {}
