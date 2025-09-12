// SuccessView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';

/**
 * Компонент успешной транзакции (оформления заказа).
 */
export class SuccessView {
    private static instance: SuccessView | null = null;

    constructor(private events: any) {}

    // Возвращает единственный экземпляр компонента
    static getInstance(events: any): SuccessView {
        return SuccessView.instance || (SuccessView.instance = new SuccessView(events));
    }

    // Формирование страницы подтверждения успешности заказа
    show(totalSum: number): HTMLElement {
        const template = ensureElement('#success') as HTMLTemplateElement;
        const successCard = cloneTemplate(template);
        const totalSumEl = ensureElement('.order-success__description', successCard);
        const closeButtonInModal = ensureElement('.order-success__close', successCard) as HTMLButtonElement;
        if (!totalSumEl || !closeButtonInModal) return successCard;
        totalSumEl.textContent = `Списано ${totalSum} синапсов`;
        closeButtonInModal.addEventListener('click', () => {
            this.events.emit('close-success');
        });
        return successCard;
    }
}