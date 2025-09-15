// BasketItemView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IBasketItem } from './BasketModel';

export class BasketItemView {
    private readonly basketTemplate: HTMLTemplateElement;
    private readonly indexSelector: string = '.basket__item-index';
    private readonly titleSelector: string = '.card__title';
    private readonly priceSelector: string = '.card__price';
    private readonly deleteButtonSelector: string = '.basket__item-delete';

    constructor() {
        this.basketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
    }

    create(product: IBasketItem, onRemoveClick: (id: string) => void): HTMLElement {
        const itemClone = cloneTemplate(this.basketTemplate) as HTMLLIElement;
        
        // Используем заранее заданные селекторы для элементов
        const indexSpan = ensureElement(this.indexSelector, itemClone);
        indexSpan.textContent = String(product.index ?? '');

        const titleEl = ensureElement(this.titleSelector, itemClone);
        if (titleEl) titleEl.textContent = product.title;

        const priceEl = ensureElement(this.priceSelector, itemClone);
        if (priceEl && product.displayText) priceEl.textContent = product.displayText;

        const delBtn = ensureElement(this.deleteButtonSelector, itemClone);
        delBtn.addEventListener('click', () => onRemoveClick(product.id));

        return itemClone;
    }
}