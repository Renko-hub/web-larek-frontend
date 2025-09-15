// BasketView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';

export class BasketView {
    private static instance: BasketView | null = null;
    private readonly events: any;
    private readonly headerBasketButton: HTMLElement | null;
    private readonly basketCounter: HTMLElement | null;
    private readonly basketTemplate: HTMLTemplateElement;
    private readonly basketCard: HTMLElement;
    private readonly basketList: HTMLElement | null;
    private readonly basketTotalPrice: HTMLElement | null;
    private readonly checkoutButton: HTMLButtonElement | null;
    private currentContent: HTMLElement | null = null;

    constructor(events: any) {
    this.events = events;
    this.headerBasketButton = ensureElement('.header__basket');
    this.basketCounter = ensureElement('.header__basket-counter');
    this.basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
    this.basketCard = cloneTemplate(this.basketTemplate);
    this.basketList = ensureElement('.basket__list', this.basketCard);
    this.basketTotalPrice = ensureElement('.basket__price', this.basketCard);
    this.checkoutButton = ensureElement('.basket__button', this.basketCard) as HTMLButtonElement;

    // Присоединяем событие нажатия на иконку корзины
    this.headerBasketButton?.addEventListener('click', () => this.events.emit('open-basket'));
    
    // Новый код для кнопки оформления заказа
    this.checkoutButton?.addEventListener('click', () => this.events.emit('open-order'));
    }

    static getInstance(events: any): BasketView {
        return BasketView.instance || (BasketView.instance = new BasketView(events));
    }

    setContent(content: HTMLElement): void {
        this.currentContent = content;
    }

    render(basketItems: HTMLElement[], emptyMessage: string, totalPrice: number): HTMLElement {
        // Обновляем доступность кнопки оформления заказа
        if (this.checkoutButton) {
            this.checkoutButton.disabled = !!emptyMessage.trim(); 
        }

        // Очищаем список товаров в корзине
        if (this.basketList) {
            this.basketList.innerHTML = ''; 
            // Вставляем товары в корзину
            basketItems.forEach((item) => this.basketList.appendChild(item)); 
        }

        // Устанавливаем итоговую сумму покупок
        if (this.basketTotalPrice) {
            this.basketTotalPrice.textContent = emptyMessage || `${totalPrice} синапсов`; 
        }

        return this.basketCard;
    }

    updateBasketCounter(count: number): void {
        if (this.basketCounter) {
            this.basketCounter.textContent = count.toString(); 
        }
    }

    public getCurrentContent(): HTMLElement | null {
        return this.currentContent;
    }
}