https://github.com/Renko-hub/web-larek-frontend

- # Проектная работа "Веб-ларек"
-
- Стек: HTML, SCSS, TS, Webpack
-
- ### Установка и запуск
-
- Для установки и запуска проекта выполните следующие команды:
-
- ```bash

  ```

- npm install
- npm run start
- ```

  ```

-
- Или используйте Yarn:
-
- ```bash

  ```

- yarn
- yarn start
- ```

  ```

-
- ### Сборка
-
- Выполните команду сборки:
-
- ```bash

  ```

- npm run build
- ```

  ```

-
- Или с помощью Yarn:
-
- ```bash

  ```

- yarn build
- ```

  ```

-
- ***
-

 * ### Описание проекта
 *
 * Проект представляет собой веб-приложение интернет-магазина, построенное на современном стеке технологий с использованием классов и методов ES6+.
 *
 * #### Цель
 *
 * Предоставление пользователям функционала для просмотра товаров, добавления их в корзину, оформления заказов и получения уведомлений о результатах покупок.
 *
 * ##### Основные возможности:
 *
 * - Просмотр каталога товаров.
 * - Добавление товаров в корзину.
 * - Оформление заказов с выбором способа оплаты.
 * - Отправка контактных данных.
 * - Оповещение пользователей о завершении процесса покупки.
 *
 * #### Примечания
 *
 * Активно применяются следующие утилиты:
 *
 * - `cloneTemplate`: Копирует шаблон элемента для повторного использования.
 * - `ensureElement`: Проверяет существование нужного элемента в DOM и создаёт его, если элемент отсутствует.
 * - `ensureAllElements`: Применяется для массовой проверки наличия нескольких элементов одновременно.
 *
 * ---
 *
 * #### Архитектура проекта
 *
 * Архитектура построена на основе популярного подхода **Model–View–Controller (MVC)**:
 *
 * - **Model (Модель)**:
 *   - Содержит бизнес-логику и данные (например, модель корзины `BasketModel`).
 *   - Хранит коллекцию товаров, их характеристики и поддерживает расчёт суммы и количества.
 *
 * - **View (Вид)**:
 *   - Отвечает за отображение данных пользователю (например, виды карточек товаров, форма оформления заказа, страница успешной покупки).
 *   - Реализует принцип реактивности, автоматически обновляя интерфейс при изменениях данных.
 *
 * - **Controller (Контроллер)**:
 *   - Координатор взаимодействия между `View` и `Model`.
 *   - Обрабатывает события от пользователя, такие как добавление товаров в корзину, удаление товаров, подтверждение заказа и прочие операции. Роль контроллера берёт на себя 'index.ts' так как приложение небольшое.
 *
 * Данная архитектура упрощает разработку и тестирование приложения, делает код легко поддерживаемым и расширяемым.
 *
 * ---
 *
 * #### Новые функции валидации в файле `utils.js`
 *
 * В файл `utils.js` были добавлены три новые функции для улучшения валидации:
 *
 * - `isRequired(fieldValue)` — проверка наличия значения в указанном поле формы.
 * - `ValidEmail(email)` — проверка корректности формата электронного адреса.
 * - `validatePhone(phoneNumber)` — проверка правильности формата телефонного номера.
 *
 * Эти функции повышают надежность валидации и снижают риск появления некорректных данных.
 *
 * ---
 *
 * #### Внесённые изменения в HTML и CSS
 *
 * - **Рефакторинг HTML-шаблонов:** Проведены оптимизация и удаление лишней разметки, повысилась читаемость и производительность.
 * - **Обновления в `modal.scss`:** Улучшилась структура оверлея, обеспечивающая правильное отображение модальных окон.
 *
 * ---
 *
/**
 * @fileoverview Общий файл документации проекта
 */

/**
 * @module Modal
 * Класс управления модальным окном. Используется для открытия и закрытия окон с товарами, корзиной, формой заказа и сообщением об успехе операции.
 */
