// import { Component, Input, OnInit } from '@angular/core';
// import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { PayerModalComponent } from '../payer-modal/payer-modal.component';


// @Component({
//   selector: 'app-add-expense-modal',
//   templateUrl: './add-expense-modal.component.html',
//   styleUrls: ['./add-expense-modal.component.css']
// })
// export class AddExpenseModalComponent implements OnInit {

// //   @Input() expense = {
// //     withWho: '',
// //     description: '',
// //     amount: 0,
// //     paidBy: 'you',
// //     splitMethod: 'equally',
// //     date: '',
// //   };

// //   constructor(public activeModal: NgbActiveModal) { }

// //   ngOnInit(): void {
    
// //   }

// //   onSubmit(expenseForm: any) {
// //     if (expenseForm.valid) {
// //       console.log('Expense added:', this.expense);
// //       this.activeModal.close(this.expense); // Close the modal and return the expense object
// //     }
// //   }

// //   close() {
// //     this.activeModal.dismiss();
// //   }
// // }
// //   description: string = '';
// //   imageSrc: string = '';

// //   constructor(public activeModal: NgbActiveModal) { }
// //   ngOnInit(): void {
    
// //   }

// //   // Map of descriptions to image paths
// //   private imageMap: { [key: string]: string } = {
// //     party: 'assets/logo/logo.png', // Path to your party image
// //     movie: 'assets/logo/images.png', // Path to your movie ticket image
// //     // Add more mappings as needed
// //   };

// //   updateImage() {
// //     // Normalize the input to lowercase
// //     const lowerCaseDescription = this.description.toLowerCase();
// //     // Set the imageSrc based on the description
// //     this.imageSrc = this.imageMap[lowerCaseDescription] || ''; // Default to empty if no match
// //   }

// //   saveExpense() {
// //     // Logic to save the expense
// //     this.activeModal.close();
// //   }
// // }

//   @Input() selectedGroup: any;
//   expenseForm: FormGroup;
//   imageSrc: any | null = null;
//   payersData: any[] = [];
//   selectedMembers: any[] = [];
//   isNgSelectVisible: any = false;

//   constructor(public activeModal: NgbActiveModal, 
//     private fb: FormBuilder,
//     private modalService: NgbModal,
//   ) {
//     this.expenseForm = this.fb.group({
//       withYou: [[], Validators.required], // FormArray for member selection
//       description: ['', Validators.required],
//       amount: ['', [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/)]],
//       date: ['', Validators.required],
//     });
//   }
//   ngOnInit(): void {
//     console.log('selectedGroup----------', this.selectedGroup);
//   }




//   updateImage() {
//     // Update imageSrc based on description
//     const description = this.expenseForm.get('description')?.value;
//     if (description) {
//       this.imageSrc = this.getImageForDescription(description);
//     } else {
//       this.imageSrc = null; // Or set a default image
//     }
//   }

//   getImageForDescription(description: string): string {
//     // Define the image mapping with a string index signature
//     const images: { [key: string]: string } = {
//       party: 'assets/logo/logo.png',
//       movie: 'assets/logo/images.png',
//       // Add other mappings as needed
//     };

//     // Use a lowercase version of the description to access the mapping
//     return images[description.toLowerCase()] || 'assets/logo/logo.png';
//   }

//   saveExpense() {
//     // Logic to save expense
//     if (this.expenseForm.valid) {
//       const expenseData = this.expenseForm.value;
//       console.log('expenseData$$$$$$$$$$$',expenseData);
//       // Handle saving the data
//     }
//   }


//   // // Open the payer modal
//   // openPayerModal() {
//   //   const modalRef = this.modalService.open(PayerModalComponent, { size: 'lg' });
//   //   modalRef.componentInstance.selectedPayers = this.selectedGroup;

//   //   // Get data back from the modal when it's closed
//   //   modalRef.result.then((result: any) => {
//   //     // if (result) {
//   //     //   this.selectedPayers = result;
//   //     //   this.expenseForm.patchValue({ payers: this.selectedPayers });
//   //     // }
//   //   }, (reason) => {
//   //     console.log('Dismissed');
//   //   });
//   // }


//   // // Open the payer modal
//   // openPayerModal() {

//   //   let groupMembers: any[] = [];
//   //   groupMembers = [...this.selectedGroup.members, { memberId: this.selectedGroup.groupCreaterUid, memberName: this.selectedGroup.groupCreatedBy, groupCreater: true }]

//   //   console.log('this.selectedMembers--------------', this.selectedMembers);

//   //   const modalRef = this.modalService.open(PayerModalComponent, { size: 'lg' });
//   //   modalRef.componentInstance.allPayers = this.selectedMembers;

//   //   // Get data back from the modal when it's closed
//   //   modalRef.result.then((result: any) => {
//   //     if (result) {
//   //       this.payersData = result;
//   //       console.log('result--------------', result);
//   //       // this.expenseForm.patchValue({ payers: this.payersData });

//   //       // console.log('this.expenseForm.value', this.expenseForm.value);
//   //     }
//   //   }, (reason: any) => {
//   //     console.log('Dismissed');
//   //   });
//   // }


//   // Open the payer modal
//   openPayerModal() {

//     // Group members including the creator
//     let groupMembers: any[] = [
//       ...this.selectedGroup.members,
//       // {
//       //   memberId: this.selectedGroup.groupCreaterUid,
//       //   memberName: this.selectedGroup.groupCreatedBy,
//       //   groupCreater: true
//       // }
//     ];

//     console.log('Selected Members:', this.selectedMembers);

//     // Filter members from selectedGroup based on selectedMembers
//     let filteredMembers = groupMembers.filter(member =>
//       this.selectedMembers.includes(member.memberId)
//     );

