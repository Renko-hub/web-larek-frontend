// ContactsModel.ts

import { validateEmail, validatePhone } from '../utils/utils';
import { IEvents } from './base/events';

interface ContactsValidationConfig {
    checkEmail?: boolean;
    checkPhone?: boolean;
}

export class ContactsModel {
    private email = '';
    private phone = '';
    public validationErrors: Record<string, string> = {};
    public readonly events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    reset() {
        this.email = '';
        this.phone = '';
        this.validationErrors = {};
        console.log('Контактная форма сброшена');
    }

    getEmail(): string { return this.email; }
    setEmail(value: string) {
        this.email = value.trim();
        console.log('E-mail установлен:', this.email);
        this.isValid(); // Проверяем сразу после установки
    }

    getPhone(): string { return this.phone; }
    setPhone(value: string) {
        this.phone = value.trim();
        console.log('Телефон установлен:', this.phone);
        this.isValid(); // Проверяем сразу после установки
    }

    validateContacts(config: ContactsValidationConfig) {
        let errors: Record<string, string> = {};

        if (config.checkEmail && !validateEmail(this.email)) {
            errors.email = 'Некорректный e-mail';
        }

        if (config.checkPhone && !validatePhone(this.phone)) {
            errors.phone = 'Неверный номер телефона';
        }

        return errors;
    }

    isValid() {
        const errors = this.validateContacts({
            checkEmail: true,
            checkPhone: true
        });

        this.validationErrors = errors;

        const hasErrors = Object.keys(errors).length > 0;

        if (hasErrors) {
            console.warn('Контактная форма недействительна:', errors);
            this.events.emit('contacts:invalid');
        } else {
            console.info('Контактная форма действительна');
            this.events.emit('contacts:valid');
        }

        return !hasErrors;
    }
}