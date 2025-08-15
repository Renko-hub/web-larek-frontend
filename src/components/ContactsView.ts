// ContactsView.ts

import { Modal } from './Modal';
import { FormModel } from './FormModel';
import { cloneTemplate, ensureElement } from '../utils/utils';

export class ContactsView {
    private static instance: ContactsView | null = null;
    private readonly model: FormModel;
    private readonly events: any;

    private constructor(events: any) {
        this.model = FormModel.getInstance(events);
        this.events = events;
        this.events.on('order:success', () => this.showContacts());
    }

    public static getInstance(events: any): ContactsView {
        return ContactsView.instance || (ContactsView.instance = new ContactsView(events));
    }

    showContacts() {
        this.model.clearValidationErrors();
        this.model.reset();

        const modalContent = cloneTemplate('#contacts')!;
        const modal = Modal.getInstance('#modal-container');
        modal.setContent(modalContent);
        modal.open();

        const emailInput = ensureElement('input[name="email"]', modal.getContent()) as HTMLInputElement;
        const phoneInput = ensureElement('input[name="phone"]', modal.getContent()) as HTMLInputElement;
        const submitBtn = ensureElement('button[type="submit"]', modal.getContent()) as HTMLButtonElement;
        const emailErrorSpan = ensureElement('.email-error', modal.getContent()) as HTMLElement;
        const phoneErrorSpan = ensureElement('.phone-error', modal.getContent()) as HTMLElement;

        this.updateSubmitButtonAndErrors(submitBtn, emailErrorSpan, phoneErrorSpan);

        emailInput.addEventListener('input', () => {
            this.model.setEmail(emailInput.value);
            this.updateSubmitButtonAndErrors(submitBtn, emailErrorSpan, phoneErrorSpan);
        });

        phoneInput.addEventListener('input', () => {
            this.model.setPhone(phoneInput.value);
            this.updateSubmitButtonAndErrors(submitBtn, emailErrorSpan, phoneErrorSpan);
        });

        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            if (this.model.validateContactForm()) {
                this.events.emit('contact:success');
            } else {
                this.updateSubmitButtonAndErrors(submitBtn, emailErrorSpan, phoneErrorSpan);
            }
        });
    }

    private updateSubmitButtonAndErrors(
        button: HTMLButtonElement,
        emailErrorSpan: HTMLElement,
        phoneErrorSpan: HTMLElement
    ) {
        const isValid = this.model.validateContactForm();
        button.disabled = !isValid;
        button.classList.toggle('button_submit-active', isValid);
        emailErrorSpan.textContent = this.model.getErrorMessage('email') || '';
        phoneErrorSpan.textContent = this.model.getErrorMessage('phone') || '';
    }
}