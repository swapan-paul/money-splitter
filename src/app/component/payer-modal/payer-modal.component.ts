import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payer-modal',
  templateUrl: './payer-modal.component.html',
  styleUrls: ['./payer-modal.component.css']
})
export class PayerModalComponent implements OnInit {

// payer-modal.component.ts


  @Input() selectedPayers: any[] = [];

  // Mock list of payers
  payers = [
    { name: 'Anshu Yadav', amount: 0 },
    { name: 'Neelam', amount: 0 },
    { name: 'Swapan Paul', amount: 0 }
  ];

  multiplePayers = false;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    
  }

  // Toggle payer selection
  togglePayer(payer: any) {
    const index = this.selectedPayers.findIndex(p => p.name === payer.name);
    if (index > -1) {
      this.selectedPayers.splice(index, 1);
    } else {
      this.selectedPayers.push({ ...payer });
    }
    this.multiplePayers = this.selectedPayers.length > 1;
  }

  // Confirm the selection and return it to the parent
  confirmPayers() {
    this.modal.close(this.selectedPayers);


    console.log('this.selectedPayers=======', this.selectedPayers);
  }
}

