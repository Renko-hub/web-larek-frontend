// BasketItemView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IBasketItem } from './BasketModel';

export class BasketItemView {
    private readonly basketTemplate: HTMLTemplateElement;

    constructor() {
        this.basketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
    }

    create(product: IBasketItem, onRemoveClick: (id: string) => void): HTMLElement {
        const itemClone = cloneTemplate(this.basketTemplate) as HTMLLIElement;

        // Устанавливаем порядковый номер товара
        const indexSpan = ensureElement('.basket__item-index', itemClone);
        indexSpan.textContent = String(product.index ?? '');

        // Устанавливаем название товара
        const titleEl = ensureElement('.card__title', itemClone);
        if (titleEl) titleEl.textContent = product.title;

        // Установим цену товара, используя готовую строку из модели
        const priceEl = ensureElement('.card__price', itemClone);
        if (priceEl && product.displayText) priceEl.textContent = product.displayText;

        // Назначаем обработчик события удаления товара из корзины
        const delBtn = ensureElement('.basket__item-delete', itemClone);
        delBtn.addEventListener('click', () => onRemoveClick(product.id));

        return itemClone;
    }
}