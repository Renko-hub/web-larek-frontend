// BasketModel.ts

import { IProduct } from './ProductModel';
import { IEvents } from './base/events';

export interface IBasketItem extends IProduct {
    quantity: number; // Количество выбранного продукта в корзине
}

/**
 * Модель корзины покупок.
 */
export class BasketModel {
    private basket: Map<string, IBasketItem> = new Map(); // Хранит выбранные продукты
    private readonly events: IEvents; // Для взаимодействия с системой событий

    constructor(events: IEvents) {
        this.events = events;
    }

    // Общая сумма корзины
    get totalPrice(): number {
        return [...this.basket.values()].reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    // Общее количество товаров в корзине
    get totalItems(): number {
        return [...this.basket.values()].reduce((acc, item) => acc + item.quantity, 0);
    }

    // Список товаров в корзине
    get items(): IBasketItem[] {
        return [...this.basket.values()];
    }

    // Вернуть список товаров для отправки на сервер
    getSendableItems(): IBasketItem[] {
        return [...this.basket.values()]
            .filter(item => item.price > 0)
            .map(item => ({...item}));
    }

    // Сообщение, показываемое при пустой корзине
    get emptyMessage(): string {
        return this.basket.size === 0 ? 'Корзина пуста.' : '';
    }

    // Проверяет наличие товара в корзине
    hasItem(id: string): boolean {
        return this.basket.has(id);
    }

    // Добавляет товар в корзину
    add(product: IProduct): void {
        if (!product || !product.id) throw new Error("Некорректный продукт");
        if (this.basket.has(product.id)) return;
        this.basket.set(product.id, {...product, quantity: 1}); // Новый товар добавляется с количеством 1
        this.events.emit('add-to-basket', product); // Отправляем событие добавления товара
    }

    // Удаляет товар из корзины
    remove(productId: string): void {
        let item = this.basket.get(productId);
        if (item) {
            item.quantity > 1 ? item.quantity-- : this.basket.delete(productId); // Уменьшаем количество или удаляем товар
            this.events.emit('remove-from-basket', { productId }); // Отправляем событие удаления товара
        }
    }

    // Полностью очищает корзину
    clearBasket(): void {
        this.basket.clear();
        this.events.emit('basket-clear'); // Уведомляем систему о чистке корзины
    }
}