class Modal {
    /**
     * Получение единственного экземпляра модального окна.
     * @param {string} containerId ID контейнера модального окна.
     * @return {Modal} Экземпляр модального окна.
     */
    static getInstance(containerId) {}

    /**
     * Установить контент модального окна.
     * @param {HTMLElement|null} value Содержимое модального окна.
     */
    set content(value) {}

    /**
     * Открыть модальное окно.
     */
    open() {}

    /**
     * Закрыть модальное окно.
     */
    close() {}

    /**
     * Обработчик события нажатия клавиши Esc для закрытия модального окна.
     * @param {KeyboardEvent} event Событие клавиатуры.
     */
    handleKeyDown(event) {}

    /**
     * Обработчик события клика мыши для закрытия модального окна.
     * @param {MouseEvent} event Событие мыши.
     */
    handleMouseDown(event) {}
}

/**
 * @module Card
 * Класс для рендеринга карточек товаров на главной странице каталога.
 */
class Card {
    /**
     * Создать компонент карты товаров.
     * @param {string} cdnUrl URL облачного хранилища картинок.
     * @param {*} events Событийный диспетчер.
     * @param {Record<string,string>} colorsCategory Палитра цветов для категории товаров.
     */
    constructor(cdnUrl, events, colorsCategory) {}

    /**
     * Рендеринг набора товаров на странице.
     * @param {IProduct|IProduct[]} products Массив объектов товаров.
     */
    renderProducts(products) {}

    /**
     * Генерация карточки товара.
     * @param {string} cdnUrl URL облачного хранилища картинок.
     * @param {IProduct} product Данные товара.
     * @param {*} events Событийный диспетчер.
     * @param {Record<string,string>} colorsCategory Палитра цветов для категории товаров.
     * @return {HTMLElement} Карточка товара.
     */
    static renderProductCard(cdnUrl, product, events, colorsCategory) {}

    /**
     * Наполнение элементов карточки информацией о товаре.
     * @param {HTMLElement} element DOM-элемент карточки.
     * @param {Partial<IProduct>} product Данные товара.
     * @param {string} cdnUrl URL облачного хранилища картинок.
     * @param {Record<string,string>} colorsCategory Палитра цветов для категории товаров.
     * @param {{skipCategory:boolean, skipImage:boolean}} opts Опции пропуска категорий и изображений.
     */
    static fillProductCard(element, product, cdnUrl, colorsCategory, opts={}) {}
}

/**
 * @module CardView
 * Класс для формирования детальной карточки товара в модальном окне.
 */
class CardView {
    /**
     * Получить единый экземпляр компонента CardView.
     * @param {*} events Событийный диспетчер.
     * @param {string} cdnUrl URL облачного хранилища картинок.
     * @param {Record<string,string>} colorsCategory Палитра цветов для категории товаров.
     * @return {CardView} Экземпляр CardView.
     */
    static getInstance(events, cdnUrl, colorsCategory) {}

    /**
     * Формирование содержимого модального окна с детальностью конкретного товара.
     * @param {IProduct} product Информация о товаре.
     * @param {(p:IProduct)=>void} onAddToBasket Функция добавления товара в корзину.
     * @param {(id:string)=>void} onRemoveFromBasket Функция удаления товара из корзины.
     * @param {boolean} isInBasket Признак наличия товара в корзине.
     * @return {HTMLElement} Карточка товара.
     */
    show(product, onAddToBasket, onRemoveFromBasket, isInBasket) {}

    /**
     * Генерация базовой карточки товара без привязанных событий.
     * @param {IProduct} product Информация о товаре.
     * @return {HTMLElement} Карточка товара.
     */
    createBaseCardWithoutEvents(product) {}
}

/**
 * @module BasketView
 * Класс для визуализации состояния корзины покупок.
 */
