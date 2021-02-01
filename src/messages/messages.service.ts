import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Message, MessageDocument } from './models/message';
import { User } from '../user/models/user';
import { ChannelService } from '../channel/channel.service';

import {
    CreateMessageInput,
    UpdateMessageInput,
    FetchMessageInput,
} from './messages.inputs';
import { handleMongoError } from 'src/utils/error.utils';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name)
        private readonly MessageModel: Model<MessageDocument>,

        private readonly channelService: ChannelService,
    ) {}

    public async create(author: User, payload: CreateMessageInput) {
        const channel = await this.channelService.getByID(payload.channel);

        if (!channel) {
            throw new BadRequestException(
                "The provided channel id isn't valid.",
                'INVALID_CHANNEL',
            );
        }

        let hasPermissions = false;

        for (const participant of channel.participants) {
            if (JSON.stringify(participant) == JSON.stringify(author))
                hasPermissions = true;
        }

        if (!hasPermissions) {
            throw new UnauthorizedException(
                "You don't have permissions to send messages to this channel.",
                'NO_CHANNEL_PERMISSION',
            );
        }
        const Message = new this.MessageModel({
            author,
            channel,
            channelId: channel._id,
            content: payload.content,
            readedBy: [author],
        });
        return Message.save();
    }

    public async fetchUnreaded(requester: User): Promise<Array<Message>> {
        const channels = await this.channelService.getChannels(requester);
        const messages = [];

        for (const channel of channels) {
            const fetchedMessages = await this.MessageModel.find({
                channelId: channel._id,
                readedBy: { $nin: [requester] },
            })
                .populate('channel')
                .populate({
                    path: 'channel',
                    populate: {
                        path: 'participants',
                        model: User.name,
                    },
                })
                .populate('author');

            for (const msg of fetchedMessages) {
                msg.readedBy.push(requester);
                await msg.save();
                messages.push(msg);
            }
        }

        return messages;
    }

    public async fetchMessages(
        requester: User,
        payload: FetchMessageInput,
    ): Promise<Array<Message>> {
        const channel = await this.channelService.getByID(payload.channel);

        if (!channel) {
            throw new BadRequestException(
                "The provided channel id isn't valid.",
                'INVALID_CHANNEL',
            );
        }

        let hasPermissions = false;

        for (const participant of channel.participants) {
            if (`${participant._id}` == `${requester._id}`)
                hasPermissions = true;
        }

        if (!hasPermissions) {
            throw new UnauthorizedException(
                "You don't have permissions to access this channel.",
                'NO_CHANNEL_PERMISSION',
            );
        }

        return this.MessageModel.find({ channelId: channel._id })
            .skip(payload.index)
            .limit(50)
            .populate('channel')
            .populate({
                path: 'channel',
                populate: {
                    path: 'participants',
                    model: User.name,
                },
            })
            .populate('author')
            .exec();
    }

    public async update(
        user: User,
        messageID: string,
        payload: UpdateMessageInput,
    ): Promise<Message | undefined> {
        const message = await this.MessageModel.findById(messageID);
        if (`${message.author._id}` != `${user._id}`) {
            throw new UnauthorizedException(
                "You don't have permissions to edit this message",
                'NO_MESSAGE_AUTHOR',
            );
        }

        message.content = payload.content;
        message.edited = true;

        return message.save().catch((e) => {
            throw handleMongoError(e);
        });
    }

    public async delete(user: User, id: string) {
        const message = await this.MessageModel.findOne({ _id: id });
        if (message) {
            if (`${message.author._id}` != `${user._id}`) {
                throw new UnauthorizedException(
                    "You don't have permissions to delete this message",
                    'NO_MESSAGE_AUTHOR',
                );
            } else {
                return await message.delete().catch((e) => {
                    throw handleMongoError(e);
                });
            }
        } else {
            throw new BadRequestException(
                "Message with this ID doesn't exists",
                'MESSAGE_NOT_FOUND',
            );
        }
    }
}
