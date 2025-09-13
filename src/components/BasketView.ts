// BasketView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IBasketItem } from './BasketModel';
import { BasketItemView } from './BasketItemView';

/**
 * Представление корзины товаров.
 */
export class BasketView {
    private static instance: BasketView | null = null;
    private readonly events: any;
    private readonly headerBasketButton: HTMLElement;
    private readonly basketCounter: HTMLElement;
    private readonly basketTemplate: HTMLTemplateElement;
    private readonly basketItemView: BasketItemView;
    private currentContent: HTMLElement | null = null;

    constructor(events: any) {
        this.events = events;
        this.headerBasketButton = ensureElement('.header__basket');
        this.basketCounter = ensureElement('.header__basket-counter');
        this.basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
        this.basketItemView = new BasketItemView();
    
        this.headerBasketButton?.addEventListener('click', () => this.events.emit('open-basket'));
    }

    // Возвращает единственный экземпляр компонента
    static getInstance(events: any): BasketView {
        return BasketView.instance || (BasketView.instance = new BasketView(events));
    }

    /**
     * Сохраняет полученный контент корзины.
     *
     * @param content - Готовый элемент корзины
     */
    setContent(content: HTMLElement): void {
        this.currentContent = content;
    }

    /**
     * Отображает содержимое корзины в модальном окне.
     *
     * @returns Готовый элемент корзины
     */
    render(basketProducts: IBasketItem[], emptyMessage: string, totalPrice: number, removeFromBasket: (id: string) => void): HTMLElement {
        const basketCard = cloneTemplate(this.basketTemplate);
        const basketList = ensureElement('.basket__list', basketCard)!;
        const basketTotalPrice = ensureElement('.basket__price', basketCard)!;
        const checkoutButton = ensureElement('.basket__button', basketCard) as HTMLButtonElement;

        checkoutButton.disabled = !!emptyMessage.trim();
        checkoutButton.addEventListener('click', () => this.events.emit('open-order'));

        basketList.innerHTML = '';
        basketProducts.forEach((product) =>
            this.basketItemView.render(product, basketList, removeFromBasket)
        );

        basketTotalPrice.textContent = emptyMessage || `${totalPrice} синапсов`;
        return basketCard;
    }

    // Обновляет счётчик количества товаров в корзине
    updateBasketCounter(count: number): void {
        if (!this.basketCounter) return;
        this.basketCounter.textContent = count.toString();
    }

    /**
     * Получает текущий контент корзины.
     */
    public getCurrentContent(): HTMLElement | null {
        return this.currentContent;
    }
}