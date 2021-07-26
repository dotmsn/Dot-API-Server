import { UsersService } from 'src/modules/users/users.service';
import { FriendsService } from './friends.service';
import { FriendRequest } from './friends.model';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { CurrentUser } from 'src/common/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { User } from '../users/users.model';

@Resolver(() => FriendRequest)
export class FriendsResolver {
    constructor (
        private friendsService: FriendsService,
        private usersService: UsersService
    ) {}

    @UseGuards(GqlAuthGuard)
    @Mutation(() => FriendRequest)
    async createFriendRequest(@CurrentUser() currentUser: User, @Args('target') target: string) {
        const targetUser = await this.usersService.getByID(target);
        return await this.friendsService.create(currentUser._id, targetUser ? targetUser._id : null);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [FriendRequest])
    async incomingFriendRequests (@CurrentUser() currentUser: User) {
        return await this.friendsService.getIncomingRequests(currentUser._id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [FriendRequest])
    async outgoingFriendRequests (@CurrentUser() currentUser: User) {
        return await this.friendsService.getOutgoingRequests(currentUser._id);
    }
}
