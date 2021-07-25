import { CreateUserDto } from './dto/CreateUser.dto';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CurrentUser } from '../../common/current-user.decorator';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';

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

    @Query(() => User)
    async getUserByID(@Args('id') id: string): Promise<User> {
        return await this.usersService.getByID(id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => User)
    async getCurrentUser(
        @CurrentUser() currentUser: User
    ) {
        return currentUser;
    }
}
