// Components.ts

import { createElement } from '../utils/utils';

// Обновляет визуализацию сообщений об ошибках
export function updateError(field: HTMLInputElement | null, spanClass: string, errorMessage?: string): void {
    if (!field) return;
    const parent = field.parentElement!;
    const existingError = parent.querySelector(`.${spanClass}`); // Текущее сообщение об ошибке

    if (errorMessage) {
        if (!existingError) {
            parent.append(createElement('span', { className: spanClass, textContent: errorMessage }));
        } else {
            existingError.textContent = errorMessage;
        }
    } else if (existingError) {
        existingError.remove();
    }
}

// Универсальная функция переключения активного способа оплаты
export function selectPaymentMethod(
    buttons: HTMLButtonElement[], // Массив кнопок способов оплаты
    selectedIndex: number, // Индекс выбранного метода
    onSelectCallback: (methodName: string) => void // Коллбек-обработчик изменения способа оплаты
): void {
    if (selectedIndex < 0 || selectedIndex >= buttons.length) return;
    
    const paymentMethodName = buttons[selectedIndex].name; // Имя выбранного способа оплаты

    buttons.forEach((btn, idx) => {
        btn.classList.toggle('button_alt-active', idx === selectedIndex); // Переключаем класс активного элемента
    });

    if (paymentMethodName) {
        onSelectCallback(paymentMethodName); // Выполняем коллбек с именем нового способа оплаты
    }
}

// Валидирует заказ и отправляет события в зависимости от результата
export function orderValidation(formModel: any, orderView: any) {
    const config = { checkAddress: true, checkPaymentMethod: true }; // Конфигурация проверок
    const errors = formModel.validate(config); // Получаем возможные ошибки

    if (errors.address) {
        orderView.updateError(errors.address); // Обновляем сообщение об ошибке адреса
    } else if (errors.paymentMethod) {
        orderView.updateError(errors.paymentMethod); // Обновляем сообщение об ошибке способа оплаты
    } else {
        orderView.updateError(null); // Очищаем сообщение об ошибке
    }

    orderView.enableNextButton(formModel.isValid(config)); // Активация/деактивация кнопки "Далее"
}

// Валидирует контактные данные и отправляет события в зависимости от результата
export function contactsValidation(formModel: any, contactsView: any) {
    const config = { checkEmail: true, checkPhone: true }; // Конфигурация проверок
    const errors = formModel.validate(config); // Получаем возможные ошибки

    contactsView.updateEmailError(errors.email ?? null); // Обновляем сообщение об ошибке e-mail
    contactsView.updatePhoneError(errors.phone ?? null); // Обновляем сообщение об ошибке телефона

    contactsView.enableNextButton(formModel.isValid(config)); // Активация/деактивация кнопки "Далее"
}