import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './events/redis-ws.adapter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  const logger = new Logger('App');

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
