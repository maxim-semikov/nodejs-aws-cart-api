import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler, Context, Callback } from 'aws-lambda';
import { configure } from '@codegenie/serverless-express';
import helmet from 'helmet';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: (_, callback) => callback(null, true),
    });
    app.use(helmet());

    await app.init();
    console.log('NestJS application initialized');

    const expressApp = app.getHttpAdapter().getInstance();
    return configure({ app: expressApp });
  } catch (error) {
    console.error('Failed to bootstrap application:', error);
    throw error;
  }
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log('Lambda event:', JSON.stringify(event));

  try {
    server = server ?? (await bootstrap());
    return server(event, context, callback);
  } catch (error) {
    console.error('Lambda execution failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error:
          process.env.NODE_ENV === 'production' ? undefined : error.message,
      }),
    };
  }
};
