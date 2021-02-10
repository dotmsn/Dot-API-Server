import {
    Catch,
    ExceptionFilter,
    HttpException,
    ArgumentsHost,
    Logger,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        console.error(exception.stack);
        if (host.getType() == 'http') {
            const ctx = host.switchToHttp();
            this.handleHTTPException(
                exception,
                ctx.getRequest(),
                ctx.getResponse(),
            );
        } else if (`${host.getType()}` == 'graphql') {
            // TODO: GraphQL exceptiopn handler
        }
    }

    public handleGraphQLException(exception: HttpException, request, response) {
        /* */
    }

    public handleHTTPException(exception: HttpException, request, response) {
        const errorResponse = {
            code:
                typeof exception.getStatus == 'function'
                    ? exception.getStatus()
                    : 500,
            timestamp: new Date().toLocaleDateString(),
            path: request.url,
            method: request.method,
            message: exception.message || null,
        };

        if (process.env.NODE_ENV == 'development') {
            Logger.error(
                `${errorResponse.method} ${errorResponse.path} ${errorResponse.code}`,
                exception.message,
                'HTTPLogger',
            );

            response.status(errorResponse.code).json(errorResponse);
        }
    }
}
