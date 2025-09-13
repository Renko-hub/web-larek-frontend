// index.ts

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

import './scss/styles.scss';

// Система событий
const events = new EventEmitter();

// Модели
const productModel = new ProductsModel(events);
const basketModel = new BasketModel(events);
const formModel = new FormModel(events);

// Элементы отображения
const modal = Modal.getInstance('#modal-container');
const card = new Card(CDN_URL, events, colorsCategory);
const cardView = CardView.getInstance(events, CDN_URL, colorsCategory);
const basketView = BasketView.getInstance(events);
const orderView = OrderView.getInstance(events);
const contactsView = ContactsView.getInstance(events);
const successView = SuccessView.getInstance(events);

// API-клиент
const api = new Api(API_URL);

// Загружаем товары
api.get('/product')
    .then((response: ApiListResponse<IProduct>) => {
        productModel.set(response.items || []);
        card.renderProducts(productModel.get());
    })
    .catch(() => alert('Ошибка загрузки товаров.'));

// Открытие карточки товара
events.on('open-product-modal', (product: IProduct) => {
    const isInBasket = basketModel.hasItem(product.id);
    modal.content = cardView.render(product, basketModel.add.bind(basketModel), basketModel.remove.bind(basketModel), isInBasket);
    modal.open();
});

// Открытие корзины
events.on('open-basket', () => {
    modal.content = basketView.render(
        basketModel.items,
        basketModel.emptyMessage,
        basketModel.totalPrice,
        basketModel.remove.bind(basketModel)
    );
    modal.open();
});

// Добавление товара в корзину
events.on('add-to-basket', (product: IProduct) => {
    basketModel.add(product);
    basketView.updateBasketCounter(basketModel.totalItems);
    modal.close();
});

// Удаление товара из корзины
events.on('remove-from-basket', ({ pid }: { pid: string }) => {
    basketModel.remove(pid); 
    modal.content = basketView.render(                 
        basketModel.items,
        basketModel.emptyMessage,
        basketModel.totalPrice,
        basketModel.remove.bind(basketModel)
    );
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

// Форма доставки
events.on('change:address', ({address}: {address: string}) => {
    formModel.setAddress(address);
    formModel.isValidOrder();
});

// Способ оплаты
events.on('change:paymentMethod', ({paymentMethod}: {paymentMethod: string}) => {
    formModel.setPaymentMethod(paymentMethod);
    formModel.isValidOrder();
});

// Контакты
events.on('open-contacts', () => {
    modal.content = contactsView.render();
    modal.open();
    contactsView.resetState();
    formModel.isValidContacts();
});

// Email
events.on('change:email', ({email}: {email: string}) => {
    formModel.setEmail(email);
    formModel.isValidContacts();
});

// Телефон
events.on('change:phone', ({phone}: {phone: string}) => {
    formModel.setPhone(phone);
    formModel.isValidContacts();
});

// Валидность формы заказа
events.on('form:valid-order', () => {
    orderView.toggleNextButton(true);
    orderView.hideError();
});

// Ошибки формы заказа
events.on('form:order-errors', () => {
    orderView.handleFormErrors(formModel.validationErrors);
    orderView.toggleNextButton(false);
});

// Валидные контактные данные
events.on('form:valid-contacts', () => {
    contactsView.toggleNextButton(true);
    contactsView.hideError('email');
    contactsView.hideError('phone');
});

// Ошибки контактных данных
events.on('form:contacts-errors', () => {
    contactsView.handleFormErrors(formModel.validationErrors);
    contactsView.toggleNextButton(false);
});

// Завершение заказа
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
        // Отправляем заказ, игнорируя ответ сервера
        await api.post('/order', data);
    
        modal.content = successView.render(data.total);
        modal.open();
        basketModel.clearBasket();
        basketView.updateBasketCounter(basketModel.totalItems);
        formModel.reset();
    } catch (err) {
        alert('Ошибка при отправке заказа. Попробуйте снова позже.');
        console.error('Ошибка отправки заказа:', err.message);
    }
});

// Закрыть окно карточек
events.on('close-card-modal', () => modal.close());

// Закрыть окно успеха
events.on('close-success', () => modal.close());