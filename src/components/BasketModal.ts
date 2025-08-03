// BasketModal.ts

import { BaseModal } from './BaseModal';
import { CartModel } from './Model';
import { cloneTemplate, ensureElement, ensureAllElements } from '../utils/utils';
import { OrderModal } from './OrderModal';

export class BasketModal extends BaseModal {
  private static _instance: BasketModal | null = null; // Инстанс корзины (для паттерна Singleton)

  private constructor() {
    super('#modal-container'); // Родительский контейнер модального окна
  }

  // Статический метод для получения единственной копии корзины
  public static getInstance(): BasketModal {
    if (!BasketModal._instance) {
      BasketModal._instance = new BasketModal();
    }
    return BasketModal._instance;
  }

  // Отображает содержимое корзины в модальном окне
  showBasket(): void {
    const basketBlock = cloneTemplate('#basket'); // Копирует шаблон корзины
    this.replaceContent(basketBlock);            // Замещает контент модального окна шаблоном корзины

    // Необходимые селекторы элементов корзины
    const requiredSelectors = '.basket__list,.basket__price,.basket__button';
    ensureAllElements(requiredSelectors, this.content); // Проверка наличия нужных элементов

    // Основные элементы страницы корзины
    const listContainer = ensureElement('.basket__list', this.content)!;     // Контейнер списка товаров
    const totalPriceEl = ensureElement('.basket__price', this.content)!;     // Поле суммы корзины
    const checkoutButton = ensureElement('.basket__button', this.content) as HTMLButtonElement; // Кнопка перехода к оформлению заказа

    // Данные корзины
    const appData = CartModel.getInstance(); // Получаем объект корзины
    const cartItems = appData.cartItems;     // Товары в корзине

    // Заполняем корзину товарами
    for (let i = 0; i < cartItems.length; i++) {
      const basketItem = cloneTemplate('#card-basket'); // Шаблон карточки товара

      // Основные элементы карточки товара
      const indexElement = ensureElement('.basket__item-index', basketItem); // Номер товара
      const titleElement = ensureElement('.card__title', basketItem);        // Заголовок товара
      const priceElement = ensureElement('.card__price', basketItem);        // Цена товара
      const deleteBtn = ensureElement('.basket__item-delete', basketItem) as HTMLButtonElement; // Кнопка удаления товара

      // Заполнение полей карточек товаров
      indexElement.textContent = `${i + 1}`;              // Присвоение номера товара
      titleElement.textContent = `${cartItems[i].quantity} × ${cartItems[i].title}`; // Формирование названия товара с указанием количества

      // Задание цены товара
      if (typeof cartItems[i].price === 'number') {
        priceElement.textContent = `${cartItems[i].price * cartItems[i].quantity} синапсов`; // Рассчитываем итоговую цену
      } else {
        priceElement.textContent = 'Цена неизвестна'; // Выводится, если цена отсутствует
      }

      // Обработчик события клика на удаление товара
      deleteBtn.addEventListener('click', () => {
        appData.removeFromCart(cartItems[i]);    // Удаляем товар из корзины
        this.showBasket();                      // Перезагружаем представление корзины
      });

      listContainer.appendChild(basketItem); // Добавляем карточку товара в список
    }

    // Подсчет и вывод общей суммы корзины
    totalPriceEl.textContent = `${appData.totalPrice} синапсов`;

    // Управление кнопкой "Оформить заказ"
    checkoutButton.disabled = cartItems.length === 0; // Блокируем кнопку, если корзина пуста

    // Переход к экрану оформления заказа
    checkoutButton.addEventListener('click', () => {
      this.close();                  // Закрываем окно корзины
      OrderModal.getInstance().showOrder(); // Открываем форму заказа
    });

    this.open(); // Показываем модальное окно корзины
  }

  // Скрывает модальное окно корзины
  hideBasket(): void {
    this.close();
  }
}