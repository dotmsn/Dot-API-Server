import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Channel } from './models/channel';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/user/models/user';
import { ChannelService } from './channel.service';

@Resolver(() => Channel)
export class ChannelResolver {
    constructor(private channelService: ChannelService) {}

    @Query(() => [Channel])
    @UseGuards(GqlAuthGuard)
    public async listChannels(@CurrentUser() user: User) {
        return this.channelService.getChannels(user);
    }

    @Query(() => [Channel])
    @UseGuards(GqlAuthGuard)
    public async fetchDM(
        @CurrentUser() user: User,
        @Args('target') target: string,
    ) {
        return this.channelService.fetchChannel('dm', [user._id, target]);
    }

    @Mutation(() => Channel)
    @UseGuards(GqlAuthGuard)
    public async createDM(
        @CurrentUser() user: User,
        @Args('target') target: string,
    ) {
        return this.channelService.createChannel('dm', [user._id, target]);
    }
}