//     filteredMembers = [...filteredMembers, {
//       memberId: this.selectedGroup.groupCreaterUid,
//       memberName: this.selectedGroup.groupCreatedBy,
//       groupCreater: true
//     }]


//     console.log('Filtered Members:', filteredMembers); // This will contain the selected members from the group

//     // Open modal
//     const modalRef = this.modalService.open(PayerModalComponent, { size: 'lg' });
//     modalRef.componentInstance.allPayers = this.selectedMembers == undefined ? this.selectedGroup : filteredMembers;

//     // Get data back from the modal when it's closed
//     modalRef.result.then((result: any) => {
//       if (result) {
//         this.payersData = result;
//         console.log('Payers Data:', result);
//       }
//     }, (reason: any) => {
//       console.log('Dismissed');
//     });
//   }


//   selectGroupMember() {
//     this.isNgSelectVisible = true;
//   }


// }


import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayerModalComponent } from '../payer-modal/payer-modal.component';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-add-expense-modal',
  templateUrl: './add-expense-modal.component.html',
  styleUrls: ['./add-expense-modal.component.css']
})
export class AddExpenseModalComponent implements OnInit {

  @Input() selectedGroup: any;
  @Input() expenseId: any;
  expenseForm: FormGroup;
  imageSrc: any | null = null;
  payersData: any[] = [];
  selectedMembers: any[] = [];
  isNgSelectVisible: boolean = false;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private dataService: DataService,
    private modalService: NgbModal) {
    this.expenseForm = this.fb.group({
      withYou: [[], Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/)]],
      date: ['', Validators.required],
      groupId: [''],
      groupTitle: [''],
      groupCreaterUid: [''],
      groupCreatedBy: [''],
      payersData: [''],
      expenseIcon: [''],
    });
  }

  ngOnInit(): void {
    console.log('Selected group:', this.selectedGroup);
    // Automatically select all members if none are selected
    if (!this.selectedMembers || this.selectedMembers.length === 0) {
      this.setAllMembers();
    }
  }

  setAllMembers() {
    if (this.selectedGroup && this.selectedGroup.members) {
      const allMemberIds = this.selectedGroup.members.map((member: any) => member.memberId);
      this.expenseForm.patchValue({ withYou: allMemberIds });
      this.selectedMembers = allMemberIds;
    }
  }

  saveExpense() {

    if (this.selectedGroup){
      this.expenseForm.patchValue({ groupId: this.selectedGroup?.groupId || '',
        groupTitle: this.selectedGroup?.groupTitle || '',
        groupCreaterUid: this.selectedGroup?.groupCreaterUid || '',
        groupCreatedBy: this.selectedGroup?.groupCreatedBy || '',
        payersData: this.payersData,
        expenseIcon: this.imageSrc || '',
       });

    }

    // Automatically select all members if none are selected before saving
    if (!this.expenseForm.get('withYou')?.value || this.expenseForm.get('withYou')?.value.length === 0) {
      this.setAllMembers();
    }
    // if payerData modal not open defalt save total amount
    if (!this.expenseForm.get('payersData')?.value || this.expenseForm.get('payersData')?.value.length === 0) {
      this.payersData.push({
        amount: this.expenseForm.value.amount,
        groupCreater: true,
        memberId: this.selectedGroup.groupCreaterUid,
        memberName: this.selectedGroup.groupCreatedBy,
      })
    }

    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;
      console.log('Expense data:', expenseData);

      this.dataService.addExpense(expenseData).subscribe(
        (response: any) => {
         
          console.log('Expenses added successfully:', response)

          this.dataService.calculateBalancesForGroup(this.selectedGroup?.groupId);
          this.dataService.calculateBalancesForExpense(this.selectedGroup?.groupId, response.id);
        },
        (error: any) => console.error('Error while adding expenses:', error)
      );

      this.activeModal.close(expenseData);
    }
  }

  updateImage() {
    const description = this.expenseForm.get('description')?.value;
    if (description) {
      this.imageSrc = this.getImageForDescription(description);
    } else {
      this.imageSrc = null;
    }
  }

  getImageForDescription(description: string): string {
    const images: { [key: string]: string } = {
      party: 'assets/logo/logo.png',
      movie: 'assets/logo/images.png',
    };
    return images[description.toLowerCase()] || 'assets/logo/logo.png';
  }

  openPayerModal() {
    let groupMembers: any[] = [
      ...this.selectedGroup.members,
    ];

    let filteredMembers = groupMembers.filter(member =>
      this.selectedMembers.includes(member.memberId)
    );

    filteredMembers = [...filteredMembers, {
      memberId: this.selectedGroup.groupCreaterUid,
      memberName: this.selectedGroup.groupCreatedBy,
      groupCreater: true
    }];

    const modalRef = this.modalService.open(PayerModalComponent, { size: 'lg' });
    modalRef.componentInstance.allPayers = this.selectedMembers == undefined ? this.selectedGroup : filteredMembers;
    modalRef.componentInstance.totalExpenseAmount = this.expenseForm.value.amount

    modalRef.result.then((result: any) => {

      // alert()
      if (result.length !== 0) {
        // alert('if')
        this.payersData = result;
        console.log('Payers Data:', result);
      }else{
        // alert('else')
        this.payersData.push({
          amount: this.expenseForm.value.amount,
          groupCreater:true,
          memberId: this.selectedGroup.groupCreaterUid,
          memberName: this.selectedGroup.groupCreatedBy,
})
      }
    }, (reason: any) => {
      console.log('Dismissed');
    });
  }


  selectGroupMember() {
    this.isNgSelectVisible = true;
  }
}
