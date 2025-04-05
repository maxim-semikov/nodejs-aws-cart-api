import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { CreateOrderPayload } from '../type';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  getAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  findById(orderId: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
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
        items: data.items,
        delivery: { address: data.address.address },
        payment: { method: 'card', amount: data.total },
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
