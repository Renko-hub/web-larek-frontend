// OrderModal.ts

import { BaseModal } from './BaseModal';
import { cloneTemplate, ensureElement, ensureAllElements } from '../utils/utils';
import { ContactsModal } from './ContactsModal';
import { handleAddressInput, handlePaymentClick } from './Components';
import { validateForm } from './Forms';

export class OrderModal extends BaseModal {
  private static _instance: OrderModal | null = null; // Экземпляр модуля заказа (singleton)

  private constructor() {
    super('#modal-container'); // Контейнер модальных окон
  }

  // Получение экземпляра класса
  public static getInstance(): OrderModal {
    if (!OrderModal._instance) {
      OrderModal._instance = new OrderModal();
    }
    return OrderModal._instance;
  }

  // Показ формы заказа
  showOrder(): void {
    const orderContent = cloneTemplate('#order'); // ШАБЛОН заказа
    this.replaceContent(orderContent);           // Заменяем контент окном заказа

    // Селекторы необходимых элементов
    const requiredSelectors = '.form, [name=address], button[name="card"], button[name="cash"]';
    ensureAllElements(requiredSelectors, this.content); // Проверяем наличие элементов

    // Форма заказа
    const form = ensureElement('.form', this.content) as HTMLFormElement;
    const addressField = ensureElement('[name=address]', form) as HTMLInputElement; // Поле адреса доставки
    const onlineButton = ensureElement('button[name="card"]', form) as HTMLButtonElement; // Оплата картой
    const cashButton = ensureElement('button[name="cash"]', form) as HTMLButtonElement; // Оплата наличными
    const continueButton = ensureElement('.order__button', form) as HTMLButtonElement; // Продолжить оформление

    // Настройка обработчиков ввода адресной строки и выбора способа оплаты
    addressField.oninput = (event) => handleAddressInput(event, form);
    onlineButton.onclick = () => handlePaymentClick(onlineButton, cashButton, form);
    cashButton.onclick = () => handlePaymentClick(cashButton, onlineButton, form);

    // Клик по кнопке продолжения
    continueButton.onclick = () => {
      if (validateForm(form)) { // Проверка валидности формы
        this.hideOrder();                // Скрыть окно заказа
        ContactsModal.getInstance().showContacts(); // Перейти к окну контактов
      }
    };

    validateForm(form);                 // Валидируем форму сразу при открытии

    this.open();                        // Открываем окно
  }

  // Скрыть окно заказа
  hideOrder(): void {
    this.close();
  }
}