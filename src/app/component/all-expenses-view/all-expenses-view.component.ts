import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/shared/data.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

@Component({
  selector: 'app-all-expenses-view',
  templateUrl: './all-expenses-view.component.html',
  styleUrls: ['./all-expenses-view.component.css']
})
export class AllExpensesViewComponent implements OnInit {


  @Input() ExpenseData: any;
  @Input() friend: any;
  @Input() selectedGroup: any;
  @Input() allGroup: any;
  calculatedBalances: any;
  calculateData: any;
  totalOwes:any;
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
      this.totalOwes = 0;

      // Calculate total paid and total owes
      Object.keys(balances).forEach((otherMemberId: string) => {
        if (balances[otherMemberId] > 0) {
          totalPaid += balances[otherMemberId]; // The member is owed this amount
        } else {
        this.totalOwes -= balances[otherMemberId]; // The member owes this amount
        }
      });

      const netBalance = totalPaid - this.totalOwes;

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

      return `${memberData.memberName} paid INR ${paymentAmount} and ${balanceText}`;
    }
    return 'Member not found';
  }




  getMemberNameById(memberId: string) {
    const payer = this.ExpenseData[0].payersData.find((payer: any) => payer.memberId === memberId);
    return payer ? payer.memberName : 'Unknown Member';
  }


  getPayerDetails(expense: any): string {
    const payers = expense.payersData;

    if (payers.length === 1) {
      return `${payers[0].memberName} paid`;
    } else if (payers.length > 1) {
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
          this.deleteExpense(expenseId);
        }
      },
      (reason: any) => {
        console.log(`Dismissed: ${reason}`);
      }
    );
  }


  deleteExpense(expenseId: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this expense?');

    if (confirmDelete) {
      this.dataService.deleteExpenseById(expenseId).subscribe({
        next: () => {
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
    const modalRef = this.modalService.open(AddExpenseModalComponent);
    modalRef.componentInstance.expenseId = expenseId;
  }

  openExpensesModal() {
    const modalRef = this.modalService.open(AddExpenseModalComponent, { size: 'lg' });

    if (this.selectedGroup) {
      console.log('this.selectedGroup+++++++', this.selectedGroup);
      modalRef.componentInstance.selectedGroup = this.selectedGroup;
    }

    modalRef.result.then(
      (expense: any) => {
        if (expense) {
          // this.expenses.push(expense);
          // console.log('Expense added:', this.expenses);
        }
      },
      (dismissed) => {
        console.log('Modal dismissed');
      }
    );
  }

}



