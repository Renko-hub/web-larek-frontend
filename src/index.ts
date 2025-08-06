// index.ts

import './scss/styles.scss'; // Импортируем стили
import { EventEmitter } from './components/base/events'; // Диспетчер событий
import { BasketModel } from './components/BasketModel'; // Модель корзины
import { BasketView } from './components/BasketView'; // Представление корзины
import { SuccessView } from './components/SuccessView'; // Модальное окно успеха
import { loadCatalog } from './components/Page'; // Загрузка каталога товаров
import { OrderView } from './components/OrderView'; // Форма заказа
import { ContactsView } from './components/ContactsView'; // Окно контактной формы
import { CardView } from './components/CardView'; // Просмотр карточки товара
import { ensureElement } from './utils/utils'; // Утилита проверки элементов
import { IProduct } from './types/index'; // Интерфейс продукта
import { BasketController } from './components/BasketController'; // Контроллер корзины

// Создаем объект событий
const events = new EventEmitter();

// Создание синглтона модели корзины
const basketModel = BasketModel.getInstance(events);

// Создание синглтона представления корзины
const basketView = BasketView.getInstance(events);

// Другие компоненты
const successView = SuccessView.getInstance();
const orderView = OrderView.getInstance();
const contactsView = ContactsView.getInstance();
const cardView = CardView.getInstance(events);

// Создание контроллера корзины
const basketController = new BasketController(events);

// Объект обработчиков событий
const handlers = {
  basketAddHandler: (product: IProduct) => basketController.addToBasket(product),
  orderSuccessHandler: () => {
    const finalAmount = basketModel.basketTotalPrice;
    basketController.clearBasket();
    successView.showSuccess(finalAmount);
  },
  contactSuccessHandler: () => {
    const finalAmount = basketModel.basketTotalPrice;
    basketController.clearBasket();
    successView.showSuccess(finalAmount);
    basketView.refreshUI();
  },
  productOpenCardHandler: ({ productId }: { productId: string }) => {
    const product = basketModel.findProductById(productId);
    CardView.showProductCard(product!, events);
  }
};

// Подписки на события
events.on('basket:add', handlers.basketAddHandler);
events.on('order:success', handlers.orderSuccessHandler);
events.on('contact:success', handlers.contactSuccessHandler);
events.on('product:open-card', handlers.productOpenCardHandler);

// Обработчик открытия корзины
const headerBasketButton = ensureElement('.header__basket');
if (headerBasketButton) {
  headerBasketButton.addEventListener('click', () => basketView.showBasket());
} else {
  console.error("Элемента корзины '.header__basket' не найдено.");
}

// Инициализируем каталог при полной загрузке страницы
window.onload = async () => {
  await loadCatalog(events);
  successView.initialize(events);
  orderView.initialize(events);
  contactsView.initialize(events);
  cardView.initialize(events);
  basketView.initialize(events);
};

// Очистка зарегистрированных событий при закрытии страницы
function cleanUpEvents() {
  events.off('basket:add', handlers.basketAddHandler);
  events.off('order:success', handlers.orderSuccessHandler);
  events.off('contact:success', handlers.contactSuccessHandler);
  events.off('product:open-card', handlers.productOpenCardHandler);
}

// Регистрация очистки событий при выгрузке страницы
window.onbeforeunload = cleanUpEvents;