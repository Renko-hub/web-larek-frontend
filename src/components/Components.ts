// Components.ts

import { validateForm, validateContactForm } from './Forms';

// Возможные состояния активности кнопки
enum ButtonActionType {
  Active = 'active',     // Активное состояние
  Inactive = 'inactive', // Неактивное состояние
}

// Переключение активной кнопки
export function toggleActiveButton(
  activeBtn: HTMLButtonElement,    // Текущая активная кнопка
  inactiveBtn: HTMLButtonElement,  // Другая неактивная кнопка
  action: ButtonActionType = ButtonActionType.Active // Действие по умолчанию активация
): void {
  switch (action) {
    case ButtonActionType.Active:
      activeBtn.classList.add('button_alt-active'); // Включаем класс активности
      break;
    case ButtonActionType.Inactive:
      activeBtn.classList.remove('button_alt-active'); // Убираем класс активности
      break;
  }

  inactiveBtn.classList.toggle('button_alt-active', false); // Дезактивируем вторую кнопку
}

// Обработчик изменения поля адреса (форма заказа)
export function handleAddressInput(event: Event, form: HTMLFormElement): void {
  event.preventDefault(); // Предотвращаем стандартное поведение браузера
  validateForm(form);     // Валидация формы
}

// Обработчик выбора метода оплаты (форма заказа)
export function handlePaymentClick(
  clickedButton: HTMLButtonElement, // Нажатая кнопка
  otherButton: HTMLButtonElement,   // Альтернативная кнопка
  form: HTMLFormElement            // Форма заказа
): void {
  toggleActiveButton(clickedButton, otherButton); // Переключаем активность кнопок
  validateForm(form);                             // Повторно проверяем форму
}

// Обработчик изменения поля Email (контактная форма)
export function handleEmailInput(event: Event, form: HTMLFormElement): void {
  event.preventDefault(); // Предотвращение стандартного поведения
  validateContactForm(form); // Проверка контактной формы
}

// Обработчик изменения поля телефона (контактная форма)
export function handlePhoneInput(event: Event, form: HTMLFormElement): void {
  event.preventDefault(); // Предотвращение стандартного поведения
  validateContactForm(form); // Проверка контактной формы
}

// Очистка сообщений об ошибках
export function resetErrors(errors?: Array<HTMLElement>): void {
  if (errors) {
    for (const err of errors) {
      err.textContent = '';                   // Очищаем сообщение об ошибке
      err.classList.add('hidden-error-message'); // Прячем блок ошибки
    }
  }
}

// Отображение ошибки
export function displayError(errorElement: HTMLSpanElement, message: string): void {
  errorElement.textContent = message;              // Вставляем текст ошибки
  errorElement.classList.remove('hidden-error-message'); // Показываем ошибку
}