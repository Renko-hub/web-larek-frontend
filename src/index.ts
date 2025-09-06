// index.ts

import { Api, ApiListResponse } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { IProduct, ProductsModel } from './components/ProductModel';
import { EventEmitter } from './components/base/events';
import { CardView } from './components/CardView';
import { BasketView } from './components/BasketView';
import { OrderView } from './components/OrderView';
import { ContactsView } from './components/ContactsView';
import { SuccessView } from './components/SuccessView';
import { FormModel } from './components/FormModel';
import { BasketModel } from './components/BasketModel';
import { orderValidation, contactsValidation } from './components/Components';

import './scss/styles.scss';

// Система событий
const events = new EventEmitter();

// Модели
const productModel = new ProductsModel();
const basketModel = new BasketModel();
const formModel = new FormModel();

// Компоненты интерфейса
const cardComponent = new Card(CDN_URL);
const cardView = CardView.getInstance(events, cardComponent);
const basketView = BasketView.getInstance(events);
const orderView = OrderView.getInstance(events);
const contactsView = ContactsView.getInstance(events);
const successView = SuccessView.getInstance(events);

// Создание экземпляра API-клиента
const api = new Api(API_URL);

// Открыть корзину при событии
events.on('open-basket', () => basketView.openBasket());

// Добавить продукт в корзину при событии
events.on('add-to-basket', (product: IProduct) => {
    basketModel.add(product);
    basketView.updateBasketCounter();
});

// Удалить продукт из корзины при событии
events.on('remove-from-basket', (event: { productId: string }) => {
    basketModel.removeOne(event.productId);
    basketView.updateBasketCounter();
});

// Открыть форму заказа при событии
events.on('open-order', () => orderView.openOrder());

// Открыть контакты при событии
events.on('open-contacts', () => contactsView.openContacts());

// Обработать успешную покупку при событии
events.on('open-success', async () => {
    const orderData = {
        id: Date.now(),
        items: basketModel.getFilteredItems().map(item => item.id),
        total: basketModel.totalPrice,
        payment: formModel.getPaymentMethod(),
        address: formModel.getAddress(),
        email: formModel.getEmail(),
        phone: formModel.getPhone()
    };

    try {
        const res = await fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(orderData)
        });
        
        if (!res.ok) throw new Error(await res.text());

        successView.openSuccess();
        basketModel.clear();
        basketView.updateBasketCounter();
    } catch (err) {
        console.error('Ошибка отправки заказа:', err.message);
        alert('Ошибка при отправке заказа. Попробуйте снова позже.');
    }
});

// Получить данные корзины при запросе
events.on('request:basket-data', (callback: Function) => callback(basketModel.items));

// Получить количество товаров в корзине при запросе
events.on('request:basket-count', (callback: Function) => callback(basketModel.totalItems));

// Получить общую сумму корзины при запросе
events.on('request:basket-total-sum', (callback: Function) => callback(basketModel.totalPrice));

// Узнать, пуста ли корзина при запросе
events.on('request:basket-is-empty', (callback: Function) => callback(basketModel.isEmpty()));

// Установить адрес доставки при изменении поля
events.on('form-model:set-address', ({ newAddress }: { newAddress: string }) => {
    formModel.setAddress(newAddress);
    orderValidation(formModel, orderView);
});

// Установить способ оплаты при выборе
events.on('form-model:set-payment', ({ newPayment }: { newPayment: string }) => {
    formModel.setPaymentMethod(newPayment);
    orderValidation(formModel, orderView);
});

// Установить электронную почту при изменении поля
events.on('form-model:set-email', ({ newEmail }: { newEmail: string }) => {
    formModel.setEmail(newEmail);
    contactsValidation(formModel, contactsView);
});

// Установить номер телефона при изменении поля
events.on('form-model:set-phone', ({ newPhone }: { newPhone: string }) => {
    formModel.setPhone(newPhone);
    contactsValidation(formModel, contactsView);
});

// Загрузить товары с сервера
api.get('/product')
    .then((response: ApiListResponse<IProduct>) => {
        const productsArray = response.items || [];
        productModel.set(productsArray);
        events.emit('products:show');
    })
    .catch((err) => {
        console.error('Ошибка загрузки товаров:', err.message);
    });

// Показать товары на экране
events.on('products:show', () => {
    const galleryContainer = ensureElement('.gallery');
    if (!galleryContainer) return;

    galleryContainer.innerHTML = '';

    const currentProducts = productModel.get();
    for (const product of currentProducts) {
        const card = cardComponent.renderSimpleCard(product);
        galleryContainer.appendChild(card);

        card.addEventListener('click', () => cardView.openCard(product));
    }
});

// Старт приложения
window.onload = () => api.get('/product');