import { Component, Input, OnInit } from '@angular/core';
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
  @Input() group: any;
  @Input() allExpenseDataByGroupId: any;
  constructor(
    private dataService: DataService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  getMemberNameById(memberId: string) {
    const payer = this.allExpenseDataByGroupId[0].payersData.find((payer: any) => payer.memberId === memberId);
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


