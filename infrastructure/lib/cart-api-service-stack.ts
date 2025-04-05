import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export class CartApiServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartApiServiceFunc = new nodejs.NodejsFunction(
      this,
      'CartApiServiceLambda',
      {
        functionName: 'cartApiServiceLambda',
        entry: join(__dirname, '../../dist/src/lambda.js'),
        depsLockFilePath: join(__dirname, '../../package-lock.json'),
        handler: 'handler',
        runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
        memorySize: 1024,
        timeout: cdk.Duration.seconds(30),
        logRetention: logs.RetentionDays.ONE_WEEK,
        environment: {
          NODE_ENV: 'production',
          POSTGRES_HOST: process.env.POSTGRES_HOST || '',
          POSTGRES_PORT: process.env.POSTGRES_PORT || '',
          POSTGRES_DB: process.env.POSTGRES_DB || '',
          POSTGRES_USER: process.env.POSTGRES_USER || '',
          POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
        },
        bundling: {
          minify: true,
          sourceMap: true,
          target: 'node20',
          externalModules: [
            '@aws-sdk/*',
            'aws-sdk',
            'class-transformer',
            'class-validator',
            'crypto',
            'node:crypto',
          ],
          nodeModules: [
            '@nestjs/core',
            '@nestjs/common',
            '@nestjs/platform-express',
            'reflect-metadata',
            '@codegenie/serverless-express',
          ],
        },
      },
    );

    const { url } = cartApiServiceFunc.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*'],
      },
      invokeMode: lambda.InvokeMode.BUFFERED,
    });

    new cdk.CfnOutput(this, 'Url', { value: url });
  }
}
