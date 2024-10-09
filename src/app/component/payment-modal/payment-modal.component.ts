import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css']
})
export class PaymentModalComponent {

  amount: number = 0; // Default amount
  date: string = ''; // Date input
  recipient: string | null = null; // Selected recipient
  memberNames: any; // Example recipients
  showDropdown: boolean = false; // Control dropdown visibility
  groupName: string | null = null; // Variable for dynamic group name
  private paymentModalRef?: NgbModalRef; // Modal reference for payment modal

  constructor(private modalService: NgbModal, private reactiveModal: NgbActiveModal) { }

  // Method to show recipient dropdown
  showRecipientDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // Method to select a recipient
  selectRecipient(person: string) {
    this.recipient = person;
    this.showDropdown = false; // Close dropdown after selection
  }

  // Save payment and close both modals
  savePayment() {
    // Prepare payment data object for Razorpay process
    const paymentData = {
      recipient: this.recipient,
      amount: this.amount,
      date: this.date,
      groupName: this.groupName
    };

    // Log the data (for testing purposes)
    console.log('Payment data:', paymentData);

    // Close the "Settle up" modal first if it's open
    if (this.paymentModalRef) {
      this.paymentModalRef.close(); // Close the settle up modal
    }

    // Close the main modal and pass the paymentData to the parent component
    this.reactiveModal.close(paymentData);
  }

  // Open the modal for choosing the payment method
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

  // Open the modal for settling up (recording payment)
  openSettleUpModal(settleUpModal: any) {
    this.paymentModalRef = this.modalService.open(settleUpModal);
  }

  // Close the modal for payment method selection
  closePaymentModal() {
    this.reactiveModal.dismiss(); // Dismiss the modal
  }
}
