// ContactsModal.ts

import { BaseModal } from './BaseModal';
import { ensureElement, ensureAllElements, cloneTemplate } from '../utils/utils';
import { SuccessModal } from './SuccessModal';
import { handleEmailInput, handlePhoneInput } from './Components';
import { validateContactForm } from './Forms';

export class ContactsModal extends BaseModal {
  private static _instance: ContactsModal | null = null; // Экземпляр модуля контактов (singleton)

  private constructor() {
    super('#modal-container'); // Контейнер модальных окон
  }

  // Получение экземпляра класса
  public static getInstance(): ContactsModal {
    if (!ContactsModal._instance) {
      ContactsModal._instance = new ContactsModal();
    }
    return ContactsModal._instance;
  }

  // Показ формы контактных данных
  showContacts(): void {
    const contactsRoot = cloneTemplate('#contacts'); // ШАБЛОН контактов
    this.replaceContent(contactsRoot);              // Заменяем контент окном контактов

    // Селекторы обязательных элементов
    const requiredSelectors = '.form, [name=email], [name=phone], button[type=submit]';
    ensureAllElements(requiredSelectors, this.content); // Проверяем наличие элементов

    // Форма контактных данных
    const form = ensureElement('.form', this.content)! as HTMLFormElement;
    const emailField = ensureElement('[name=email]', form) as HTMLInputElement; // Поле e-mail
    const phoneField = ensureElement('[name=phone]', form) as HTMLInputElement; // Поле телефона
    const submitButton = ensureElement('button[type=submit]', form) as HTMLButtonElement; // Кнопка отправки

    // Настройка обработчиков ввода почты и телефона
    emailField.oninput = (event) => handleEmailInput(event, form);
    phoneField.oninput = (event) => handlePhoneInput(event, form);

    // Клик по кнопке подтверждения
    submitButton.onclick = () => {
      if (validateContactForm(form)) { // Проверка валидности формы
        this.hideContacts();           // Скрыть окно контактов
        SuccessModal.getInstance().showSuccess(); // Перейти к успешному заказу
      }
    };

    validateContactForm(form);         // Валидируем форму сразу при открытии

    this.open();                       // Открываем окно
  }

  // Скрыть окно контактов
  hideContacts(): void {
    this.close();
  }
}
