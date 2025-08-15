// OrderView.ts

import { Modal } from './Modal';
import { FormModel, PaymentMethod } from './FormModel';
import { cloneTemplate, ensureElement } from '../utils/utils';

export class OrderView {
    private static instance: OrderView | null = null;
    private readonly model: FormModel;
    private readonly events: any;

    private constructor(events: any) {
        this.model = FormModel.getInstance(events);
        this.events = events;
        this.events.on('order:start', () => this.showOrder());
    }

    public static getInstance(events: any): OrderView {
        return OrderView.instance || (OrderView.instance = new OrderView(events));
    }

    showOrder() {
        this.model.clearValidationErrors();
        this.model.reset();

        const modalContent = cloneTemplate('#order')!;
        const modal = Modal.getInstance('#modal-container');
        modal.setContent(modalContent);
        modal.open();

        const addressInput = ensureElement('input[name="address"]', modal.getContent()) as HTMLInputElement;
        const cardButton = ensureElement('button[name="card"]', modal.getContent()) as HTMLButtonElement;
        const cashButton = ensureElement('button[name="cash"]', modal.getContent()) as HTMLButtonElement;
        const submitBtn = ensureElement('.order__button', modal.getContent()) as HTMLButtonElement;
        const errorSpan = ensureElement('.order-error', modal.getContent()) as HTMLElement;

        this.updateSubmitButtonAndErrors(submitBtn, errorSpan);

        addressInput.addEventListener('input', () => {
            this.model.setAddress(addressInput.value);
            this.updateSubmitButtonAndErrors(submitBtn, errorSpan);
        });

        [cardButton, cashButton].forEach((btn) => {
            btn.addEventListener('click', () => {
                this.model.setPaymentMethod(btn.name as PaymentMethod);
                cardButton.classList.toggle('button_alt-active', btn === cardButton);
                cashButton.classList.toggle('button_alt-active', btn === cashButton);
                this.updateSubmitButtonAndErrors(submitBtn, errorSpan);
            });
        });

        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (this.model.validateOrderForm()) {
                this.events.emit('order:success');
            } else {
                this.updateSubmitButtonAndErrors(submitBtn, errorSpan);
            }
        });
    }

    private updateSubmitButtonAndErrors(button: HTMLButtonElement, errorSpan: HTMLElement) {
        const isValid = this.model.validateOrderForm();
        button.disabled = !isValid;
        button.classList.toggle('button_submit-active', isValid);
        errorSpan.textContent = this.model.getErrorMessage('address') ||
                                this.model.getErrorMessage('paymentMethod') ||
                                '';
    }
}