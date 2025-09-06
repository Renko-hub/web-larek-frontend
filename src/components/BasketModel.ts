// BasketModel.ts

import { IProduct } from './ProductModel';

export class BasketModel {
    private products: Map<string, IProduct> = new Map(); // Хранение продуктов по ключу (id)
    private quantities: Map<string, number> = new Map(); // Хранение количества каждого продукта

    // Вычисляемое свойство: общая стоимость всех товаров в корзине
    get totalPrice(): number {
        return Array.from(this.products.entries())
            .reduce((sum, [_, product]) => sum + (product.price * (this.quantities.get(product.id) ?? 0)), 0);
    }

    // Вычисляемое свойство: общее количество товаров в корзине
    get totalItems(): number {
        return Array.from(this.quantities.values()).reduce((a, b) => a + b, 0);
    }

    // Получение списка товаров с количеством
    get items(): IProduct[] {
        return Array.from(this.products.keys()).map(key => ({
            ...this.products.get(key)!,
            quantity: this.quantities.get(key)!
        }));
    }

    // Фильтрация товаров по цене больше нуля
    getFilteredItems(): IProduct[] {
        return Array.from(this.products.keys())
                   .map(key => ({...this.products.get(key)!, quantity: this.quantities.get(key)!}))
                   .filter(item => item.price > 0);
    }

    // Добавляет товар в корзину (если товар уже существует, обновляется только количество)
    add(product: IProduct): void {
        if (this.products.has(product.id)) return;
        this.products.set(product.id, product);
        this.quantities.set(product.id, 1);
    }

    // Удаляет один экземпляр товара из корзины
    removeOne(productId: string): void {
        const product = this.products.get(productId);
        if (product) {
            this.products.delete(productId);
            this.quantities.delete(productId);
        }
    }

    // Полностью очищает корзину
    clear(): void {
        this.products.clear();
        this.quantities.clear();
    }

    // Проверяет, пуста ли корзина
    isEmpty(): boolean {
        return this.products.size === 0 && this.quantities.size === 0;
    }
}