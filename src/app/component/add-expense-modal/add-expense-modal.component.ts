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
  @Input() selectedView: any;

  @Input() allGroup: any

  expenseForm: FormGroup;
  imageSrc: any | null = null;
  payersData: any[] = [];
  selectedMembers: any[] = [];
  isNgSelectVisible: boolean = false;
  groupCreatedBy: any;
  groupCreaterUid: any;
  selectedGroupData: any = null;
  filteredMembers: any;
  anotherFilterGroup: any[] = [];
  perPerson: any;

  constructor(public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private dataService: DataService,
    private modalService: NgbModal) {

    this.groupCreatedBy = localStorage.getItem('userName') || '';
    this.groupCreaterUid = localStorage.getItem('uId') || '';
    this.expenseForm = this.fb.group({
      withYou: [[], Validators.required],
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+\.?\d{0,2}$/)]],
      date: ['', Validators.required],
      notes: [''],
      group: [''],
      groupId: [''],
      groupTitle: [''],
      groupCreaterUid: [''],
      groupCreatedBy: [''],
      payersData: [''],
      expenseIcon: [''],
      selectedGroupControl: [this.selectedGroup?.groupTitle || '', Validators.required]
    });

    this.expenseForm.valueChanges.subscribe(() => {
      this.calculatePerPersonAmount();
    });

  }

  calculatePerPersonAmount() {
    const amount = this.expenseForm.get('amount')?.value;
    const withYouArray = this.expenseForm.get('withYou')?.value;

    if (amount && Array.isArray(withYouArray) && withYouArray.length > 0) {
      this.perPerson = amount / withYouArray.length;
      // console.log('Per person amount:', this.perPerson);
    } else {
      // console.log('Please enter a valid amount and select people to split the expense.');
    }
  }

  ngOnInit(): void {

    console.log('Selected group!!!!!!!!!!!:', this.selectedGroup);
    if (!this.selectedMembers || this.selectedMembers.length === 0) {
      this.setAllMembers();
    }


    console.log('allGroup=======>>>', this.allGroup);

    if (this.selectedView === 'group') {
      this.expenseForm.removeControl('selectedGroupControl');
    } else {
      this.expenseForm.get('selectedGroupControl')?.valueChanges.subscribe((selectedGroupData) => {
        this.onGroupSelect(selectedGroupData);
      });
    }
  }



  onGroupSelect(selectedGroupData: any) {
    this.selectedGroupData = selectedGroupData;
    // console.log('Selected group:', this.selectedGroupData);
    this.selectedGroup = this.selectedGroupData;

    this.setAllMembers();


  }

  setAllMembers() {
    if (this.selectedGroup && this.selectedGroup.members) {
      const allMemberIds = this.selectedGroup.members.map((member: any) => member.memberId);
      this.expenseForm.patchValue({ withYou: allMemberIds });
      this.selectedMembers = allMemberIds;
    }
    // this.filterMembers();
  }

  // filterMembers() {
  //   if (this.selectedGroup && this.selectedGroup.members) {
  //     // Deep copy the members array to avoid mutations
  //     const membersCopy = JSON.parse(JSON.stringify(this.selectedGroup.members));

  //     // Exclude the member who created the group
  //     this.anotherFilterGroup = membersCopy.filter((member: any) =>
  //       member.memberId !== this.selectedGroup.groupCreaterUid
  //     );

  //     console.log('this.anotherFilterGroup--------', this.anotherFilterGroup);
  //   }
  // }
  saveExpense() {

    if (this.selectedGroup) {
      this.expenseForm.patchValue({
        groupId: this.selectedGroup?.groupId || '',
        groupTitle: this.selectedGroup?.groupTitle || '',
        groupCreaterUid: this.selectedGroup?.groupCreaterUid || this.groupCreaterUid || '',
        groupCreatedBy: this.selectedGroup?.groupCreatedBy || this.groupCreatedBy || '',
        payersData: this.payersData,
        expenseIcon: this.imageSrc || '',
      });

    }

    if (!this.expenseForm.get('withYou')?.value || this.expenseForm.get('withYou')?.value.length === 0) {
      this.setAllMembers();
    }
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
      // console.log('Expense data:', expenseData);

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
      party: 'assets/logo/party.png',
      ticket: 'assets/logo/ticket.png',
      movie: 'assets/logo/ticket.png',
      pooja: 'assets/logo/pooja.png',
      travel: 'assets/logo/travel.png',
      trip: 'assets/logo/trip.png',
    };
    return images[description.toLowerCase()] || 'assets/logo/ticket.png';
  }

  openPayerModal() {
    let groupMembers: any[] = [
      ...this.selectedGroup.members,
    ];

    let filteredMembers = groupMembers.filter(member =>
      this.selectedMembers.includes(member.memberId)
    );

    filteredMembers = [...filteredMembers,
      //   {
      //   memberId: this.selectedGroup.groupCreaterUid,
      //   memberName: this.selectedGroup.groupCreatedBy,
      //   groupCreater: true
      // }
    ];

    const modalRef = this.modalService.open(PayerModalComponent, { size: 'lg' });
    modalRef.componentInstance.allPayers = this.selectedMembers == undefined ? this.selectedGroup : filteredMembers;
    modalRef.componentInstance.totalExpenseAmount = this.expenseForm.value.amount

    modalRef.result.then((result: any) => {
      if (result.length !== 0) {
        this.payersData = result;
        console.log('Payers Data:', result);
      } else {
        this.payersData.push({
          amount: this.expenseForm.value.amount,
          groupCreater: true,
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
