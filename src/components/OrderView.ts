// OrderView.ts

import { cloneTemplate, ensureElement, ensureAllElements } from '../utils/utils';
import { updateError, selectPaymentMethod } from './Components';
import { Modal } from './Modal';

export class OrderView {
    private static instance: OrderView; // Синглтон представление оформления заказа
    private modal: Modal; // Экземпляр модального окна
    private addressField: HTMLInputElement | null; // Поле ввода адреса доставки
    private nextButton: HTMLButtonElement | null; // Кнопка перехода к следующему этапу
    private paymentButtons: HTMLButtonElement[] = []; // Массив кнопок выбора способов оплаты
    private readonly _eventEmitter: any; // Эммитер событий для взаимодействия с другими компонентами

    private constructor(eventEmitter: any) {
        this._eventEmitter = eventEmitter;
        this.modal = Modal.getInstance('modal-container'); // Инициализируем модал
    }

    // Получаем singleton-экземпляр OrderView
    public static getInstance(eventEmitter: any): OrderView {
        if (!OrderView.instance) {
            OrderView.instance = new OrderView(eventEmitter);
        }
        return OrderView.instance;
    }

    // Открытие экрана оформления заказа
    openOrder() {
        this._eventEmitter.emit('orderview:opened');
        const orderTemplate = ensureElement('#order') as HTMLTemplateElement; // Шаблон оформления заказа
        if (orderTemplate) {
            const orderClone = cloneTemplate(orderTemplate);
            if (orderClone) {
                this.modal.setContent(orderClone); // Устанавливаем контент модала
                this.addressField = ensureElement('input[name="address"]', orderClone) as HTMLInputElement; // Поле адреса
                this.nextButton = ensureElement('.order__button', orderClone) as HTMLButtonElement; // Кнопка продолжения
                this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons > button', orderClone); // Способы оплаты

                if (!this.addressField || !this.paymentButtons.length || !this.nextButton) {
                    throw new Error('Некорректная разметка формы заказа.'); // Бросаем ошибку, если разметка некорректна
                }

                // Устанавливаем начальные значения в модели формы
                this._eventEmitter.emit('form-model:set-payment', { newPayment: '' });
                this._eventEmitter.emit('form-model:set-address', { newAddress: this.addressField.value });

                // Реагируем на изменения в поле адреса
                this.addressField.addEventListener('input', () => {
                    this._eventEmitter.emit('form-model:set-address', { newAddress: this.addressField.value });
                });

                // Выбор способа оплаты
                this.paymentButtons.forEach((button, index) => {
                    button.addEventListener('click', () => {
                        this.selectPaymentMethod(index); // Изменяем активный способ оплаты
                    });
                });

                // Продолжаем оформление заказа
                this.nextButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    this._eventEmitter.emit('open-contacts'); // Переход к экрану контактов
                });
            }
        }
        this.modal.open(); // Открываем модал
    }

    // Закрываем окно оформления заказа
    close() {
        this.modal.close();
    }

    // Активирует/деактивирует кнопку "Далее"
    enableNextButton(value: boolean) {
        if (this.nextButton) {
            this.nextButton.disabled = !value;
        }
    }

    // Обновляет сообщение об ошибке
    updateError(errorMessage?: string) {
        updateError(this.addressField, 'order-error', errorMessage);
    }

    // Меняет активный способ оплаты
    selectPaymentMethod(selectedIndex: number) {
        if (this.paymentButtons) {
            selectPaymentMethod(this.paymentButtons, selectedIndex, (newPayment: string) => {
                this._eventEmitter.emit('form-model:set-payment', { newPayment });
            });
        }
    }
}