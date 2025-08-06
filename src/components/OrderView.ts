// OrderView.ts

import { BaseModal } from './BaseModal';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { validateForm } from './Forms';
import { EventEmitter } from './base/events';
import { IForm } from '../types';
import { ContactsView } from './ContactsView';
import { setupListeners } from './Components';

// Интерфейс формы заказа
class OrderForm implements IForm<HTMLFormElement> {
  constructor(public form: HTMLFormElement) {} // Конструктор с формой заказа

  get fields(): Record<string, HTMLInputElement> { // Поля формы
    return {
      address: ensureElement('[name=address]', this.form) as HTMLInputElement, // Поле адреса доставки
    };
  }

  get buttons(): Record<string, HTMLButtonElement> { // Кнопки формы
    return {
      cardButton: ensureElement('button[name="card"]', this.form) as HTMLButtonElement, // Оплатить картой
      cashButton: ensureElement('button[name="cash"]', this.form) as HTMLButtonElement, // Оплата наличными
      submitButton: ensureElement('.order__button', this.form) as HTMLButtonElement, // Кнопка отправки заказа
    };
  }

  static createFromParent(parentNode: HTMLElement): OrderForm | null { // Создание объекта формы из родительского узла
    const form = ensureElement('.form', parentNode) as HTMLFormElement;
    if (!form) return null;
    return new OrderForm(form);
  }
}

// Представление страницы оформления заказа
export class OrderView extends BaseModal {
  private static instance: OrderView | null = null; // Поле для реализации паттерна Singleton
  private events: EventEmitter | null = null; // Хранилище объектов событий

  private constructor() { // Приватный конструктор для предотвращения внешнего инстанцирования
    super('#modal-container');
  }

  public static getInstance(): OrderView { // Метод получения единственного экземпляра класса
    return OrderView.instance || (OrderView.instance = new OrderView());
  }

  initialize(events: EventEmitter): void { // Инициализация объекта OrderView
    this.events = events;
  }

  showOrder(): void { // Метод открытия окна оформления заказа
    if (!this.events) throw new Error('Events are not initialized!');

    const orderContent = cloneTemplate('#order');
    this.setContent(orderContent);

    const formData = OrderForm.createFromParent(this.content!)!;

    setupListeners(formData);

    formData.buttons.submitButton.addEventListener('click', () => { // Регистрация обработчика кнопки отправки
      if (validateForm(formData.form)) {
        this.hideOrder();
        ContactsView.getInstance().initialize(this.events);
        ContactsView.getInstance().showContacts();
      }
    });

    validateForm(formData.form);
    this.open();
  }

  hideOrder(): void { // Метод скрытия окна оформления заказа
    this.close();
  }
}