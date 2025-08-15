// Components.ts

import { FormModel } from './FormModel';

abstract class AbstractFormView {
  protected model: FormModel;
  protected eventEmitter: any;

  constructor(model: FormModel, eventEmitter: any) {
    this.model = model;
    this.eventEmitter = eventEmitter;
    this.subscribeToModelEvents();
  }

  subscribeToModelEvents() {
    this.model.on(() => this.handleFormChanges());
  }

  abstract handleFormChanges(): void;

  updateSubmitButtonActive(valid: boolean) {
    const button = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (button) {
      button.disabled = !valid;
      button.classList.toggle('button_submit-active', valid);
    }
  }

  updateError(span: HTMLElement, field: string) {
    span.textContent = this.model.getErrorMessage(field) ?? '';
  }

  updateErrorMessages() {}
}

export class OrderComponent extends AbstractFormView {
  handleFormChanges() {
    const isValid = this.model.validateOrderForm();
    this.updateSubmitButtonActive(isValid);
    this.updateErrorMessages();
  }

  submitHandler() {
    if (!this.model.validateOrderForm()) return;
    this.eventEmitter.emit('order:success');
  }

  updateErrorMessages() {
    const errorSpan = document.querySelector('.order-error') as HTMLElement | null;
    if (errorSpan) {
      const errMsg = this.model.getErrorMessage('address') || this.model.getErrorMessage('paymentMethod');
      errorSpan.textContent = errMsg || '';
    }
  }
}

export class ContactComponent extends AbstractFormView {
  handleFormChanges() {
    const isValid = this.model.validateContactForm();
    this.updateSubmitButtonActive(isValid);
    this.updateErrorMessages();
  }

  submitHandler() {
    if (!this.model.validateContactForm()) return;
    this.eventEmitter.emit('contact:success');
  }

  updateErrorMessages() {
    const emailErrSpan = document.querySelector('.email-error') as HTMLElement | null;
    const phoneErrSpan = document.querySelector('.phone-error') as HTMLElement | null;

    if (emailErrSpan) this.updateError(emailErrSpan, 'email');
    if (phoneErrSpan) this.updateError(phoneErrSpan, 'phone');
  }
}