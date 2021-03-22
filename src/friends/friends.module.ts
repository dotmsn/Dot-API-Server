import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose';
import { FriendsResolver } from './friends.resolver';
import { FriendsService } from './friends.service';
import { FriendRequest, FriendRequestSchema } from './models/FriendRequest';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
  ],

  providers: [FriendsResolver, FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
