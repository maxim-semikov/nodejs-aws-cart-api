import { CartItem as CartItemEntity } from '../../entities/cartItem.entity';

export function calculateCartTotal(items: CartItemEntity[]): number {
  return items.length
    ? items.reduce((acc: number, item: CartItemEntity) => {
        return (acc += item.count);
      }, 0)
    : 0;
}
