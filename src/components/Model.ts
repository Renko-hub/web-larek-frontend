// Model.ts

import { ensureElement } from '../utils/utils';
import { Product } from '../types/index';

// Модель корзины покупок
export class CartModel<T extends Product> {
  private static instance: CartModel<Product>; // Синглтон-инстанс корзины
  private items: T[];                         // Список товаров в корзине
  private _counterElement: HTMLSpanElement | null; // Элемент отображения кол-ва товаров

  // Приватный конструктор, создающий новую корзину
  private constructor() {
    this.items = [];
    this._counterElement = ensureElement('.header__basket-counter') as HTMLSpanElement | null;
  }

  // Метод возвращает единственную инстанцию корзины
  static getInstance(): CartModel<Product> {
    if (!CartModel.instance) {
      CartModel.instance = new CartModel<Product>();
    }
    return CartModel.instance;
  }

  // Геттер возвращает общее количество товаров в корзине
  get totalCount(): number {
    return this.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  }

  // Геттер возвращает общую сумму товаров в корзине
  get totalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price * (item.quantity ?? 0)), 0);
  }

  // Геттер возвращает копию текущего списка товаров
  get cartItems(): T[] {
    return [...this.items];
  }

  // Добавляет товар в корзину
  addToCart(product: T): void {
    const existingProductIndex = this.items.findIndex(item => item.id === product.id);
    if (existingProductIndex >= 0) {
      this.items[existingProductIndex].quantity!++;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.updateCounterDisplay();
  }

  // Удаляет товар из корзины
  removeFromCart(product: T): void {
    const existingProductIndex = this.items.findIndex(item => item.id === product.id);
    if (existingProductIndex >= 0) {
      if ((this.items[existingProductIndex].quantity ?? 0) > 1) {
        this.items[existingProductIndex].quantity!--;
      } else {
        this.items.splice(existingProductIndex, 1);
      }
    }
    this.updateCounterDisplay();
  }

  // Полностью очищает корзину
  clearCart(): void {
    this.items.forEach((item) => delete item.quantity);
    this.items.length = 0;
    this.updateCounterDisplay();
  }

  // Обновляет отображаемое количество товаров в корзине
  private updateCounterDisplay(): void {
    if (this._counterElement) {
      this._counterElement.textContent = this.totalCount.toString();
    }
  }

  // Установить элемент интерфейса для отображения количества товаров
  set counterElement(value: HTMLSpanElement | null) {
    this._counterElement = value;
    this.updateCounterDisplay();
  }

  // Вернуть элемент интерфейса для отображения количества товаров
  get counterElement(): HTMLSpanElement | null {
    return this._counterElement;
  }
}