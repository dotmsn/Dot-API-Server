import { UsersModule } from 'src/modules/users/users.module';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { FriendRequest, FriendRequestSchema } from './friends.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
    ]),
    UsersModule,
  ],
  providers: [FriendsResolver, FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
