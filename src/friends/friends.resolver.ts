import { Resolver, Query } from '@nestjs/graphql';
import { FriendRequest } from './models/FriendRequest';
import { FriendsService } from './friends.service';
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from "src/auth/current-user.decorator";
import { User } from "src/user/models/user";

@Resolver(() => [FriendRequest])
export class FriendsResolver {

  constructor(private friendsService: FriendsService) {}

  @Query(() => [FriendRequest])
  @UseGuards(GqlAuthGuard)
  public fetchIncomingFriendRequests (
    @CurrentUser() currentUser: User
  ): Promise<Array<FriendRequest>> {
    return this.friendsService.getIncomingFriendRequests(currentUser);
  }

  @Query(() => [FriendRequest])
  @UseGuards(GqlAuthGuard)
  public fetchOutgoingFriendRequests (
    @CurrentUser() currentUser: User
  ): Promise<Array<FriendRequest>> {
    return this.friendsService.getOutgoingFriendRequests(currentUser);
  }

}
