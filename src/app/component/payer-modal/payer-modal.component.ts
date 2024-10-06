// import { Component, Input, OnInit } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// @Component({
//   selector: 'app-payer-modal',
//   templateUrl: './payer-modal.component.html',
//   styleUrls: ['./payer-modal.component.css']
// })
// export class PayerModalComponent implements OnInit {

//   @Input() allPayers: any[] = [];
//   selectedPayers: any[] = [];
//   multiplePayers = false;

//   constructor(public modal: NgbActiveModal) { }

//   ngOnInit(): void {
//     console.log('Initial selected allPayers:', this.allPayers);
//     // Initialize selectedPayers from allPayers if needed
//     this.selectedPayers = [...this.allPayers];
//     console.log('Initial selected payers:', this.selectedPayers);
//   }

//   // Toggle payer selection
//   togglePayer(payer: any) {
//     const index = this.selectedPayers.findIndex(p => p.memberName === payer.memberName);
//     if (index > -1) {
//       this.selectedPayers.splice(index, 1);
//     } else {
//       this.selectedPayers.push({ ...payer, amount: 0 });  // Initialize amount if needed
//     }
//     this.multiplePayers = this.selectedPayers.length > 1;
//   }

//   // Confirm the selection and return it to the parent component
//   confirmPayers() {
//     this.modal.close(this.selectedPayers);
//     console.log('Confirmed payers:', this.selectedPayers);
//   }

//   // Check if a payer is already selected
//   isPayerSelected(payer: any) {
//     return this.selectedPayers.some(p => p.memberName === payer.memberName);
//   }
// }


import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payer-modal',
  templateUrl: './payer-modal.component.html',
  styleUrls: ['./payer-modal.component.css']
})
export class PayerModalComponent implements OnInit {

  @Input() allPayers: any[] = [];
  @Input() totalExpenseAmount: any;
  selectedPayers: any[] = [];
  multiplePayers = false;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    console.log('Initial allPayers:', this.allPayers);

    // Initialize selectedPayers to only include the group creator
    const groupCreator = this.allPayers.find(payer => payer.groupCreater);
    if (groupCreator) {
      
      this.selectedPayers.push({ ...groupCreator, amount: this.totalExpenseAmount }); // Add the group creator
    }

    this.multiplePayers = this.selectedPayers.length > 1;
    console.log('Initially selected payers:', this.selectedPayers);
  }

  // Toggle payer selection
  togglePayer(payer: any) {
    const index = this.selectedPayers.findIndex(p => p.memberId === payer.memberId);
    if (index > -1) {
      this.selectedPayers.splice(index, 1);
    } else {
      this.selectedPayers.push({ ...payer, amount: '' });  // Initialize amount if needed
    }

    this.multiplePayers = this.selectedPayers.length > 1;
    console.log('Updated selectedPayers:', this.selectedPayers);
  }

  // Confirm the selection and return it to the parent component
  confirmPayers() {

    console.log('Confirmed payers:', this.selectedPayers);

    this.modal.close(this.selectedPayers);
  }

  // Check if a payer is already selected
  isPayerSelected(payer: any) {
    return this.selectedPayers.some(p => p.memberId === payer.memberId);
  }
}
