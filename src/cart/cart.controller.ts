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
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';
import { CreateOrderDto, PutCartPayload } from 'src/order/type';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { Order } from '../entities/order.entity';
import { DataSource } from 'typeorm';
import { CartStatuses } from './constants';
import { calculateCartTotal } from './models-rules';
import { OrderStatus } from '../order/type';

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
    try {
      const userId = getUserIdFromRequest(req);

      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const cart = await transactionalEntityManager.findOne(Cart, {
            where: {
              user_id: userId,
              status: CartStatuses.OPEN,
            },
          });

          if (!cart) {
            throw new BadRequestException('There are no carts in Open status');
          }

          const items = await transactionalEntityManager.find(CartItem, {
            where: {
              cart_id: cart.id,
            },
          });

          if (!items.length) {
            throw new BadRequestException('Cart is empty');
          }

          const total = calculateCartTotal(items);
          const order = await this.orderService.create(
            {
              userId,
              cartId: cart.id,
              items: body.items,
              address: body.address,
              delivery: {
                address: body.address.address,
                firstName: body.address.firstName,
                lastName: body.address.lastName,
                comment: body.address.comment,
              },
              comments: body.address.comment,
              status: OrderStatus.Create,
              total,
            },
            transactionalEntityManager,
          );

          await transactionalEntityManager.update(
            Cart,
            { id: cart.id },
            {
              status: CartStatuses.ORDERED,
              updated_at: new Date(),
            },
          );

          return { order };
        },
      );
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(BasicAuthGuard)
  @Get('order')
  async getOrder(): Promise<CreateOrderDto[]> {
    return this.orderService.getAll();
  }
}
