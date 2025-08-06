// SuccessView.ts

import { BaseModal } from './BaseModal';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

// Окно успешного завершения операции
export class SuccessView extends BaseModal {
  private static _instance: SuccessView | null = null; // Поле для реализации паттерна Singleton
  private events: EventEmitter | null = null; // Хранилище объектов событий

  private constructor() { // Приватный конструктор для предотвращения внешнего инстанцирования
    super('#modal-container');
  }

  public static getInstance(): SuccessView { // Метод получения единственного экземпляра класса
    return SuccessView._instance || (SuccessView._instance = new SuccessView());
  }

  initialize(events: EventEmitter): void { // Инициализация объекта SuccessView
    this.events = events;
  }

  showSuccess(totalAmount: number): void { // Метод отображения окна успеха
    if (!this.events) throw new Error('Events are not initialized!');

    const successContent = cloneTemplate('#success')!;
    this.setContent(successContent);

    const descriptionEl = ensureElement('.order-success__description', successContent);
    const closeButton = ensureElement('.order-success__close', successContent) as HTMLButtonElement | null;

    if (descriptionEl) {
      descriptionEl.textContent = `Итого списано: ${totalAmount} синапсов.`; // Отображаем итоговую сумму
    }

    if (closeButton) {
      closeButton.onclick = () => this.hideSuccess(); // Обрабатываем клик по кнопке закрытия
    }

    this.open();
  }

  hideSuccess(): void { // Метод скрытия окна успеха
    this.close();
  }
}