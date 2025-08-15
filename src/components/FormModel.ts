// FormModel.ts

import { isRequired, ValidEmail, validatePhone } from '../utils/utils';

export type PaymentMethod = 'card' | 'cash';

export interface IFormState {
  address: string;
  paymentMethod: PaymentMethod | '';
  email: string;
  phone: string;
}

export class FormModel {
  private static instance: FormModel | null = null;
  private state: IFormState = {
    address: '',
    paymentMethod: '',
    email: '',
    phone: ''
  };

  private errors: Record<string, string> = {};
  private eventEmitter: any;

  private constructor(eventEmitter: any) {
    this.eventEmitter = eventEmitter;
  }

  public static getInstance(eventEmitter: any): FormModel {
    return FormModel.instance || (FormModel.instance = new FormModel(eventEmitter));
  }

  setAddress(value: string) {
    this.state.address = value;
    this.eventEmitter.emit('form:change-address', value);
  }

  setPaymentMethod(method: PaymentMethod) {
    this.state.paymentMethod = method;
    this.eventEmitter.emit('form:change-payment-method', method);
  }

  setEmail(value: string) {
    this.state.email = value;
    this.eventEmitter.emit('form:change-email', value);
  }

  setPhone(value: string) {
    this.state.phone = value;
    this.eventEmitter.emit('form:change-phone', value);
  }

  getState(): IFormState {
    return this.state;
  }

  reset() {
    this.state = { address: '', paymentMethod: '', email: '', phone: '' };
    this.clearErrors();
    this.eventEmitter.emit('form:reset');
  }

  validateOrderForm(): boolean {
    this.clearErrors();
    if (!isRequired(this.state.address)) this.errors.address = 'Адрес обязателен.';
    if (!this.state.paymentMethod) this.errors.paymentMethod = 'Выберите способ оплаты.';
    return Object.keys(this.errors).length === 0;
  }

  validateContactForm(): boolean {
    this.clearErrors();
    if (!ValidEmail(this.state.email)) this.errors.email = 'Некорректный e-mail адрес.';
    if (!validatePhone(this.state.phone)) this.errors.phone = 'Телефон введен неверно.';
    return Object.keys(this.errors).length === 0;
  }

  hasErrors(field?: string): boolean {
    return field ? !!this.errors[field] : Object.keys(this.errors).length > 0;
  }

  getErrorMessage(field: string): string | undefined {
    return this.errors[field];
  }

  clearErrors() {
    this.errors = {};
  }

  emitChange() {
    this.eventEmitter.emit('form:change', this.state);
  }

  on(callback: (state: IFormState) => void) {
    this.eventEmitter.on('form:change', callback);
  }

  clearValidationErrors() {
    this.clearErrors();
  }
}