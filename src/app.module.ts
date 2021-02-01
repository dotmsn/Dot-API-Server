// Libraries
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';

// App modules
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './messages/messages.module';
import { UserModule } from './user/user.module';

// App controllers and services
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
        MessageModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
