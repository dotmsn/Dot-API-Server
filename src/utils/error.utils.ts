import { BadRequestException } from '@nestjs/common';

const GENERIC_ERROR = new Error('Unknown error, contact an administrator.');
/**
 * Handles mongodb exceptions to give the user a friendlier message.
 * @param { Record<string, any> } error Exception object provided by mongoose.
 * @return { Error } The error formed from user-friendly messages.
 */
export function handleMongoError(error: Record<string, any>): Error {
    const { codeName, keyPattern } = error;

    if (codeName == 'DuplicateKey') {
        const key = Object.keys(keyPattern)[0];
        return new BadRequestException(
            'This ' + key + ' is alredy registered',
            key.toUpperCase() + '_ALREADY_REGISTERED',
        );
    } else {
        console.error(error);
        return GENERIC_ERROR;
    }
}
