// FormModel.ts

import { validateEmail, validatePhone, isRequired } from '../utils/utils';
import { IEvents } from './base/events';

interface ValidationConfig {
    checkAddress?: boolean;
    checkPaymentMethod?: boolean;
    checkEmail?: boolean;
    checkPhone?: boolean;
}

/**
 * Модель форм обработки заказов и контактов пользователей.
 */
export class FormModel {
    private address = ''; // Адрес доставки
    private paymentMethod = ''; // Метод оплаты
    private email = ''; // Электронная почта клиента
    private phone = ''; // Телефон клиента
    public validationErrors: Record<string, string> = {}; // Ошибки валидаторов полей
    public readonly events: IEvents; // Подключение к системе событий

    constructor(events: IEvents) {
        this.events = events;
    }

    // Сбрасывает форму и её поля
    reset() {
        this.address = '';
        this.paymentMethod = '';
        this.email = '';
        this.phone = '';
        this.validationErrors = {};
    }

    // Геттер адреса доставки
    getAddress() { return this.address; }

    // Сеттер адреса доставки
    setAddress(v: string) {
        this.address = v.trim();
    }

    // Геттер метода оплаты
    getPaymentMethod() { return this.paymentMethod; }

    // Сеттер метода оплаты
    setPaymentMethod(v: string) {
        this.paymentMethod = v;
    }

    // Геттер e-mail
    getEmail() { return this.email; }

    // Сеттер e-mail
    setEmail(v: string) {
        this.email = v.trim();
    }

    // Геттер телефона
    getPhone() { return this.phone; }

    // Сеттер телефона
    setPhone(v: string) {
        this.phone = v.trim();
    }

    // Валидация полей заказа
    validateOrder(config: ValidationConfig) {
        const errors: Record<string, string> = {};
        if (config.checkAddress && !isRequired(this.address)) errors.address = 'Введите адрес доставки';
        if (config.checkPaymentMethod && !['cash', 'card'].includes(this.paymentMethod)) errors.paymentMethod = 'Выберите способ оплаты';
        return errors;
    }

    // Валидация контактных данных
    validateContacts(config: ValidationConfig) {
        const errors: Record<string, string> = {};
        if (config.checkEmail && !validateEmail(this.email)) errors.email = 'Введите адрес электронной почты';
        if (config.checkPhone && !validatePhone(this.phone)) errors.phone = 'Введите номер телефона';
        return errors;
    }

    // Проверка валидности всей формы заказа
    isValidOrder() {
        const errors = this.validateOrder({ checkAddress: true, checkPaymentMethod: true });
        this.validationErrors = errors;
        if (Object.keys(errors).length === 0) this.events.emit('form:valid-order');
        else this.events.emit('form:order-errors');
        return Object.keys(errors).length === 0;
    }

    // Проверка валидности контактных данных
    isValidContacts() {
        const errors = this.validateContacts({ checkEmail: true, checkPhone: true });
        this.validationErrors = errors;
        if (Object.keys(errors).length === 0) this.events.emit('form:valid-contacts');
        else this.events.emit('form:contacts-errors');
        return Object.keys(errors).length === 0;
    }
}