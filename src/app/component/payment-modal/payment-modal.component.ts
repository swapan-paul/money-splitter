import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent {

  amount: number = 0;
  date: string = '';
  recipient: string | null = null;
  memberNames: any;
  showDropdown: boolean = false;
  groupName: string | null = null;
  private paymentModalRef?: NgbModalRef;

  constructor(private modalService: NgbModal, private reactiveModal: NgbActiveModal) { }

  showRecipientDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectRecipient(person: string) {
    this.recipient = person;
    this.showDropdown = false;
  }

  savePayment() {
    const paymentData = {
      recipient: this.recipient,
      amount: this.amount,
      date: this.date,
      groupName: this.groupName
    };

    console.log('<<<<<<<<<<<Payment data:>>>>>>>>>>', paymentData);

    if (this.paymentModalRef) {
      this.paymentModalRef.close();
    }

    this.reactiveModal.close(paymentData);
  }

  openPaymentMethodModal(content: any) {
    this.modalService.open(content).result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
      },
      (reason) => {
        console.log(`Dismissed with: ${reason}`);
      }
    );
  }

  openSettleUpModal(settleUpModal: any) {
    this.paymentModalRef = this.modalService.open(settleUpModal);
  }

  closePaymentModal() {
    this.reactiveModal.dismiss();
  }
}