class BasketView {
    /**
     * Получить единый экземпляр компонента BasketView.
     * @param {*} events Событийный диспетчер.
     * @return {BasketView} Экземпляр BasketView.
     */
    static getInstance(events) {}

    /**
     * Отображение текущего состояния корзины.
     * @param {IBasketItem[]} basketProducts Товары в корзине.
     * @param {string} emptyMessage Сообщение при пустой корзине.
     * @param {number} totalPrice Итоговая стоимость корзины.
     * @param {(id:string)=>void} removeFromBasket Функция удаления товара из корзины.
     * @return {HTMLElement} DOM-элемент корзины.
     */
    show(basketProducts, emptyMessage, totalPrice, removeFromBasket) {}

    /**
     * Обновление счетчика товаров в корзине.
     * @param {number} count Текущее количество товаров.
     */
    updateBasketCounter(count) {}

    /**
     * Рендеринг товара в списке корзины.
     * @private
     * @param {IBasketItem} product Информация о товаре.
     * @param {HTMLElement} list Элемент списка корзины.
     * @param {number} index Индекс элемента в списке.
     * @param {(id:string)=>void} removeFromBasket Функция удаления товара из корзины.
     */
    renderProduct(product, list, index, removeFromBasket) {}
}

/**
 * @module OrderView
 * Класс для визуализации формы заказа.
 */
class OrderView {
    /**
     * Получить единый экземпляр компонента OrderView.
     * @param {*} events Событийный диспетчер.
     * @return {OrderView} Экземпляр OrderView.
     */
    static getInstance(events) {}

    /**
     * Формирование страницы формы заказа.
     * @return {HTMLElement} DOM-элемент формы заказа.
     */
    show() {}

    /**
     * Обработка ошибок формы заказа.
     * @param {Record<string,string>} errors Объект с ошибками.
     */
    handleFormErrors(errors) {}

    /**
     * Переключение доступности кнопки продолжения оформления заказа.
     * @param {boolean} enabled Доступность кнопки.
     */
    toggleNextButton(enabled) {}

    /**
     * Показ ошибки заполнения формы.
     * @param {string} message Текст ошибки.
     */
    showError(message) {}

    /**
     * Скрытие ошибки заполнения формы.
     */
    hideError() {}
}

/**
 * @module ContactsView
 * Класс для визуализации формы контактных данных заказчика.
 */
class ContactsView {
    /**
     * Получить единый экземпляр компонента ContactsView.
     * @param {*} events Событийный диспетчер.
     * @return {ContactsView} Экземпляр ContactsView.
     */
    static getInstance(events) {}

    /**
     * Формирование страницы формы контактных данных.
     * @return {HTMLElement} DOM-элемент формы контактных данных.
     */
    show() {}

    /**
     * Обработка ошибок формы контактных данных.
     * @param {Record<'email'|'phone',string>} errors Объект с ошибками.
     */
    handleFormErrors(errors) {}

    /**
     * Переключение доступности кнопки завершения оформления заказа.
     * @param {boolean} enabled Доступность кнопки.
     */
    toggleNextButton(enabled) {}

    /**
     * Показ ошибки поля контактных данных.
     * @param {'email'|'phone'} field Имя поля.
     * @param {string} message Текст ошибки.
     */
    showError(field, message) {}

    /**
     * Скрытие ошибки поля контактных данных.
     * @param {'email'|'phone'} field Имя поля.
     */
    hideError(field) {}
}

/**
 * @module SuccessView
 * Класс для отображения результата успешно выполненной операции.
 */
class SuccessView {
    /**
     * Получить единый экземпляр компонента SuccessView.
     * @param {*} events Событийный диспетчер.
     * @return {SuccessView} Экземпляр SuccessView.
     */
    static getInstance(events) {}

    /**
     * Формирование страницы подтверждения успешности заказа.
     * @param {number} totalSum Сумма платежа.
     * @return {HTMLElement} DOM-элемент страницы подтверждения.
     */
    show(totalSum) {}
}