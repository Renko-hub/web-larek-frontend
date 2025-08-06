// Components.ts

import { validateForm } from './Forms';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from '../types/index';

// Флаги кнопок
enum ButtonActionType {
  Active = 'active',
  Inactive = 'inactive'
}

// Создание карточки продукта
export function createProductCard(item: IProduct, onRemoveClick: () => void): HTMLLIElement {
  const card = cloneTemplate('#card-basket')! as HTMLLIElement;

  const priceDisplay = (item.price > 0)
    ? `${item.price * (item.quantity || 1)} синапсов`
    : 'Бесплатно';

  ensureElement('.card__title', card).textContent = item.title;
  ensureElement('.card__price', card).textContent = priceDisplay;

  (ensureElement('.basket__item-delete', card) as HTMLButtonElement).onclick = onRemoveClick;

  return card;
}

// Настройка слушателей на форме заказа
export const setupListeners = (formData: any) => {
  formData.fields.address.addEventListener('input', (event: InputEvent) =>
    handleInputChange(event, validateForm, formData.form)
  );

  formData.buttons.cardButton.addEventListener('click', () =>
    handlePaymentClick(formData.buttons.cardButton, formData.buttons.cashButton, formData.form)
  );

  formData.buttons.cashButton.addEventListener('click', () =>
    handlePaymentClick(formData.buttons.cashButton, formData.buttons.cardButton, formData.form)
  );
};

// Обработка кликов по способам оплаты
function handlePaymentClick(activeBtn: HTMLButtonElement, inactiveBtn: HTMLButtonElement, form: HTMLFormElement) {
  toggleActiveButton(activeBtn, inactiveBtn); // Активируем выбранную кнопку
  validateForm(form);                         // Проверяем форму заново
}

// Изменение статуса кнопок платежей
function toggleActiveButton(activeBtn: HTMLButtonElement, inactiveBtn: HTMLButtonElement) {
  activeBtn.classList.toggle('button_alt-active', true);
  inactiveBtn.classList.toggle('button_alt-active', false);
}

// Общая обработка изменений полей формы
export function handleInputChange(event: Event, validator: (form: HTMLFormElement) => boolean, form: HTMLFormElement) {
  event.preventDefault();
  validator(form);
}

// Очистка ошибок формы
export function resetErrors(errors?: Array<HTMLElement>) {
  if (!errors) return;
  errors.forEach(err => {
    err.textContent = '';
    err.classList.add('hidden-error-message');
  });
}

// Публикация ошибки
export function displayError(errorElement: HTMLSpanElement, message: string) {
  errorElement.textContent = message;
  errorElement.classList.remove('hidden-error-message');
}