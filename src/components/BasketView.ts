// BasketView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';

export class BasketView {
    private static instance: BasketView | null = null;
    private readonly events: any;
    private readonly basketTemplate: HTMLTemplateElement;
    private readonly basketCard: HTMLElement;
    private readonly basketList: HTMLElement | null;
    private readonly basketTotalPrice: HTMLElement | null;
    private readonly checkoutButton: HTMLButtonElement | null;

    constructor(events: any) {
        this.events = events;
        this.basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
        this.basketCard = cloneTemplate(this.basketTemplate);
        this.basketList = ensureElement('.basket__list', this.basketCard);
        this.basketTotalPrice = ensureElement('.basket__price', this.basketCard);
        this.checkoutButton = ensureElement('.basket__button', this.basketCard) as HTMLButtonElement;

        document.querySelector('.header__basket')?.addEventListener('click', () => this.events.emit('open-basket'));
        this.checkoutButton?.addEventListener('click', () => this.events.emit('open-order'));
    }

    static getInstance(events: any): BasketView {
        return BasketView.instance || (BasketView.instance = new BasketView(events));
    }

    render(basketItems: HTMLElement[], emptyMessage: string, totalPrice: number): HTMLElement {
        this.checkoutButton.disabled = !!(emptyMessage.trim()); // Если сообщение не пустое, кнопка отключается
        this.basketList && basketItems.length > 0 && this.setBasketItems(basketItems); // Если есть товары, устанавливаем элементы
        this.basketTotalPrice && (this.basketTotalPrice.textContent = emptyMessage || `${totalPrice} синапсов`); // Отображаем итоговую цену или сообщение
        return this.basketCard;
    }

    updateBasketCounter(count: number): void {
        const counter = document.querySelector('.header__basket-counter');
        counter && (counter.textContent = count.toString());
    }

    setBasketItems(items: HTMLElement[]): void {
        const list = this.basketList;
        if (!list) return;
        list.innerHTML = ''; // Чистим список
        items.forEach(item => list.appendChild(item)); // Заполняем новыми элементами
    }
}