// Libraries
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

// App modules
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { FriendsModule } from './friends/friends.module';
import { MessageModule } from './messages/messages.module';
import { UserModule } from './user/user.module';

// App controllers and services
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpErrorFilter } from './shared/http-error.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/logging.interceptor';
import {
    ApplicationType,
    GoogleRecaptchaModule,
    GoogleRecaptchaNetwork,
} from '@nestlab/google-recaptcha';

// Config
import CaptchaConfig from './config/CaptchaConfig';

// Other importants libraries and types
import { RedisCacheModule } from './cache/redis-cache.module';
import { SessionModule } from './session/session.module';

@Module({
    imports: [
        /*
          Using the database module it will connect to the
          mongodb server specified in the environment variable "MONGO_URI"
        */
        MongooseModule.forRoot(process.env.MONGO_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),

        /*
          Use recaptcha module to protect the application from ddos ​​attacks
          or flood of requests.
        */
        GoogleRecaptchaModule.forRoot({
            secretKey: process.env.RECAPTCHA_SECRET,
            response: (req) => {
                const token = (req.headers.recaptcha || '').toString();
                return token;
            },
            skipIf:
                CaptchaConfig.SKIP_IF_DEVELOPMENT &&
                process.env.NODE_ENV !== 'production',
            applicationType: ApplicationType.GraphQL,
            network: GoogleRecaptchaNetwork.Recaptcha,

            agent: null,
        }),

        /*
          Using the GraphQL module it will load all the schemas automatically
          and generate the .gql file

          Also the playground mode and debug will only be available if the application
          is running under a development environment.
        */
        GraphQLModule.forRoot({
            autoSchemaFile: join(process.cwd(), 'src', 'graphql', 'schema.gql'),
            sortSchema: true,
            playground: process.env.NODE_ENV == 'development',
            debug: process.env.NODE_ENV == 'development',
        }),

        /*
          load all the remaining modules that are responsible for managing different schemes and services.
        */
        AuthModule,
        ChannelModule,
        FriendsModule,
        MessageModule,
        UserModule,
        SessionModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
