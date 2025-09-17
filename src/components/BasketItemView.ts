// BasketItemView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IBasketItem } from './BasketModel';

export class BasketItemView {
    private readonly basketTemplate: HTMLTemplateElement;
    private readonly events: any;

    constructor(events: any) {
        this.basketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
        this.events = events;
    }

    create(product: IBasketItem, onRemoveClick: (id: string) => void): HTMLElement {
        const itemClone = cloneTemplate(this.basketTemplate) as HTMLLIElement;

        // Индексация товара
        const indexEl = ensureElement('.basket__item-index', itemClone);
        if (indexEl) indexEl.textContent = String(product.index ?? '');

        // Название товара
        const titleEl = ensureElement('.card__title', itemClone);
        if (titleEl) titleEl.textContent = product.title;

        // Цена товара
        const priceEl = ensureElement('.card__price', itemClone);
        if (priceEl) priceEl.textContent = product.displayText;

        // Кнопка удаления товара
        const delBtn = ensureElement('.basket__item-delete', itemClone);
        if (delBtn) {
            delBtn.addEventListener('click', () => onRemoveClick(product.id));
        }

        return itemClone;
    }
}