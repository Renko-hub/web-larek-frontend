// BasketView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';

/**
 * Представление корзины товаров.
 */
export class BasketView {
    private static instance: BasketView | null = null;
    private readonly events: any;
    private readonly headerBasketButton: HTMLElement;
    private readonly basketCounter: HTMLElement;
    private readonly basketTemplate: HTMLTemplateElement;
    private readonly basketCard: HTMLElement;
    private readonly basketList: HTMLElement;
    private readonly basketTotalPrice: HTMLElement;
    private readonly checkoutButton: HTMLButtonElement;
    private currentContent: HTMLElement | null = null;

    constructor(events: any) {
        this.events = events;
        this.headerBasketButton = ensureElement('.header__basket');
        this.basketCounter = ensureElement('.header__basket-counter');
        this.basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
        this.basketCard = cloneTemplate(this.basketTemplate);
        this.basketList = ensureElement('.basket__list', this.basketCard)!;
        this.basketTotalPrice = ensureElement('.basket__price', this.basketCard)!;
        this.checkoutButton = ensureElement('.basket__button', this.basketCard) as HTMLButtonElement;
        
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
    render(basketItems: HTMLElement[] | [], emptyMessage: string, totalPrice: number): HTMLElement {
        this.checkoutButton.disabled = !!emptyMessage.trim(); // Блокировка кнопки при пустоте корзины
        this.checkoutButton.addEventListener('click', () => this.events.emit('open-order')); 

        this.basketList.innerHTML = '';
        basketItems.forEach((item) => this.basketList.appendChild(item)); // вставка подготовленных карточек

        this.basketTotalPrice.textContent = emptyMessage || `${totalPrice} синапсов`;
        return this.basketCard;
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