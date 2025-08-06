// BasketController.ts

import { BasketModel } from './BasketModel';
import { EventEmitter } from './base/events';
import { IProduct } from '../types/index';

// Контроллер корзины, управляющий состоянием и обновлением интерфейса
export class BasketController {
  private model: BasketModel; // Модель корзины
  private readonly events: EventEmitter; // Система событий

  // Конструктор контроллера
  constructor(events: EventEmitter) {
    this.events = events;
    this.model = BasketModel.getInstance(events);
    this.initialize();
  }

  // Инициализирует наблюдателя изменений корзины
  initialize(): void {
    this.events.on('basket:change', () => this.refreshUI());
  }

  // Обновляет визуализацию количества товаров в корзине
  refreshUI(): void {
    const counterElement = document.querySelector('.header__basket-counter');
    if (counterElement) {
      counterElement.textContent = this.model.basketTotalCount.toString();
    }
  }

  // Добавляет продукт в корзину
  addToBasket(product: IProduct): void {
    this.model.addToBasket(product);
    this.refreshUI();
  }

  // Удаляет продукт из корзины
  removeFromBasket(productId: string): void {
    this.model.removeFromBasket(productId);
    this.refreshUI();
  }

  // Полностью очищает корзину
  clearBasket(): void {
    this.model.clearBasket();
  }

  // Возвращает текущую модель корзины
  get currentState(): BasketModel {
    return this.model;
  }
}