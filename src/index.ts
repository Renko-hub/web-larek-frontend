// index.ts

import { BasketController } from './components/BasketController';
import { BasketModel } from './components/BasketModel';
import { BasketView } from './components/BasketView';
import { CardView } from './components/CardView';
import { ContactsView } from './components/ContactsView';
import { EventEmitter } from './components/base/events';
import { OrderView } from './components/OrderView';
import { SuccessView } from './components/SuccessView';
import { IProduct } from './components/ProductModel';
import { Api } from './components/base/api';
import { API_URL, CDN_URL, categoryClasses } from './utils/constants';
import { ProductModel, ProductsResponse } from './components/ProductModel';
import { Page } from './components/Page';

import './scss/styles.scss';

const events = new EventEmitter();

const basketModel = BasketModel.getInstance(events);
const basketView = BasketView.getInstance(events, CDN_URL, categoryClasses);
const basketController = BasketController.getInstance(basketModel);
const cardView = CardView.getInstance(events, CDN_URL, categoryClasses);
const contactsView = ContactsView.getInstance(events);
const orderView = OrderView.getInstance(events);
const successView = SuccessView.getInstance(events);

const page = new Page(events, cardView);

let openCounter = 0;

events.on('form:change-address', () => {});
events.on('form:change-payment-method', () => {});
events.on('form:change-email', () => {});
events.on('form:change-phone', () => {});

events.on('form:submit-contacts', () => events.emit('contact:submit'));
events.on('order:start', () => orderView.showOrder());
events.on('order:success', () => contactsView.showContacts());
events.on('contact:success', () => {
    const finalAmount = basketModel.totalPrice;
    events.emit('clean-up:basket');
    successView.showSuccess(finalAmount);
});

events.on('clean-up:basket', () => {
    basketController.clearBasket();
    basketView.closeBasket();
});

events.on('product:open-card', ({ productId }: { productId: string }) => {
    const product = basketModel.findProductById(productId);
    product && cardView.showProductCard(product);
});

events.on('basket:add-product', (product: IProduct) => basketController.addToBasket(product));
events.on('basket:remove-product', ({ id }: { id: string }) => basketController.removeFromBasket(id));
events.on('basket:change', () => events.emit('ui:basket-update'));
events.on('ui:basket-update', () => basketView.refreshUI());
events.on('basket:open', () => {
    openCounter++;
    basketView.refreshUI();
});

events.on('request:basket-data', _ => {
    const basketData = {
        basketTotalCount: basketModel.totalItems,
        basketTotalPrice: basketModel.totalPrice,
        basketProducts: basketModel.items
    };
    basketView.setData(basketData);
});

events.on('products:show', () => {
    page.showGallery();
});

function loadCatalog() {
    return new Api(API_URL).get('/product')
        .then(response => {
            if (!response) return;
            const products = (response as ProductsResponse).items || [];
            ProductModel.getInstance(events).set(products);
        })
        .catch(() => {});
}

window.onload = () => {
    loadCatalog()
        .then(() => {
            successView.initialize(events);
            basketView.initialize();
        });
};

window.onbeforeunload = () => events.offAll();