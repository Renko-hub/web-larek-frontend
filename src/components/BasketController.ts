// BasketController.ts

import { BasketModel } from './BasketModel';
import { IProduct } from './ProductModel';

export class BasketController {
    private static instance: BasketController | null = null;
    private model: BasketModel;

    private constructor(model: BasketModel) {
        this.model = model;
    }

    static getInstance(model: BasketModel): BasketController {
        return BasketController.instance || (BasketController.instance = new BasketController(model));
    }

    addToBasket(product: IProduct) {
        this.model.add(product);
    }

    removeFromBasket(productId: string) {
        this.model.removeOne(productId);
    }

    clearBasket() {
        this.model.clear();
    }
}