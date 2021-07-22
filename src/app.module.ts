import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRoot(process.env.MONGO_URI, {
          useCreateIndex: true,
          useFindAndModify: true,
          useNewUrlParser: true,
          useUnifiedTopology: true
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
