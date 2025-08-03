// SuccessModal.ts

import { BaseModal } from './BaseModal';
import { CartModel } from './Model';
import { ensureElement, ensureAllElements, cloneTemplate } from '../utils/utils';

export class SuccessModal extends BaseModal {
  private static _instance: SuccessModal | null = null; // Экземпляр окна успеха (singleton)

  private constructor() {
    super('#modal-container'); // Контейнер модальных окон
  }

  // Получение экземпляра класса
  public static getInstance(): SuccessModal {
    if (!SuccessModal._instance) {
      SuccessModal._instance = new SuccessModal();
    }
    return SuccessModal._instance;
  }

  // Показ окна успешного заказа
  showSuccess(): void {
    const successClone = cloneTemplate('#success'); // ШАБЛОН окна успеха
    this.replaceContent(successClone);              // Заменяем контент окном успеха

    // Селекторы обязательных элементов
    const requiredSelectors = '.order-success__description,.order-success__close';
    ensureAllElements(requiredSelectors, this.content); // Проверяем наличие элементов

    // Общая сумма заказа
    const totalAmount = CartModel.getInstance().totalPrice;
    const descriptionEl = ensureElement('.order-success__description', this.content);
    if (descriptionEl) descriptionEl.textContent = `Итого: ${totalAmount} синапсов.`; // Показываем итоговую сумму

    // Очистка корзины после успешной покупки
    CartModel.getInstance().clearCart();

    // Кнопка закрытия окна
    const closeButton = ensureElement('.order-success__close', this.content) as HTMLButtonElement;
    if (!closeButton) return this.logError('Ошибка: кнопка закрытия отсутствует!');

    closeButton.onclick = () => this.hideSuccess(); // Закрываем окно

    this.open();                                    // Открываем окно
  }

  // Скрыть окно успеха
  hideSuccess(): void {
    this.close();
  }

  // Логгирование ошибок
  private logError(message: string): void {
    console.error(message);
  }
}