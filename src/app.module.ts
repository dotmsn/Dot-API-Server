import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { RedisCacheModule } from './cache/redis-cache.module';
import { SessionModule } from './modules/sessions/session.module';
import { UsersModule } from './modules/users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
    imports: [
        ConfigModule.forRoot(),

        /**
         * Using the database module it will connect to the
         * mongodb server specified in the environment variable "MONGO_URI"
         */
        MongooseModule.forRoot(process.env.MONGO_URI, {
            useCreateIndex: true,
            useFindAndModify: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),

        /**
         * Using the GraphQL module it will load all the schemas automatically
         * and generate the .gql file
         * Also the playground mode and debug will only be available if the application
         *  is running under a development environment.
         */
        GraphQLModule.forRoot({
            autoSchemaFile: join(
                process.cwd(),
                'src',
                'graphql',
                'schema.gql',
            ),
            sortSchema: true,
            debug: process.env.NODE_ENV == 'development'
        }),

        /**
         * Load all the remaining modules that are responsible for managing different schemes and services.
         */
        RedisCacheModule,
        UsersModule,
        SessionModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
