import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/models/user';
import { FriendRequest, FriendRequestDocument } from './models/FriendRequest';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly FriendRequestModel: Model<FriendRequestDocument>
  ) {}

  public async getIncomingFriendRequests (user: User): Promise<Array<FriendRequest>> {
    const requests = await this.FriendRequestModel.find({
      to: user
    });

    return requests;
  }

  public async getOutgoingFriendRequests (user: User): Promise<Array<FriendRequest>> {
    const requests = await this.FriendRequestModel.find({
      from: user
    });

    return requests;
  }
}
