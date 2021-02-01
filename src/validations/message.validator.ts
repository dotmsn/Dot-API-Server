import { BadRequestException } from '@nestjs/common';
import {
    CreateMessageInput,
    UpdateMessageInput,
} from 'src/messages/messages.inputs';
import validator from 'validator';

export function validateMessageContent(content: string) {
    if (!validator.isLength(content, { min: 1, max: 2000 })) {
        return new BadRequestException(
            'Message length must be between 1 and 2000 characters.',
            'MESSAGE_CONTENT_TOO_LONG',
        );
    }
}

export function validateMessagePayload(
    payload: CreateMessageInput | UpdateMessageInput,
) {
    return validateMessageContent(payload.content);
}
