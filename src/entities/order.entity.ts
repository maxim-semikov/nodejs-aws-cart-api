import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cartItem.entity';
import { OrderStatus } from 'src/order/type';

export interface PaymentData {
  method: string;
  email?: string;
  amount: number;
}

export interface DeliveryData {
    address: string;
    firstName: string;
    lastName: string;
    comment: string;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  user_id: string;

  @Column({ name: 'cart_id', type: 'uuid' })
  cart_id: string;

  @Column('jsonb')
  payment: PaymentData;

  @Column('jsonb')
  delivery: DeliveryData;

  @Column('text', { nullable: true })
  comments: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Create,
  })
  status: OrderStatus;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @ManyToOne(() => Cart, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @OneToMany(() => CartItem, (item) => item.cart)
  @JoinColumn({ name: 'cart_id' })
  items: CartItem[];
}
