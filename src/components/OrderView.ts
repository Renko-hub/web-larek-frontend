// OrderView.ts

import { cloneTemplate, ensureElement, createElement } from '../utils/utils';

/**
 * Компонент представления формы заказа.
 */
export class OrderView {
    private static instance: OrderView | null = null;
    private nextButton?: HTMLButtonElement; // Кнопка перехода к следующей стадии оформления
    private errorSpan?: HTMLSpanElement; // Поле вывода ошибок формы
    private addressField: HTMLInputElement; // Поле ввода адреса доставки
    private buttonsGroup: NodeListOf<HTMLButtonElement>; // Группа кнопок выбора метода оплаты

    constructor(private events: any) {
        const orderCard = cloneTemplate(ensureElement('#order') as HTMLTemplateElement);
        this.nextButton = ensureElement('.order__button', orderCard) as HTMLButtonElement;
        this.addressField = ensureElement('input[name="address"]', orderCard) as HTMLInputElement;
        this.buttonsGroup = orderCard.querySelectorAll('.order__buttons > button');
        this.errorSpan = createElement('span', 'order__error-message');
        this.addressField.after(this.errorSpan);
    }

    // Возвращает единственный экземпляр компонента
    static getInstance(events: any): OrderView {
        return OrderView.instance || (OrderView.instance = new OrderView(events));
    }

    // Формирует представление формы заказа
    show(): HTMLElement {
        // Устанавливаем обработчики событий
        this.buttonsGroup.forEach(button =>
            button.addEventListener('click', () => {
                this.buttonsGroup.forEach(b => b.classList.toggle('button_alt-active', b === button));
                this.events.emit('change:paymentMethod', { paymentMethod: button.name });
            })
        );

        // Обработка изменения поля ввода адреса
        this.addressField.addEventListener('input', event => {
            const inputElement = event.target as HTMLInputElement;
            this.events.emit('change:address', { address: inputElement.value });
        });

        // Переход к форме контактных данных
        this.nextButton.addEventListener('click', event => {
            this.events.emit('open-contacts');
            event.preventDefault();
        });

        return this.addressField.closest('form')!; // Возвращаем весь элемент формы
    }

    // Обрабатывает ошибки формы заказа
    handleFormErrors(errors: Record<string, string>): void {
        if (!errors) return;
        this.showError(errors.address || Object.values(errors)[0]);
    }

    // Включает/выключает кнопку продолжения оформления
    toggleNextButton(enabled: boolean): void {
        this.nextButton && (
            this.nextButton.disabled = !enabled,
            this.nextButton.classList.toggle('disabled', !enabled)
        );
    }

    // Показывает ошибку заполнения формы
    showError(message: string): void {
        this.errorSpan && (
            this.errorSpan.textContent = message,
            this.errorSpan.style.display = 'block'
        );
    }

    // Скрывает ошибку заполнения формы
    hideError(): void {
        this.errorSpan && (this.errorSpan.style.display = 'none');
    }
}