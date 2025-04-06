import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { CreateOrderDto, CreateOrderPayload } from '../type';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getAll(): Promise<CreateOrderDto[]> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndMapMany(
        'order.items',
        'cart_items',
        'items',
        'items.cart_id = order.cart_id',
      )
      .getMany();

    return orders.map((order) => ({
      ...order,
      items:
        order.items?.map((item) => ({
          productId: item.product_id,
          count: item.count,
        })) || [],
      address: {
        comment: order.delivery.comment,
        address: order.delivery.address,
        lastName: order.delivery.lastName,
        firstName: order.delivery.firstName,
      },
      userId: order.user_id,
      cartId: order.cart_id,
    }));
  }

  findById(orderId: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: orderId },
    });
  }

  async create(
    data: CreateOrderPayload,
    entityManager?: EntityManager,
  ): Promise<Order> {
    try {
      const repo = entityManager
        ? entityManager.getRepository(Order)
        : this.orderRepository;

      const order = repo.create({
        user_id: data.userId,
        cart_id: data.cartId,
        delivery: data.delivery,
        payment: { method: 'card', amount: data.total },
        status: data.status,
        total: data.total,
      });

      return await repo.save(order);
    } catch (error) {
      throw new BadRequestException(`Failed to create order: ${error.message}`);
    }
  }

  update(orderId: string, data: Partial<Order>): Promise<Order> {
    return this.orderRepository.save({
      id: orderId,
      ...data,
    });
  }
}
