import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/shared/data.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.css']
})
export class GroupViewComponent implements OnInit {
  // @Input() group: any;
  @Input() ExpenseData: any;
  // @Input() balanceData: any;
  calculatedBalances: any;
  calculateData: any;
  constructor(
    private dataService: DataService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  getMemberIds(calculatedBalances: any): string[] {
    if (calculatedBalances && typeof calculatedBalances === 'object') {
      return Object.keys(calculatedBalances);
    }
    return []; // Return an empty array if calculatedBalances is not valid
  }

  getMemberName(memberId: string, calculatedBalances: any): string {
    if (calculatedBalances && calculatedBalances[memberId]) {
      return calculatedBalances[memberId].memberName || 'Unknown Member';
    }
    return 'Unknown Member'; // Default value if not found
  }



  getBalanceText(memberId: string, calculatedBalances: any, paymentDetails: any): string {

    if (calculatedBalances && calculatedBalances[memberId]) {
      const memberData = calculatedBalances[memberId];
      const balances = memberData.balance || {};
      let totalPaid = 0;
      let totalOwes = 0;

      // Calculate total paid and total owes
      Object.keys(balances).forEach((otherMemberId: string) => {
        if (balances[otherMemberId] > 0) {
          totalPaid += balances[otherMemberId]; // The member is owed this amount
        } else {
          totalOwes -= balances[otherMemberId]; // The member owes this amount
        }
      });

      // Calculate net balance
      const netBalance = totalPaid - totalOwes;

      // Get the payment amount for the member from the paymentDetails array
      const paymentDetail = paymentDetails.find((detail: any) => detail.memberId === memberId);
      const paymentAmount = paymentDetail ? paymentDetail.amount : 0;

      let balanceText = '';

      if (netBalance > 0) {
        balanceText = `lent INR ${netBalance.toFixed(2)}`;
      } else if (netBalance < 0) {
        balanceText = `owes INR ${Math.abs(netBalance).toFixed(2)}`;
      } else {
        balanceText = `has no balance`;
      }

      // Format the output string
      return `${memberData.memberName} paid INR ${paymentAmount} and ${balanceText}`;
    }
    return 'Member not found'; // Return a fallback if member data is invalid
  }




  getMemberNameById(memberId: string) {
    const payer = this.ExpenseData[0].payersData.find((payer: any) => payer.memberId === memberId);
    return payer ? payer.memberName : 'Unknown Member';
  }


  getPayerDetails(expense: any): string {
    const payers = expense.payersData;

    if (payers.length === 1) {
      // If only one person paid, show their name
      return `${payers[0].memberName} paid`;
    } else if (payers.length > 1) {
      // If more than one person paid, show the number of people who paid
      return `${payers.length} people paid`;
    } else {
      return 'you paid';
    }
  }


  openDeleteConfirmation(expenseId: string) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.result.then(
      (result: any) => {
        if (result) {
          this.deleteExpense(expenseId); // Call delete function if confirmed
        }
      },
      (reason: any) => {
        console.log(`Dismissed: ${reason}`); // Handle dismiss action
      }
    );
  }


  deleteExpense(expenseId: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this expense?');

    if (confirmDelete) {
      this.dataService.deleteExpenseById(expenseId).subscribe({
        next: () => {
          // this.loadExpenses(); // Refresh the list of expenses
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
        }
      });
    } else {
      console.log('Delete operation canceled');
    }
  }

  openEditModal(expenseId: string) {
    const modalRef = this.modalService.open(AddExpenseModalComponent); // Open your edit modal
    modalRef.componentInstance.expenseId = expenseId; // Pass the expenseId to the modal
  }

}


