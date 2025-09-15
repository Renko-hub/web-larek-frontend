// presenter.ts
import {Api, ApiListResponse} from './components/base/api';
import {API_URL, CDN_URL, colorsCategory} from './utils/constants';
import {IProduct, ProductsModel} from './components/ProductModel';
import {EventEmitter} from './components/base/events';
import {Card} from './components/Card';
import {Modal} from './components/Modal';
import {CardView} from './components/CardView';
import {BasketView} from './components/BasketView';
import {OrderView} from './components/OrderView';
import {ContactsView} from './components/ContactsView';
import {SuccessView} from './components/SuccessView';
import {BasketModel} from './components/BasketModel';
import {FormModel} from './components/FormModel';
import {BasketItemView} from './components/BasketItemView';
import {Page} from './components/Page';

import './scss/styles.scss';

// Система событий
const events = new EventEmitter();

// Модели
const productModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const formModel = new FormModel(events);

// Компоненты представления
const modal = Modal.getInstance('#modal-container');
const card = new Card(CDN_URL, events, colorsCategory);
const cardView = CardView.getInstance(events, CDN_URL, colorsCategory);
const basketView = BasketView.getInstance(events);
const basketItemView = new BasketItemView();
const orderView = OrderView.getInstance(events);
const contactsView = ContactsView.getInstance(events);
const successView = SuccessView.getInstance(events);

// Новое: внедряем компонент Page
const page = new Page(card);

// API-клиент
const api = new Api(API_URL);

// Загрузка товаров с сервера
api.get('/product').then((response: ApiListResponse<IProduct>) => {
    productModel.set(response.items || []);
}).catch(() => alert('Ошибка загрузки товаров.'));

// Отображение товаров
events.on('products:show', () => {
    const products = productModel.get();
    page.renderProducts(products);
});

// Открытие карточки товара
events.on('open-product-modal', (product: IProduct) => {
    const isInBasket = basketModel.hasItem(product.id);
    modal.content = cardView.render(product, basketModel.add.bind(basketModel), basketModel.remove.bind(basketModel), isInBasket);
    modal.open();
});

// Изменение корзины
events.on('basket:change', () => {
    const items = basketModel.items.map(product => basketItemView.create(product, basketModel.remove.bind(basketModel)));
    modal.content = basketView.render(items, basketModel.emptyMessage, basketModel.totalPrice);
    modal.open();
    basketView.updateBasketCounter(basketModel.totalItems);
});

// Открытие корзины
events.on('open-basket', () => {
    const items = basketModel.items.map(product => basketItemView.create(product, basketModel.remove.bind(basketModel)));
    modal.content = basketView.render(items, basketModel.emptyMessage, basketModel.totalPrice);
    modal.open();
    basketView.updateBasketCounter(basketModel.totalItems);
});

// Оформление заказа
events.on('open-order', () => {
    modal.content = orderView.render();
    modal.open();
    orderView.resetState();
    formModel.reset();
    formModel.isValidOrder();
});

// Адрес доставки
events.on('change:address', ({address}: {address: string}) => {
    formModel.setAddress(address);
    formModel.isValidOrder();
});

// Способ оплаты
events.on('change:paymentMethod', ({paymentMethod}: {paymentMethod: string}) => {
    formModel.setPaymentMethod(paymentMethod);
    formModel.isValidOrder();
});

// Страница контактов
events.on('open-contacts', () => {
    modal.content = contactsView.render();
    modal.open();
    contactsView.resetState();
    formModel.isValidContacts();
});

// E-mail
events.on('change:email', ({email}: {email: string}) => {
    formModel.setEmail(email);
    formModel.isValidContacts();
});

// Телефон
events.on('change:phone', ({phone}: {phone: string}) => {
    formModel.setPhone(phone);
    formModel.isValidContacts();
});

// Проверка формы заказа
events.on('form:valid-order', () => {
    orderView.toggleNextButton(true);
    orderView.hideError();
});

// Ошибка формы заказа
events.on('form:order-errors', () => {
    orderView.handleFormErrors(formModel.validationErrors);
    orderView.toggleNextButton(false);
});

// Проверка контактных данных
events.on('form:valid-contacts', () => {
    contactsView.toggleNextButton(true);
    contactsView.hideError('email');
    contactsView.hideError('phone');
});

// Ошибка контактных данных
events.on('form:contacts-errors', () => {
    contactsView.handleFormErrors(formModel.validationErrors);
    contactsView.toggleNextButton(false);
});

// Отправка заказа
events.on('open-success', async () => {
    const data = {
        id: Date.now(),
        items: basketModel.getSendableItems().map(item => item.id),
        total: basketModel.totalPrice,
        payment: formModel.getPaymentMethod(),
        address: formModel.getAddress(),
        email: formModel.getEmail(),
        phone: formModel.getPhone()
    };

    try {
        await api.post('/order', data); // Отправляем заказ на сервер
        
        basketModel.clearBasket();
        basketView.updateBasketCounter(basketModel.totalItems);
        formModel.reset();

        modal.content = successView.render(data.total);
        modal.open();
    } catch (err) {
        alert('Ошибка при отправке заказа. Попробуйте снова позже.');
    }
});

// Закрытие окна карточек
events.on('close-card-modal', () => modal.close());

// Закрытие окна успеха
events.on('close-success', () => modal.close());