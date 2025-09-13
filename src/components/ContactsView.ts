// ContactsView.ts

import { cloneTemplate, ensureElement, createElement } from '../utils/utils';

/**
 * Компонент представления контактных данных покупателя.
 */
export class ContactsView {
    private static instance: ContactsView | null = null;
    private nextButton?: HTMLButtonElement; // Кнопка завершения покупки
    private emailErrorSpan?: HTMLSpanElement; // Поле вывода ошибок e-mail
    private phoneErrorSpan?: HTMLSpanElement; // Поле вывода ошибок телефона
    private emailField: HTMLInputElement; // Поле ввода e-mail
    private phoneField: HTMLInputElement; // Поле ввода номера телефона

    constructor(private events: any) {
        const contactsCard = cloneTemplate(ensureElement('#contacts') as HTMLTemplateElement);
        this.nextButton = ensureElement('.contacts__button', contactsCard) as HTMLButtonElement;
        this.emailField = ensureElement('input[name="email"]', contactsCard) as HTMLInputElement;
        this.phoneField = ensureElement('input[name="phone"]', contactsCard) as HTMLInputElement;
        this.emailErrorSpan = createElement('span', 'contacts__error-email');
        this.phoneErrorSpan = createElement('span', 'contacts__error-phone');
        this.emailField.after(this.emailErrorSpan);
        this.phoneField.after(this.phoneErrorSpan);
    }

    // Возвращает единственный экземпляр компонента
    static getInstance(events: any): ContactsView {
        return ContactsView.instance || (ContactsView.instance = new ContactsView(events));
    }

    // Формирует представление формы контактных данных
    render(): HTMLElement {
        // Обработка изменений поля e-mail
        this.emailField.addEventListener('input', ({ target }) => this.events.emit('change:email', { email: (target as HTMLInputElement).value }));

        // Обработка изменений поля телефона
        this.phoneField.addEventListener('input', ({ target }) => this.events.emit('change:phone', { phone: (target as HTMLInputElement).value }));

        // Перенаправление на страницу успешного завершения покупки
        this.nextButton.addEventListener('click', event => {
            this.events.emit('open-success');
            event.preventDefault();
        });

        return this.emailField.closest('form')!; // Возвращаем весь элемент формы
    }

    // Сброс состояния полей контактов
    resetState() {
        this.emailField.value = '';
        this.phoneField.value = '';
    }

    // Обрабатывает ошибки формы контактных данных
    handleFormErrors(errors: Record<'email' | 'phone', string>): void {
        ['email', 'phone'].forEach((field: 'email' | 'phone') => {
            if (errors[field]) {
                this.showError(field, errors[field]);
            } else {
                this.hideError(field);
            }
        });
    }

    // Включает/выключает кнопку завершения покупки
    toggleNextButton(enabled: boolean): void {
        this.nextButton && (
            this.nextButton.disabled = !enabled,
            this.nextButton.classList.toggle('disabled', !enabled)
        );
    }

    // Показывает ошибку поля контактных данных
    showError(field: 'email' | 'phone', message: string): void {
        const span = field === 'email' ? this.emailErrorSpan : this.phoneErrorSpan;
        span && ((span.textContent = message), (span.style.display = 'block'));
    }

    // Скрывает ошибку поля контактных данных
    hideError(field: 'email' | 'phone'): void {
        const span = field === 'email' ? this.emailErrorSpan : this.phoneErrorSpan;
        span && (span.style.display = 'none');
    }
}