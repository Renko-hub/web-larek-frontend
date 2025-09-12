// BasketView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IBasketItem } from './BasketModel';
import { Card } from './Card';

/**
 * Представление корзины товаров.
 */
export class BasketView {
    private static instance: BasketView | null = null;
    private readonly events: any;
    private readonly headerBasketButton: HTMLElement | null;
    private readonly basketCounter: HTMLElement | null;
    private readonly basketTemplate: HTMLTemplateElement;
    private readonly cardBasketTemplate: HTMLTemplateElement;

    constructor(events: any) {
        this.events = events;
        this.headerBasketButton = ensureElement('.header__basket');
        this.basketCounter = ensureElement('.header__basket-counter');
        this.basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
        this.cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
       
        // Присоединяем слушателя клика на иконку корзины
        this.headerBasketButton?.addEventListener('click', () => this.events.emit('open-basket'));
    }

    // Возвращает единственный экземпляр компонента
    static getInstance(events: any): BasketView {
        return BasketView.instance || (BasketView.instance = new BasketView(events));
    }

    // Создаем приватный метод для клонирования карточки продукта
    private createCardClone(): HTMLLIElement {
        return cloneTemplate(this.cardBasketTemplate) as HTMLLIElement;
    }

    // Показывает содержимое корзины в модальном окне
    show(basketProducts: IBasketItem[], emptyMessage: string, totalPrice: number, removeFromBasket: (id: string) => void): HTMLElement {
        const basketCard = cloneTemplate(this.basketTemplate);
        const basketList = ensureElement('.basket__list', basketCard)!;
        const basketTotalPrice = ensureElement('.basket__price', basketCard)!;
        const checkoutButton = ensureElement('.basket__button', basketCard) as HTMLButtonElement;
    
        checkoutButton.disabled = !!emptyMessage.trim();
        checkoutButton.addEventListener('click', () => this.events.emit('open-order'));
    
        basketList.innerHTML = '';
        basketProducts.forEach((product, idx) => this.renderProduct(product, basketList, idx + 1, removeFromBasket));
    
        basketTotalPrice.textContent = emptyMessage || `${totalPrice} синапсов`;
        return basketCard;
    }

    // Отрисовка отдельного товара в списке корзины
    renderProduct(product: IBasketItem, list: HTMLElement, index: number, removeFromBasket: (id: string) => void): void {
        const itemClone = this.createCardClone();
        const indexSpan = itemClone.querySelector('.basket__item-index')!;
        indexSpan.textContent = String(index);
        Card.fillProductCard(itemClone, product, '', {}, { skipCategory: true, skipImage: true });
        const delBtn = itemClone.querySelector('.basket__item-delete')!;
        delBtn.addEventListener('click', () => removeFromBasket(product.id));
        list.appendChild(itemClone);
    }

    // Обновляет счётчик количества товаров в корзине
    updateBasketCounter(count: number): void {
        if (!this.basketCounter) return;
        this.basketCounter.textContent = count.toString();
    }
}