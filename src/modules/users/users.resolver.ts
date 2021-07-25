import { CreateUserDto } from './dto/CreateUser.dto';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { PublicProfile, User } from './users.model';
import { CurrentUser } from '../../common/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import UpdateUserDto from './dto/UpdateUser.dto';

@Resolver(() => User)
export class UsersResolver {
    constructor (
        private usersService: UsersService
    ) {}

    /**
     * Validate what the user has entered and try to create a user with those values.
     * @param { CreateUserInput } payload Values ​​that will be saved in the user.
     * @returns { Promise<User> } Returns a promise that resolves to the created user.
     */
    @Mutation(() => User)
    async createUser(@Args('payload') payload: CreateUserDto): Promise<User> {
        return await this.usersService.create(payload);
    }

    @UseGuards(GqlAuthGuard)
    @Mutation(() => User)
    async updateUser(@CurrentUser() currentUser: User, @Args('payload') payload: UpdateUserDto): Promise<User> {
        return await this.usersService.update(currentUser._id, payload);
    }

    @Query(() => PublicProfile)
    async getUserByID(@Args('id') id: string): Promise<PublicProfile> {
        return await this.usersService.getByID(id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => User)
    async getCurrentUser(@CurrentUser() currentUser: User) {
        return currentUser;
    }
}
