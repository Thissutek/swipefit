'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/lib/store/cart';

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  function handleQuantityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const quantity = parseInt(e.target.value, 10);
    onUpdateQuantity(quantity);
  }

  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name}</h3>
            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
        </div>

        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-500">
              Qty
            </label>
            <select
              id={`quantity-${item.id}`}
              name="quantity"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="rounded-md border border-gray-300 py-1 pl-2 pr-8 text-base"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="font-medium text-primary hover:text-primary-dark"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
