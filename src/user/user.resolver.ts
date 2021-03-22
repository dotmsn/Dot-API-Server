import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { User } from './models/user';
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput } from './user.inputs';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { handleMongoError } from 'src/utils/error.utils';
import { validateUserPayload } from '../validations/user.validator';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';

/*
  GraphQL exports these function automatically so that it is available on the frontend
*/
@Resolver(() => User)
export class UserResolver {
    constructor(private userService: UserService) {}

    /**
     * Validate that the data entered by the user is in a correct format.
     * @param { CreateUserInput | UpdateUserInput } payload Data entered by the user
     * @returns { void } Returns null if there is no problem, otherwise it throws an exception that GraphQL will handle.
     */
    private validatePayload(payload: CreateUserInput | UpdateUserInput) {
        const exception = validateUserPayload(payload);
        if (exception) throw exception;
    }

    /**
     * Get the data of the current user
     * * Requires user to be authenticated
     * @param user The user of the current session, this parameter is called with the "@CurrentUser" decorator using GqlAuthGuard authentication
     * @returns {user}
     */
    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    public currentUser(@CurrentUser() user: User): User {
        return user;
    }

    /**
     * Validate and modify the logged in user with the specified values.
     * Note: Requires user to be authenticated
     * @param { User } user The user of the current session, this parameter is called with the "@CurrentUser" decorator using GqlAuthGuard authentication
     * @param { UpdateUserInput } payload Values ​​that will be updated in the user.
     * @returns { Promise<User> } Returns a promise that resolves to the created user.
     */
    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)
    public async updateUser(
        @CurrentUser() user: User,
        @Args('payload') payload: UpdateUserInput,
    ): Promise<User | { error: string; message: string }> {
        this.validatePayload(payload);
        return await this.userService.update(user._id, payload).catch((e) => {
            throw handleMongoError(e);
        });
    }

    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)
    public async sendUserConfirm (
        @CurrentUser() user: User,
    ): Promise<User> {
        await this.userService.sendConfirmEmail(user);
        return user;
    }

    @Mutation(() => User)
    async confirmUser(@Args('token') token: string) {
        const user = await this.userService.getByToken(token);

        if (!user) {
            throw new BadRequestException(
                "The provided token was invalid",
                "INVALID_TOKEN"
            )
        }

        if (user.confirmed === true) {
            throw new BadRequestException(
                'This user is alredy confirmed',
                'ALREDY_CONFIRMED',
            );
        }

        if (user.confirm_token != token) {
            throw new BadRequestException(
                "The provided confirm token doesn't match with the token sended to your mail",
                'INVALID_CONFIRM_TOKEN',
            );
        }

        await this.userService.confirm(user._id);
        return user;
    }

    /**
     * Validate what the user has entered and try to create a user with those values.
     * @param { CreateUserInput } payload Values ​​that will be saved in the user.
     * @returns { Promise<User> } Returns a promise that resolves to the created user.
     */
    @Mutation(() => User)
    @UseGuards(GoogleRecaptchaGuard)
    async createUser(@Args('payload') payload: CreateUserInput): Promise<User> {
        this.validatePayload(payload);
        return await this.userService.create(payload).catch((e) => {
            throw handleMongoError(e);
        });
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    async fetchUser (
        @CurrentUser() fetcher: User,
        @Args('username') username: string
    ): Promise<User> {
        const user = await this.userService.getByUsername(username);

        if (!user) throw new BadRequestException("User with this username doesn't exists", "USER_NOT_FOUND");

        return user;
    }
}
