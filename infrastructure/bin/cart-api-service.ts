import * as cdk from 'aws-cdk-lib';
import { CartApiServiceStack } from '../lib/cart-api-service-stack';

const app = new cdk.App();
new CartApiServiceStack(app, 'CartApiServiceStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});
