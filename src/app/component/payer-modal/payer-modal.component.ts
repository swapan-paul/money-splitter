
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
    // console.log('Initial allPayers:@@@@@@@@@@', this.allPayers);

    const groupCreator = this.allPayers.find(payer => payer.groupCreater);
    if (groupCreator) {

      this.selectedPayers.push({ ...groupCreator, amount: this.totalExpenseAmount });
    }

    this.multiplePayers = this.selectedPayers.length > 1;
    // console.log('Initially selected payers:', this.selectedPayers);
  }

  togglePayer(payer: any) {
    const index = this.selectedPayers.findIndex(p => p.memberId === payer.memberId);
    if (index > -1) {
      this.selectedPayers.splice(index, 1);
    } else {
      this.selectedPayers.push({ ...payer, amount: 0 });
    }

    this.multiplePayers = this.selectedPayers.length > 1;
    // console.log('Updated selectedPayers:', this.selectedPayers);
  }

  confirmPayers() {

    // console.log('Confirmed payers:', this.selectedPayers);

    this.modal.close(this.selectedPayers);
  }

  isPayerSelected(payer: any) {
    return this.selectedPayers.some(p => p.memberId === payer.memberId);
  }
}
