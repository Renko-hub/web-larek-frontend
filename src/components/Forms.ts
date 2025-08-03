// Forms.ts

import { isRequired, ValidEmail, validatePhone, ensureElement } from '../utils/utils';
import { resetErrors, displayError } from './Components';

// Поля главной формы заказа
type FormFields = {
  address: HTMLInputElement;             // Поле адреса
  onlineButton: HTMLButtonElement;      // Кнопка онлайн-платежа
  cashButton: HTMLButtonElement;        // Кнопка наличного платежа
  continueButton: HTMLButtonElement;    // Кнопка продолжить
  addressError: HTMLSpanElement;        // Сообщение об ошибке адреса
  paymentMethodError: HTMLSpanElement;  // Сообщение об ошибке выбора платежного метода
};

// Поля контактной формы
type ContactFormFields = {
  emailField: HTMLInputElement;         // Поле Email
  phoneField: HTMLInputElement;         // Поле телефона
  submitButton: HTMLButtonElement;      // Кнопка отправить
  emailError: HTMLSpanElement;          // Сообщение об ошибке Email
  phoneError: HTMLSpanElement;          // Сообщение об ошибке телефона
};

// Основная функция проверки формы заказа
export function validateForm(form: HTMLFormElement): boolean {
  const fields: FormFields = {
    address: ensureElement<HTMLInputElement>('[name=address]', form), // Адрес доставки
    onlineButton: ensureElement<HTMLButtonElement>('button[name="card"]', form), // Онлайн оплата
    cashButton: ensureElement<HTMLButtonElement>('button[name="cash"]', form), // Оплата наличными
    continueButton: ensureElement<HTMLButtonElement>('.order__button', form), // Кнопка продолжения
    addressError: ensureElement<HTMLSpanElement>('.address-error', form), // Сообщение об адресе
    paymentMethodError: ensureElement<HTMLSpanElement>('.payment-method-error', form), // Сообщение о платеже
  };

  resetErrors([fields.addressError, fields.paymentMethodError]); // Очищаем предыдущие ошибки

  let validAddress = isRequired(fields.address.value.trim()); // Проверка обязательного заполнения адреса
  if (!validAddress) {
    displayError(fields.addressError, 'Введите адрес доставки.'); // Отобразить ошибку
  }

  if (validAddress) {
    const paymentSelected =
      fields.onlineButton.classList.contains('button_alt-active') || // Онлайн выбран?
      fields.cashButton.classList.contains('button_alt-active');     // Или наличные?

    if (!paymentSelected) {
      displayError(fields.paymentMethodError, 'Выберите способ оплаты.'); // Нет выбранного способа
    }
  }

  fields.continueButton.disabled = fields.addressError.textContent !== '' || fields.paymentMethodError.textContent !== '';

  return fields.addressError.textContent === '' && fields.paymentMethodError.textContent === '';
}

// Функция проверки контактной формы
export function validateContactForm(form: HTMLFormElement): boolean {
  const fields: ContactFormFields = {
    emailField: ensureElement<HTMLInputElement>('[name=email]', form), // Поле Email
    phoneField: ensureElement<HTMLInputElement>('[name=phone]', form), // Поле телефона
    submitButton: ensureElement<HTMLButtonElement>('button[type=submit]', form), // Кнопка отправить
    emailError: ensureElement<HTMLSpanElement>('.email-error', form), // Сообщение об ошибке Email
    phoneError: ensureElement<HTMLSpanElement>('.phone-error', form), // Сообщение об ошибке телефона
  };

  resetErrors([fields.emailError, fields.phoneError]); // Очищаем старые ошибки

  const emailValid = ValidEmail(fields.emailField.value); // Проверка формата Email
  const phoneValid = validatePhone(fields.phoneField.value); // Проверка формата телефона

  if (!emailValid) {
    displayError(fields.emailError, 'Некорректный адрес электронной почты.'); // Сообщаем об ошибке
  }

  if (!phoneValid) {
    displayError(fields.phoneError, 'Неверный номер телефона.'); // Сообщаем об ошибке
  }

  fields.submitButton.disabled = !emailValid || !phoneValid; // Деактивируем кнопку, если есть ошибка

  return emailValid && phoneValid;
}