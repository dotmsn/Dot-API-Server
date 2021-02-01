import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { ChannelResolver } from './channel.resolver';
import { ChannelService } from './channel.service';
import { Channel, ChannelSchema } from './models/channel';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Channel.name, schema: ChannelSchema },
        ]),
        UserModule,
    ],
    providers: [ChannelResolver, ChannelService],
    exports: [ChannelService],
})
export class ChannelModule {}
