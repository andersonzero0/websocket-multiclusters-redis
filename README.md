# WebSocket MultiClusters with Redis

This repository hosts a WebSocket Gateway built with NestJS. Leveraging the power of WebSockets for real-time, bi-directional communication, this project ensures seamless connectivity across multiple instances of the gateway, functioning as a unified server.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Docker, Node.js, npm/yarn and pm2 installed on your machine.

To install pm2 globally, run the following command:

```bash
npm install pm2 -g
```

or

```bash
yarn global add pm2
```

### Installing

First, start the Docker compose:

```bash
docker-compose up -d
```

Then, install the packages:

```bash
npm install
```

or

```bash
yarn
```

After that, build the project:

```bash
npm run build
```

or

```bash
yarn build
```

Finally, start the application with pm2:

```bash
pm2 start ecosystem.config.js
```

## Installing Nginx and Configuring

First, you need to install Nginx. If you're using Ubuntu, you can do this with the following command:

```bash
sudo apt update
sudo apt install nginx
```

After installing Nginx, you need to use the provided nginx.conf file. Replace the default Nginx configuration file with the provided one. You can do this with the following commands:

```bash
sudo rm /etc/nginx/nginx.conf
sudo cp ./nginx.conf /etc/nginx/nginx.conf
```

Finally, restart Nginx to apply the changes:

```bash
sudo systemctl restart nginx
```

## Why PM2?

PM2 is a production process manager for Node.js applications. In this project, it is used to create multiple instances of the application, enhancing its performance and reliability.

## Why Nginx?

Nginx is a high-performance HTTP server and reverse proxy. In this project, it is used to distribute incoming client requests to multiple instances of the application, effectively balancing the load and ensuring high availability and reliability.

## Code Explanation

The `RedisIoAdapter` class is an adapter for Redis. It connects to a Redis server and creates an IO server with the Redis adapter.

The `connectToRedis` method connects to the Redis server and creates a pub/sub client. It then creates an adapter with these clients.

The `createIOServer` method creates an IO server with the Redis adapter.

The `bootstrap` function is the entry point of the application. It creates a NestJS application, connects to Redis, and starts the application. It uses the Redis adapter for the WebSocket server of the application.

```typescript
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: `redis://localhost:6379`,
      database: 0,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  const logger = new Logger('App');

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

## Authors

- **Anderson Viana** - [@andersonzer0](https://github.com/andersonzero0)
