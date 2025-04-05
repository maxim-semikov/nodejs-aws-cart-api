import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';

export const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: parseInt(configService.get('POSTGRES_PORT')),
  database: configService.get('POSTGRES_DB'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  entities: [Cart, CartItem],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    max: 1,
    connectionTimeoutMillis: 10000,
    query_timeout: 4000,
    statement_timeout: 4000,
    keepalive: true,
    keepaliveInitialDelayMillis: 5000,
  },
});
