// FormModel.ts

import { isRequired, validateEmail, validatePhone } from '../utils/utils';

interface ValidationConfig {
    checkAddress?: boolean; // Включает проверку адреса
    checkPaymentMethod?: boolean; // Включает проверку способа оплаты
    checkEmail?: boolean; // Включает проверку электронной почты
    checkPhone?: boolean; // Включает проверку телефона
}

export class FormModel {
    #address: string = ''; // Адрес доставки
    #paymentMethod: string = ''; // Способ оплаты
    #email: string = ''; // Электронная почта
    #phone: string = ''; // Телефон
    validationErrors: Record<string, string> = {}; // Объект ошибок валидации полей

    // Сбрасывает форму и очищается объект ошибок
    reset(): void {
        this.#address = '';
        this.#paymentMethod = '';
        this.#email = '';
        this.#phone = '';
        this.validationErrors = {};
    }

    // Геттер и сеттер для поля адреса
    getAddress(): string {
        return this.#address;
    }

    setAddress(newAddress: string): void {
        this.#address = newAddress.trim();
    }

    // Геттер и сеттер для поля способа оплаты
    getPaymentMethod(): string {
        return this.#paymentMethod;
    }

    setPaymentMethod(paymentMethod: string): void {
        this.#paymentMethod = paymentMethod;
    }

    // Геттер и сеттер для поля e-mail
    getEmail(): string {
        return this.#email;
    }

    setEmail(email: string): void {
        this.#email = email.trim();
    }

    // Геттер и сеттер для поля телефона
    getPhone(): string {
        return this.#phone;
    }

    setPhone(phone: string): void {
        this.#phone = phone.trim();
    }

    // Функция проверки валидности введенных данных согласно конфигурации
    validate(config: ValidationConfig): object {
        this.validationErrors = {};

        if (config.checkAddress && !isRequired(this.getAddress())) {
            this.validationErrors.address = 'Введите адрес доставки';
        }

        if (config.checkPaymentMethod && !['cash', 'card'].includes(this.getPaymentMethod())) {
            this.validationErrors.paymentMethod = 'Выберите способ оплаты';
        }

        if (config.checkEmail && !validateEmail(this.getEmail())) {
            this.validationErrors.email = 'Введите электронную почту';
        }

        if (config.checkPhone && !validatePhone(this.getPhone())) {
            this.validationErrors.phone = 'Введите телефон';
        }

        return this.validationErrors;
    }

    // Определяет, является ли форма валидной
    isValid(config: ValidationConfig): boolean {
        return Object.keys(this.validate(config)).length === 0;
    }
}