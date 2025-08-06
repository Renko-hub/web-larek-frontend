// Forms.ts

import { isRequired, ValidEmail, validatePhone, ensureElement } from '../utils/utils';
import { resetErrors, displayError } from './Components';

// Генерация объектов полей форм
const createFormFields = (form: HTMLFormElement, selectors: string[]): Record<string, HTMLElement> =>
  selectors.reduce((acc, sel) => ({ ...acc, [sel]: ensureElement(sel, form) }), {}) as Record<string, HTMLElement>;

// Главный валидатор формы заказа
export function validateForm(form: HTMLFormElement): boolean {
  const fields = createFormFields(form, ['[name=address]', 'button[name="card"]', 'button[name="cash"]', '.order__button', '.address-error', '.payment-method-error']) as Record<string, HTMLElement>;

  resetErrors([fields['.address-error'], fields['.payment-method-error']]);

  let validAddress = isRequired((fields['[name=address]'] as HTMLInputElement).value.trim());
  if (!validAddress) {
    displayError(fields['.address-error'], 'Введите адрес доставки.');
  }

  if (validAddress) {
    const paymentSelected =
      ((fields['button[name="card"]'] as HTMLButtonElement).classList.contains('button_alt-active')) ||
      ((fields['button[name="cash"]'] as HTMLButtonElement).classList.contains('button_alt-active'));

    if (!paymentSelected) {
      displayError(fields['.payment-method-error'], 'Выберите способ оплаты.');
    }
  }

  (fields['.order__button'] as HTMLButtonElement).disabled = !!fields['.address-error'].textContent || !!fields['.payment-method-error'].textContent;

  return fields['.address-error'].textContent === '' && fields['.payment-method-error'].textContent === '';
}

// Валидатор контактной формы
export function validateContactForm(form: HTMLFormElement): boolean {
  const fields = createFormFields(form, ['[name=email]', '[name=phone]', 'button[type=submit]', '.email-error', '.phone-error']) as Record<string, HTMLElement>;

  resetErrors([fields['.email-error'], fields['.phone-error']]);

  const emailValid = ValidEmail((fields['[name=email]'] as HTMLInputElement).value);
  const phoneValid = validatePhone((fields['[name=phone]'] as HTMLInputElement).value);

  if (!emailValid) {
    displayError(fields['.email-error'], 'Некорректный адрес электронной почты.');
  }

  if (!phoneValid) {
    displayError(fields['.phone-error'], 'Неверный номер телефона.');
  }

  (fields['button[type=submit]'] as HTMLButtonElement).disabled = !emailValid || !phoneValid;

  return emailValid && phoneValid;
}