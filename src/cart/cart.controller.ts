import {
  Controller,
  Get,
  Delete,
  Put,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth';
import { Order, OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { DataSource } from 'typeorm';
import { CartStatuses } from './constants';
import { calculateCartTotal } from './models-rules';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private readonly dataSource: DataSource,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest): Promise<CartItem[]> {
    const cart = await this.cartService.findOrCreateByUserId(
      getUserIdFromRequest(req),
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(
    @Req() req: AppRequest,
    @Body() body: PutCartPayload,
  ): Promise<CartItem[]> {
    // TODO: validate body payload...
    const cart = await this.cartService.updateByUserId(
      getUserIdFromRequest(req),
      body,
    );

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearUserCart(@Req() req: AppRequest) {
    await this.cartService.removeByUserId(getUserIdFromRequest(req));
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put('order')
  async checkout(@Req() req: AppRequest, @Body() body: CreateOrderDto) {
    // Start a new transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userId = getUserIdFromRequest(req);

      const cart = await queryRunner.manager.getRepository(Cart).findOne({
        where: {
          user_id: userId,
          status: CartStatuses.OPEN,
        },
      });

      if (!cart) {
        throw new BadRequestException('Cart is empty');
      }

      const items = await queryRunner.manager.getRepository(CartItem).find({
        where: {
          cart_id: cart.id,
        },
      });
      if (!items.length) {
        throw new BadRequestException('Cart is empty');
      }

      // Create order within transaction
      const total = calculateCartTotal(items);
      const order = this.orderService.create({
        userId,
        cartId: cart.id,
        items: body.items,
        address: body.address,
        total,
      });

      await queryRunner.manager.getRepository(Cart).update(
        { id: cart.id },
        {
          status: CartStatuses.ORDERED,
          updated_at: new Date(),
        },
      );
      await queryRunner.commitTransaction();

      return { order };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  @UseGuards(BasicAuthGuard)
  @Get('order')
  getOrder(): Order[] {
    return this.orderService.getAll();
  }
}
