import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

export class CartApiServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new nodejs.NodejsFunction(this, 'CartApiServiceLambda', {
      entry: join(__dirname, '../../src/lambda.ts'),
      handler: 'handler',
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        NODE_ENV: 'production',
      },
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: [
          'aws-sdk',
          'class-transformer',
          'class-validator',
          '@nestjs/websockets',
          '@nestjs/microservices',
          '@nestjs/websockets/socket-module',
          '@nestjs/microservices/microservices-module',
        ],
      },
    });

    const api = new apigateway.RestApi(this, 'CartApiService', {
      restApiName: 'Cart API Service',
      deployOptions: {
        stageName: 'prod',
        tracingEnabled: true,
      },
    });

    const integration = new apigateway.LambdaIntegration(handler);

    api.root.addMethod('ANY', integration);
    api.root.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
    });
  }
}
