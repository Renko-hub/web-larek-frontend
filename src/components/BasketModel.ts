// BasketModel.ts

import { IProduct } from './ProductModel';

interface EventsInterface {
  emit(eventName: string, data?: any): void;
  on(eventName: string, callback: Function): void;
}

export class BasketModel {
  private static instance: BasketModel | null = null;
  private products: Map<string, IProduct>;
  private quantities: Map<string, number>;
  private readonly events: EventsInterface;

  private constructor(events: EventsInterface) {
    this.products = new Map();
    this.quantities = new Map();
    this.events = events;
  }

  static getInstance(events: EventsInterface): BasketModel {
    return BasketModel.instance || (BasketModel.instance = new BasketModel(events));
  }

  get totalPrice(): number {
    return Array.from(this.products.values())
      .reduce((sum, prod) => sum + (prod.price * (this.quantities.get(prod.id) || 0)), 0);
  }

  get totalItems(): number {
    return Array.from(this.quantities.values()).reduce((acc, q) => acc + q, 0);
  }

  get items(): IProduct[] {
    return Array.from(this.products.values()).map(product => ({
      ...product,
      quantity: this.quantities.get(product.id)!,
    }));
  }

  add(product: IProduct): void {
    this.products.set(product.id, product);
    this.updateQuantity(product.id, 1);
    this.events.emit('basket:change');
    this.events.emit('product:in-basket', Array.from(this.products.keys()));
  }

  removeOne(productId: string): void {
    const currentQty = this.quantities.get(productId) || 0;
    if (currentQty <= 1) {
      this.products.delete(productId);
      this.quantities.delete(productId);
    } else {
      this.updateQuantity(productId, -1);
    }
    this.events.emit('basket:change');
    this.events.emit('product:in-basket', Array.from(this.products.keys()));
  }

  clear(): void {
    this.products.clear();
    this.quantities.clear();
    this.events.emit('basket:cleared');
  }

  updateQuantity(productId: string, delta: number): void {
    const currentQty = this.quantities.get(productId) || 0;
    const updatedQty = Math.max(currentQty + delta, 0);
    if (updatedQty > 0) {
      this.quantities.set(productId, updatedQty);
    } else {
      this.products.delete(productId);
      this.quantities.delete(productId);
    }
  }

  findProductById(productId: string): IProduct | undefined {
    return this.products.get(productId);
  }

  isEmpty(): boolean {
    return this.products.size === 0 && this.quantities.size === 0;
  }
}