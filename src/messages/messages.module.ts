import { Module } from '@nestjs/common';
import { MessageResolver } from './messages.resolver';
import { MessageService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './models/message';
import { ChannelModule } from 'src/channel/channel.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Message.name, schema: MessageSchema },
        ]),

        ChannelModule,
    ],
    providers: [MessageResolver, MessageService],
    exports: [MessageService],
})
export class MessageModule {}
