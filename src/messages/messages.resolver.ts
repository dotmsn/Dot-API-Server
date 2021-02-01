import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Message } from './models/message';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MessageService } from './messages.service';
import {
    CreateMessageInput,
    UpdateMessageInput,
    FetchMessageInput,
    DeleteMessageInput,
} from './messages.inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { validateMessagePayload } from '../validations/message.validator';
import { User } from 'src/user/models/user';

@Resolver(() => Message)
export class MessageResolver {
    constructor(private MessageService: MessageService) {}
    private validatePayload(payload: CreateMessageInput | UpdateMessageInput) {
        const exception = validateMessagePayload(payload);
        if (exception) throw exception;
    }

    @Query(() => [Message])
    @UseGuards(GqlAuthGuard)
    public async fetchMessages(
        @CurrentUser() currentUser: User,
        @Args('payload') payload: FetchMessageInput,
    ): Promise<Array<Message>> {
        const result = await this.MessageService.fetchMessages(
            currentUser,
            payload,
        );

        return result;
    }

    @Query(() => [Message])
    @UseGuards(GqlAuthGuard)
    public async fetchUnreadedMessages(
        @CurrentUser() currentUser: User,
    ): Promise<Array<Message>> {
        const result = await this.MessageService.fetchUnreaded(currentUser);

        return result;
    }

    @Mutation(() => Message)
    @UseGuards(GqlAuthGuard)
    public async updateMessage(
        @CurrentUser() currentUser: User,
        @Args('payload') payload: UpdateMessageInput,
    ): Promise<Message | { error: string; message: string }> {
        this.validatePayload(payload);
        return await this.MessageService.update(
            currentUser,
            payload.id,
            payload,
        );
    }

    @Mutation(() => Message)
    @UseGuards(GqlAuthGuard)
    public async deleteMessage(
        @CurrentUser() currentUser: User,
        @Args('payload') payload: DeleteMessageInput,
    ): Promise<Message | { error: string; message: string }> {
        return await this.MessageService.delete(currentUser, payload.id);
    }

    @Mutation(() => Message)
    @UseGuards(GqlAuthGuard)
    async createMessage(
        @CurrentUser() currentUser: User,
        @Args('payload') payload: CreateMessageInput,
    ): Promise<Message> {
        this.validatePayload(payload);
        return await this.MessageService.create(currentUser, payload);
    }
}
