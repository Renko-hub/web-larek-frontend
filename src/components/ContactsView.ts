// ContactsView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { updateError } from './Components';
import { Modal } from './Modal';

export class ContactsView {
    private static instance: ContactsView; // Синглтон представление контакта
    private modal: Modal; // Экземпляр модального окна
    private nextButton: HTMLButtonElement | null; // Кнопка подтверждения отправки данных
    private emailField: HTMLInputElement | null; // Поле электронного письма
    private phoneField: HTMLInputElement | null; // Поле номера телефона
    private readonly _eventEmitter: any; // Эммитер событий для взаимодействия с другими компонентами

    private constructor(eventEmitter: any) {
        this._eventEmitter = eventEmitter;
        this.modal = Modal.getInstance('modal-container'); // Инициализируем модал
    }

    // Получаем singleton-экземпляр ContactView
    public static getInstance(eventEmitter: any): ContactsView {
        if (!ContactsView.instance) {
            ContactsView.instance = new ContactsView(eventEmitter);
        }
        return ContactsView.instance;
    }

    // Открытие экрана ввода контактных данных
    openContacts() {
        this._eventEmitter.emit('contactsview:opened');
        const contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement; // Шаблон контактных данных
        if (contactsTemplate) {
            const contactsClone = cloneTemplate(contactsTemplate);
            if (contactsClone) {
                this.modal.setContent(contactsClone); // Устанавливаем контент модала
                this.nextButton = ensureElement('.contacts__button', contactsClone) as HTMLButtonElement; // Кнопка следующего шага
                this.emailField = ensureElement('input[name="email"]', contactsClone) as HTMLInputElement; // Поле e-mail
                this.phoneField = ensureElement('input[name="phone"]', contactsClone) as HTMLInputElement; // Поле телефона

                if (this.nextButton && this.emailField && this.phoneField) {
                    // Сохраняем начальные значения в модели формы
                    this._eventEmitter.emit('form-model:set-email', { newEmail: this.emailField.value });
                    this._eventEmitter.emit('form-model:set-phone', { newPhone: this.phoneField.value });

                    // Реакция на изменение поля e-mail
                    this.emailField.addEventListener('input', () => {
                        this._eventEmitter.emit('form-model:set-email', { newEmail: this.emailField.value });
                    });

                    // Реакция на изменение поля телефона
                    this.phoneField.addEventListener('input', () => {
                        this._eventEmitter.emit('form-model:set-phone', { newPhone: this.phoneField.value });
                    });

                    // Завершаем ввод контактных данных
                    this.nextButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        this._eventEmitter.emit('open-success'); // Переход к успешному заказу
                    });
                }
            }
        }
        this.modal.open(); // Открываем модал
    }

    // Закрываем окно ввода контактных данных
    close() {
        this.modal.close();
    }

    // Активирует/деактивирует кнопку "Далее"
    enableNextButton(value: boolean) {
        if (this.nextButton) {
            this.nextButton.disabled = !value;
        }
    }

    // Обновляет сообщение об ошибке поля e-mail
    updateEmailError(errorMessage?: string) {
        updateError(this.emailField, 'contact-error', errorMessage);
    }

    // Обновляет сообщение об ошибке поля телефона
    updatePhoneError(errorMessage?: string) {
        updateError(this.phoneField, 'contact-error', errorMessage);
    }
}