// ContactsView.ts

import { BaseModal } from './BaseModal';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { handleInputChange } from './Components';
import { validateContactForm } from './Forms';
import { EventEmitter } from './base/events';
import { IForm } from '../types';

// Форма контактов
class ContactForm implements IForm<HTMLFormElement> {
  constructor(public form: HTMLFormElement) {} // Конструктор с формой контактов

  get fields(): Record<string, HTMLInputElement> { // Поля формы
    return {
      email: ensureElement('[name="email"]', this.form) as HTMLInputElement, // Поле электронной почты
      phone: ensureElement('[name="phone"]', this.form) as HTMLInputElement, // Поле телефона
    };
  }

  get buttons(): Record<string, HTMLButtonElement> { // Кнопки формы (отсутствуют)
    return {};
  }

  static createFromParent(parentNode: HTMLElement): ContactForm | null { // Создание объекта формы из родительского узла
    const form = ensureElement('.form', parentNode) as HTMLFormElement;
    if (!form) return null;
    return new ContactForm(form);
  }
}

// Представление страницы контактных данных
export class ContactsView extends BaseModal {
  private static instance: ContactsView | null = null; // Поле для реализации паттерна Singleton
  private events: EventEmitter | null = null; // Хранилище объектов событий

  private constructor() { // Приватный конструктор для предотвращения внешнего инстанцирования
    super('#modal-container');
  }

  public static getInstance(): ContactsView { // Метод получения единственного экземпляра класса
    return ContactsView.instance || (ContactsView.instance = new ContactsView());
  }

  initialize(events: EventEmitter): void { // Инициализация объекта ContactsView
    this.events = events;
  }

  showContacts(): void { // Метод открытия окна ввода контактных данных
    if (!this.events) throw new Error('Events are not initialized!');

    const contactsContent = cloneTemplate('#contacts')!;
    this.setContent(contactsContent);

    const contactForm = ContactForm.createFromParent(this.content!)!;

    Object.values(contactForm.fields).forEach((field) => // Регистрируем обработчики изменения полей
      field.addEventListener('input', (event) => handleInputChange(event, validateContactForm, contactForm.form))
    );

    contactForm.form.addEventListener('submit', (e) => { // Регистрация обработчика отправки формы
      e.preventDefault();
      if (validateContactForm(contactForm.form)) {
        this.hideContacts();
        this.events?.emit('contact:success');
      }
    });

    validateContactForm(contactForm.form);
    this.open();
  }

  hideContacts(): void { // Метод скрытия окна ввода контактных данных
    this.close();
  }
}