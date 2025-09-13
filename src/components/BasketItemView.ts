// BasketItemView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IBasketItem } from './BasketModel';
import { Card } from './Card';

/**
 * Представление отдельной строки товара в корзине.
 */
export class BasketItemView {
    private readonly cardBasketTemplate: HTMLTemplateElement;
    private readonly indexSelector: string = '.basket__item-index';   // Селектор индекса
    private readonly deleteButtonSelector: string = '.basket__item-delete'; // Селектор кнопки удаления

    constructor() {
        this.cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
    }

    /**
     * Рендерит карточку товара в заданный элемент DOM.
     *
     * @param product - объект товарной позиции
     * @param container - контейнер, куда добавить карточку
     * @param onRemoveClick - колбэк удаления товара
     */
    render(product: IBasketItem, container: HTMLElement, onRemoveClick: (id: string) => void): void {
        const itemClone = cloneTemplate(this.cardBasketTemplate) as HTMLLIElement;
        
        // Используем ensureElement для получения элементов
        const indexSpan = ensureElement(`${this.indexSelector}`, itemClone); 
        indexSpan.textContent = String(product.index ?? '');
        
        Card.fillProductCard(itemClone, product, '', {}, { skipCategory: true, skipImage: true });
        
        const delBtn = ensureElement(`${this.deleteButtonSelector}`, itemClone); 
        delBtn.addEventListener('click', () => onRemoveClick(product.id));
        
        container.appendChild(itemClone);
    }
}