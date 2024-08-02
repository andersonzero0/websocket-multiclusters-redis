import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
