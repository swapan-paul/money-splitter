import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayerModalComponent } from '../payer-modal/payer-modal.component';


@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.css']
})
export class AddExpenseModalComponent implements OnInit {

//   @Input() expense = {
//     withWho: '',
//     description: '',
//     amount: 0,
//     paidBy: 'you',
//     splitMethod: 'equally',
//     date: '',
//   };

//   constructor(public activeModal: NgbActiveModal) { }

//   ngOnInit(): void {
    
//   }

//   onSubmit(expenseForm: any) {
//     if (expenseForm.valid) {
//       console.log('Expense added:', this.expense);
//       this.activeModal.close(this.expense); // Close the modal and return the expense object
//     }
//   }

//   close() {
//     this.activeModal.dismiss();
//   }
// }
//   description: string = '';
//   imageSrc: string = '';

//   constructor(public activeModal: NgbActiveModal) { }
//   ngOnInit(): void {
    
//   }

//   // Map of descriptions to image paths
//   private imageMap: { [key: string]: string } = {
//     party: 'assets/logo/logo.png', // Path to your party image
//     movie: 'assets/logo/images.png', // Path to your movie ticket image
//     // Add more mappings as needed
//   };

//   updateImage() {
//     // Normalize the input to lowercase
//     const lowerCaseDescription = this.description.toLowerCase();
//     // Set the imageSrc based on the description
//     this.imageSrc = this.imageMap[lowerCaseDescription] || ''; // Default to empty if no match
//   }

//   saveExpense() {
//     // Logic to save the expense
//     this.activeModal.close();
//   }
// }

  @Input() selectedGroup: any; 
  expenseForm: FormGroup;
  imageSrc: any | null = null;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder,
     private modalService: NgbModal) {
    this.expenseForm = this.fb.group({
      withYou: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/)]],
      date: ['', Validators.required],
      // Add other controls as needed
    });
  }
  ngOnInit(): void {
    console.log('selectedGroup----------', this.selectedGroup);
  }




  updateImage() {
    // Update imageSrc based on description
    const description = this.expenseForm.get('description')?.value;
    if (description) {
      this.imageSrc = this.getImageForDescription(description);
    } else {
      this.imageSrc = null; // Or set a default image
    }
  }

  getImageForDescription(description: string): string {
    // Define the image mapping with a string index signature
    const images: { [key: string]: string } = {
      party: 'assets/logo/logo.png',
      movie: 'assets/logo/images.png',
      // Add other mappings as needed
    };

    // Use a lowercase version of the description to access the mapping
    return images[description.toLowerCase()] || 'assets/logo/logo.png';
  }

  saveExpense() {
    // Logic to save expense
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;
      console.log(expenseData);
      // Handle saving the data
    }
  }


  // Open the payer modal
  openPayerModal() {
    const modalRef = this.modalService.open(PayerModalComponent, { size: 'lg' });
    // modalRef.componentInstance.selectedPayers = this.selectedPayers;

    // Get data back from the modal when it's closed
    modalRef.result.then((result: any) => {
      // if (result) {
      //   this.selectedPayers = result;
      //   this.expenseForm.patchValue({ payers: this.selectedPayers });
      // }
    }, (reason) => {
      console.log('Dismissed');
    });
  }
}
