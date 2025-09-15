// BasketModel.ts

import { IProduct } from './ProductModel';
import { IEvents } from './base/events';

export interface IBasketItem extends IProduct {
    quantity: number; // Количество выбранного продукта в корзине
    index?: number;   // Индекс товара в корзине
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
        return Array.from(this.basket.values()).reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    // Общее количество товаров в корзине
    get totalItems(): number {
        return Array.from(this.basket.values()).reduce((acc, item) => acc + item.quantity, 0);
    }

    // Список товаров в корзине
    get items(): IBasketItem[] {
        return Array.from(this.basket.values());
    }

    // Вернуть список товаров для отправки на сервер
    getSendableItems(): IBasketItem[] {
        return this.items.filter(item => item.price > 0).map(item => ({...item}));
    }

    // Сообщение, показываемое при пустой корзине
    get emptyMessage(): string {
        return this.basket.size === 0 ? 'Корзина пуста.' : '';
    }

    // Проверяет наличие товара в корзине
    hasItem(id: string): boolean {
        return this.basket.has(id);
    }

    // Метод обновления индексов всех товаров
    private updateIndexes(): void {
        let i = 1;
        for (let item of this.basket.values()) {
            item.index = i++;
        }
    }

    // Добавляет товар в корзину
    add(product: IProduct): void {
        if (!product || !product.id) throw new Error("Некорректный продукт");
        if (this.basket.has(product.id)) return;
        this.basket.set(product.id, {...product, quantity: 1}); // Новый товар добавляется с количеством 1
        this.updateIndexes(); // Переназначаем индексы после добавления товара
        this.events.emit('basket:change'); // событие добавления
    }

    // Удаляет товар из корзины
    remove(productId: string): void {
        let item = this.basket.get(productId);
        if (item && item.quantity > 1) {
            item.quantity--;
        } else {
            this.basket.delete(productId);
        }
        this.updateIndexes(); // Переназначаем индексы после удаления товара
        this.events.emit('basket:change'); // событие удаления
    }

    // Полностью очищает корзину
    clearBasket(): void {
        if (this.basket.size > 0) {
            this.basket.clear();
            this.events.emit('basket:change');
        }
    }
}