// SuccessView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';

/**
 * Компонент успешной транзакции (оформления заказа).
 */
export class SuccessView {
    private static instance: SuccessView | null = null;

    // Элементы, найденные один раз при инициализации
    private readonly totalSumEl: HTMLElement | null;
    private readonly closeButtonInModal: HTMLButtonElement | null;

    constructor(private events: any) {
    const template = ensureElement('#success') as HTMLTemplateElement;
    const clonedTemplate = cloneTemplate(template);
    this.totalSumEl = ensureElement('.order-success__description', clonedTemplate);
    this.closeButtonInModal = ensureElement('.order-success__close', clonedTemplate) as HTMLButtonElement;

    // Добавляем обработчик сразу в конструкторе
    this.closeButtonInModal.addEventListener('click', () => {
        this.events.emit('close-success');
    });
    }

    // Возвращает единственный экземпляр компонента
    static getInstance(events: any): SuccessView {
        return SuccessView.instance || (SuccessView.instance = new SuccessView(events));
    }

    // Формирование страницы подтверждения успешности заказа
    render(totalSum: number): HTMLElement {
        if (!this.totalSumEl || !this.closeButtonInModal) {
            throw new Error("UI не инициализирован");
        }
    
        this.totalSumEl.textContent = `Списано ${totalSum} синапсов`;

        return this.closeButtonInModal.parentNode as HTMLElement;
    }
}