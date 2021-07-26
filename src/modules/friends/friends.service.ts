import { Model } from 'mongoose';
import { FriendRequest, FriendRequestDocument } from './friends.model';
import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(FriendRequest.name)
        private readonly friendRequestModel: Model<FriendRequestDocument>
    ) {}

    public async getIncomingRequests (user: string): Promise<FriendRequest[]> {
        const requests = await this.friendRequestModel.find({to: user});
        return requests;
    }

    public async getOutgoingRequests (user: string): Promise<FriendRequest[]> {
        const requests = await this.friendRequestModel.find({from: user});
        return requests;
    }

    public async getSpecificRequest (from: string, to: string): Promise<FriendRequest> {
        const friendRequest = await this.friendRequestModel.findOne({from, to});
        return friendRequest;
    }

    public async create (from: string, to: string): Promise<FriendRequest> {
        if (from == null || to == null) {
            throw new NotFoundException("USER_NOT_FOUND", "This user doesn't exist.");
        } else if (from == to) {
            throw new BadRequestException("CANNOT_FRIEND_YOURSELF", "You cannot sent a friend request yourself.");
        } else if (await this.getSpecificRequest(from, to)) {
            throw new NotAcceptableException("ALREADY_SENT_REQUEST", "You has already sent a friend request to this user.");
        } else if (await this.getSpecificRequest(to, from)) {
            throw new NotAcceptableException("ALREADY_INCOMING_REQUEST", "You has already an incoming friend request from this user.");
        } else {
            const friendRequest = new this.friendRequestModel({from, to});
            await friendRequest.save();
            return friendRequest;
        }
    }
}
