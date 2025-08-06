// BasketModel.ts

import { EventEmitter } from './base/events';
import { IProduct } from '../types/index';

// Синглтон-модель корзины
export class BasketModel {
  private static instances: Record<string, BasketModel> = {}; // Хранение экземпляров моделей корзины

  private products: Map<string, IProduct>; // Карта хранимых продуктов
  private readonly events: EventEmitter; // Система событий

  // Приватный конструктор для предотвращения прямого инстанцирования
  private constructor(events: EventEmitter) {
    this.products = new Map();
    this.events = events;
  }

  // Фабрика экземпляра корзины с использованием уникального ключа
  static getInstance(events: EventEmitter): BasketModel {
    const key = events.constructor.name;
    if (!BasketModel.instances[key]) {
      BasketModel.instances[key] = new BasketModel(events);
    }
    return BasketModel.instances[key];
  }

  // Вычисляем общую стоимость корзины
  get basketTotalPrice(): number {
    return [...this.products.values()]
      .reduce((acc, prod) => acc + (prod.price * (prod.quantity || 1)), 0);
  }

  // Вычисляем общее количество товаров в корзине
  get basketTotalCount(): number {
    return [...this.products.values()]
      .reduce((acc, prod) => acc + (prod.quantity || 1), 0);
  }

  // Возвращает массив текущих продуктов в корзине
  get basketProducts(): IProduct[] {
    return Array.from(this.products.values());
  }

  // Добавляет продукт в корзину
  addToBasket(product: IProduct): void {
    const existingProduct = this.products.get(product.id);
    this.products.set(product.id, {
      ...product,
      quantity: (existingProduct?.quantity ?? 0) + 1
    });
    this.events.emit('basket:update'); // Оповещаем систему о изменении состояния корзины
  }

  // Удаляет единицу продукта из корзины
  removeFromBasket(productId: string): void {
    const product = this.products.get(productId);
    if (product) {
      if (product.quantity === 1) {
        this.products.delete(productId); // Полностью удаляем товар, если остался последний
      } else {
        this.products.set(productId, { ...product, quantity: product.quantity - 1 }); // Уменьшаем количество товара
      }
      this.events.emit('basket:update'); // Оповещаем систему о изменении состояния корзины
    }
  }

  // Полностью очищает корзину
  clearBasket(): void {
    this.products.clear();
    this.events.emit('basket:update'); // Оповещаем систему о изменении состояния корзины
  }

  // Поиск продукта по его идентификатору
  findProductById(productId: string): IProduct | undefined {
    return this.products.get(productId);
  }
}