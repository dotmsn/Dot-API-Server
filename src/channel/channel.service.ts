import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Channel, ChannelDocument } from './models/channel';
import { User } from '../user/models/user';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChannelService {
    constructor(
        @InjectModel(Channel.name)
        private readonly channelModel: Model<ChannelDocument>,

        private readonly userService: UserService,
    ) {}

    public getByID(id: string): Promise<Channel> {
        return this.channelModel
            .findOne({ _id: id })
            .populate('participants')
            .exec();
    }

    public async fetchChannel(
        type: string,
        participantsIds: Array<string>,
    ): Promise<Channel> {
        const participants = new Array<User>();

        for (const id of participantsIds) {
            const user = await this.userService.getByID(id);
            participants.push(user);
        }

        return this.channelModel
            .findOne({ type, participants: { $in: participants } })
            .populate('participants')
            .exec();
    }

    public async createChannel(type: string, participants: Array<string>) {
        if (type == 'dm') {
            const exists = await this.fetchChannel('dm', participants);
            if (exists) {
                return exists;
            }
        }

        const channel = await new this.channelModel({
            type,
            participants,
        }).populate('participants');

        return channel.save();
    }

    public async getChannels(user: User): Promise<Array<Channel>> {
        const channels = await this.channelModel
            .find({
                participants: { $in: [user] },
            })
            .populate('participants')
            .exec();

        return channels;
    }
}
