// BasketView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { Modal } from './Modal';

export class BasketView {
    private static instance: BasketView; // Синглтон представления корзины
    private modal: Modal; // Экземпляр модального окна
    private headerBasketButton: HTMLElement | null; // Элемент кнопки открытия корзины в шапке сайта
    private basketCounter: HTMLElement | null; // Элемент индикатора количества товаров в корзине
    private readonly _eventEmitter: any; // Эммитер событий для взаимодействия с другими компонентами

    private constructor(eventEmitter: any) {
        this._eventEmitter = eventEmitter;
        this.modal = Modal.getInstance('modal-container'); // Инициализируем модал
        this.headerBasketButton = ensureElement('.header__basket'); // Кнопка открытия корзины
        this.basketCounter = ensureElement('.header__basket-counter'); // Индикатор количества товаров
        
        if (this.headerBasketButton && this._eventEmitter) {
            this.headerBasketButton.addEventListener('click', () => {
                this._eventEmitter.emit('open-basket'); // Отправляем событие открытия корзины
            });
        }
    }

    // Получаем singleton-экземпляр корзины
    public static getInstance(eventEmitter: any): BasketView {
        if (!BasketView.instance) {
            BasketView.instance = new BasketView(eventEmitter);
        }
        return BasketView.instance;
    }

    // Открытие корзины
    openBasket() {
        const basketTemplate = ensureElement('#basket') as HTMLTemplateElement; // Шабатн корзины
        if (!basketTemplate) return;
    
        const clonedTemplate = cloneTemplate(basketTemplate); // Клонируем шаблон
        if (!clonedTemplate) return;
    
        this.modal.setContent(clonedTemplate); // Устанавливаем содержание модала
        this.modal.open(); // Открываем модал

        const basketList = ensureElement('.basket__list', clonedTemplate); // Список товаров в корзине
        const basketTotalPrice = ensureElement('.basket__price', clonedTemplate); // Итоговая сумма корзины

        if (!basketList || !basketTotalPrice) return;
    
        this.renderBasketItems(basketList, basketTotalPrice); // Рендерим товары корзины
    }

    // Рендер списка товаров в корзине
    renderBasketItems(listContainer: HTMLElement, totalPriceElement: HTMLElement) {
        this._eventEmitter.emit('request:basket-data', (data: any[]) => {
            listContainer.innerHTML = '';

            data.forEach((item, index) => {
                const basketItem = cloneTemplate<HTMLElement>('#card-basket'); // Карточка товара в корзине
                if (!basketItem) return;

                const indexEl = ensureElement('.basket__item-index', basketItem); // Номер элемента
                const titleEl = ensureElement('.card__title', basketItem); // Название товара
                const priceEl = ensureElement('.card__price', basketItem); // Цена товара
                const deleteButton = ensureElement('.basket__item-delete', basketItem); // Кнопка удаления товара

                if (indexEl) indexEl.textContent = (index + 1).toString();
                if (titleEl) titleEl.textContent = item.title;
                if (priceEl) {
                let numericPrice = Number(item.price);
                priceEl.textContent =
                numericPrice === 0 ? 'Бесплатно' : `${numericPrice * item.quantity} синапсов`;
                }

                if (deleteButton) {
                    deleteButton.addEventListener('click', () => {
                        this._eventEmitter.emit('remove-from-basket', { productId: item.id }); // Уведомляем удаление товара
                        this.renderBasketItems(ensureElement('.basket__list'), ensureElement('.basket__price')); // Перерисовываем список товаров
                    });
                }

                listContainer.appendChild(basketItem);
            });

            // Обновляем итоговую сумму корзины
            this._eventEmitter.emit('request:basket-total-sum', (totalSum: number) => {
                totalPriceElement.textContent = `${totalSum} синапсов`;
            });

            // Проверяем состояние корзины
            this._eventEmitter.emit('request:basket-is-empty', (isEmpty: boolean) => {
                const checkoutButton = ensureElement<HTMLButtonElement>('.basket__button');
                if (checkoutButton) {
                    checkoutButton.disabled = isEmpty;
                    
                    if (!isEmpty) {
                        checkoutButton.addEventListener('click', () => {
                            this._eventEmitter.emit('open-order'); // Переход к оформлению заказа
                        });
                    }
                }
                
                if (isEmpty) {
                    totalPriceElement.textContent = 'Корзина пуста';
                }
            });
        });
    }

    // Закрытие корзины
    close() {
        this.modal.close();
    }

    // Обновляет индикатор количества товаров в корзине
    updateBasketCounter() {
        if (!this.basketCounter) return;
        this._eventEmitter.emit('request:basket-count', (count: number) => {
            this.basketCounter.textContent = count.toString();
        });
    }
}