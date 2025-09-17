// Presenter.ts

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

// Компоненты представлений
const modal = Modal.getInstance('#modal-container');
const cardView = CardView.getInstance(events, CDN_URL, colorsCategory);
const basketView = BasketView.getInstance(events);
const basketItemView = new BasketItemView(events); // Создаем экземпляр сразу здесь
const orderView = OrderView.getInstance(events);
const contactsView = ContactsView.getInstance(events);
const successView = SuccessView.getInstance(events);

// Контроллер
const pageController = new Page(events);

// API клиент
const api = new Api(API_URL);

// Обработчики событий

// Обработчик создания карточки продукта
events.on('create-product-card', (product: IProduct) => {
    const card = new Card(CDN_URL, events, colorsCategory);
    const cardElement = card.render(product); // Прямо создаём элемент карточки продукта
    events.emit('add-product-to-gallery', cardElement);
});

// Теперь только тут вызываем метод контроллера страницы
events.on('add-product-to-gallery', (cardElement: HTMLElement) => {
    pageController.addProductToGallery(cardElement); // Здесь оставляем прямой вызов метода контроллера
});

// Обработчик показа всех продуктов
events.on('products:show', () => {
    const products = productModel.get(); // Получаем список продуктов из модели
    products.forEach((product) => {
        const card = new Card(CDN_URL, events, colorsCategory);
        const cardElement = card.render(product); // Рендерим каждую карточку отдельно
        events.emit('add-product-to-gallery', cardElement);
    });
});

// Открытие модального окна продукта
events.on('open-product-modal', (product: IProduct) => {
    const isInBasket = basketModel.hasItem(product.id);
    modal.content = cardView.render(product, basketModel.add.bind(basketModel), basketModel.remove.bind(basketModel), isInBasket);
    modal.open();
});

// Обработчик установки элементов корзины
events.on('set-basket-items', (items: HTMLElement[]) => {
    basketView.setBasketItems(items); // Напрямую обновляем содержимое корзины через представление
});

// Обработчик изменения корзины
events.on('basket:change', () => {
    const items = basketModel.items.map(product => basketItemView.create(product, basketModel.remove.bind(basketModel)));
    basketView.setBasketItems(items); // Устанавливаем новые элементы корзины через представление
    modal.content = basketView.render(items, basketModel.emptyMessage, basketModel.totalPrice);
    modal.open();
    basketView.updateBasketCounter(basketModel.totalItems);
});

// Обработчик открытия корзины
events.on('open-basket', () => {
    const items = basketModel.items.map(product => basketItemView.create(product, basketModel.remove.bind(basketModel)));
    basketView.setBasketItems(items); // Передаём новый список элементов представлению корзины
    modal.content = basketView.render(items, basketModel.emptyMessage, basketModel.totalPrice);
    modal.open();
});

// Открытие страницы оформления заказа
events.on('open-order', () => {
    modal.content = orderView.render();
    modal.open();
    orderView.resetState();
    formModel.reset();
    formModel.isValidOrder();
});

// Изменение адреса доставки
events.on('change:address', ({address}: {address: string}) => {
    formModel.setAddress(address);
    formModel.isValidOrder();
});

// Выбор способа оплаты
events.on('change:paymentMethod', ({paymentMethod}: {paymentMethod: string}) => {
    formModel.setPaymentMethod(paymentMethod);
    formModel.isValidOrder();
});

// Открытие страницы контактов
events.on('open-contacts', () => {
    modal.content = contactsView.render();
    modal.open();
    contactsView.resetState();
    formModel.isValidContacts();
});

// Изменение e-mail
events.on('change:email', ({email}: {email: string}) => {
    formModel.setEmail(email);
    formModel.isValidContacts();
});

// Изменение телефона
events.on('change:phone', ({phone}: {phone: string}) => {
    formModel.setPhone(phone);
    formModel.isValidContacts();
});

// Действия при успешной проверке формы заказа
events.on('form:valid-order', () => {
    orderView.toggleNextButton(true);
    orderView.hideError();
});

// Действия при ошибке проверки формы заказа
events.on('form:order-errors', () => {
    orderView.handleFormErrors(formModel.validationErrors);
    orderView.toggleNextButton(false);
});

// Действия при успешной проверке контактных данных
events.on('form:valid-contacts', () => {
    contactsView.toggleNextButton(true);
    contactsView.hideError('email');
    contactsView.hideError('phone');
});

// Действия при ошибке проверки контактных данных
events.on('form:contacts-errors', () => {
    contactsView.handleFormErrors(formModel.validationErrors);
    contactsView.toggleNextButton(false);
});

// Завершение отправки заказа
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
        await api.post('/order', data);
        basketModel.clearBasket();
        basketView.updateBasketCounter(basketModel.totalItems);
        formModel.reset();
        modal.content = successView.render(data.total);
        modal.open();
    } catch (err) {
        alert('Ошибка при отправке заказа. Попробуйте снова позже.');
    }
});

// Закрытие модальных окон
events.on('close-card-modal', () => modal.close());
events.on('close-success', () => modal.close());

// Загрузка товаров с сервера
api.get('/product')
    .then((response: ApiListResponse<IProduct>) => {
        productModel.set(response.items || []);
    })
    .catch(() => alert('Ошибка загрузки товаров.'));