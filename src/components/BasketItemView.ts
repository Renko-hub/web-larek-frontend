// BasketItemView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IBasketItem } from './BasketModel';
import { Card } from './Card';

/**
 * Представление отдельной строки товара в корзине.
 */
export class BasketItemView {
    private readonly cardBasketTemplate: HTMLTemplateElement;
    private readonly indexSelector: string = '.basket__item-index';   
    private readonly deleteButtonSelector: string = '.basket__item-delete'; 

    constructor() {
        this.cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
    }

    /**
     * Генерирует DOM-представление отдельного товара в корзине.
     *
     * @param product - объект товарной позиции
     * @param onRemoveClick - колбэк удаления товара
     * @return Готовое DOM-представление
     */
    create(product: IBasketItem, onRemoveClick: (id: string) => void): HTMLElement {
        const itemClone = cloneTemplate(this.cardBasketTemplate) as HTMLLIElement;

        // Используем ensureElement для нахождения внутренних элементов в пределах itemClone
        const indexSpan = ensureElement(this.indexSelector, itemClone); 
        indexSpan.textContent = String(product.index ?? '');

        // Наполняем карточку товарами
        Card.fillProductCard(itemClone, product, '', {}, { skipCategory: true, skipImage: true });

        // Кнопка удаления
        const delBtn = ensureElement(this.deleteButtonSelector, itemClone); 
        delBtn.addEventListener('click', () => onRemoveClick(product.id));

        return itemClone;
    }
}