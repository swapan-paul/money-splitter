import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Student } from 'src/app/model/student';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';
import { AddEditGroupComponent } from '../add-edit-group/add-edit-group.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // studentsList: Student[] = [];
  // studentObj: Student = {
  //   id: '',
  //   first_name: '',
  //   last_name: '',
  //   email: '',
  //   mobile: ''
  // };
  // id: string = '';
  // first_name: string = '';
  // last_name: string = '';
  // email: string = '';
  // mobile: string = '';

  // constructor(private auth: AuthService, private data: DataService) { }

  // ngOnInit(): void {
  //   this.getAllStudents();
  // }

  // // register() {
  // //   this.auth.logout();
  // // }

  // getAllStudents() {

  //   this.data.getAllStudents().subscribe(res => {

  //     this.studentsList = res.map((e: any) => {
  //       const data = e.payload.doc.data();
  //       data.id = e.payload.doc.id;
  //       return data;
  //     })

  //   }, err => {
  //     alert('Error while fetching student data');
  //   })

  // }

  // resetForm() {
  //   this.id = '';
  //   this.first_name = '';
  //   this.last_name = '';
  //   this.email = '';
  //   this.mobile = '';
  // }

  // addStudent() {
  //   if (this.first_name == '' || this.last_name == '' || this.mobile == '' || this.email == '') {
  //     alert('Fill all input fields');
  //     return;
  //   }

  //   this.studentObj.id = '';
  //   this.studentObj.email = this.email;
  //   this.studentObj.first_name = this.first_name;
  //   this.studentObj.last_name = this.last_name;
  //   this.studentObj.mobile = this.mobile;

  //   this.data.addStudent(this.studentObj);
  //   this.resetForm();

  // }

  // updateStudent() {

  // }

  // deleteStudent(student: Student) {
  //   if (window.confirm('Are you sure you want to delete ' + student.first_name + ' ' + student.last_name + ' ?')) {
  //     this.data.deleteStudent(student);
  //   }
  // }


  @ViewChild('actionModalTemplate') actionModalTemplate:any;
  selectedGroup: any;
  private modalRef!: NgbModalRef;
  expenses: any[] = [];
  groups: any[] = [];
  featureGroupsData: any[] = [];
  allFriendsData: any[] = [];
  selectedView: string = 'dashboard'; // Default to dashboard
  selectedFriend: any = null;
  mainTitle: string = 'Command';
  mainIcon: string = 'fas fa-tachometer-alt';

  viewIcons = {
    dashboard: 'fas fa-tachometer-alt',
    group: 'fas fa-users',
    friend: 'fas fa-user'
  };

  constructor(private modalService: NgbModal,
    private dataService: DataService,) { }



  groupTitle = 'Home Sweet Home';
  groupDetails = '3 people · Created July 2019';
  oweAmount = '$80.61';
  transactions = [
    { description: 'Peanut Blasters', date: 'July 05', amount: '$3.33', type: 'borrowed' },
    { description: 'Stamps', date: 'July 01', amount: '$8.34', type: 'borrowed' },
    { description: 'Wifi', date: 'July 01', amount: '$29.67', type: 'borrowed' },
    { description: 'Water', date: 'June 28', amount: '$101.48', type: 'lent' },
  ];


  openExpensesModal() {
    const modalRef = this.modalService.open(AddExpenseModalComponent, { size: 'lg' });

    // Correct way to pass selectedGroup to modal
    if (this.selectedGroup) {
      console.log('this.selectedGroup+++++++', this.selectedGroup);
      modalRef.componentInstance.selectedGroup = this.selectedGroup;  // Pass the selectedGroup instance to the modal
    }

    // When the modal closes, get the result (the expense) and add it to the list
    modalRef.result.then(
      (expense: any) => {
        if (expense) {
          this.expenses.push(expense);
          console.log('Expense added:', this.expenses);
        }
      },
      (dismissed) => {
        console.log('Modal dismissed');
      }
    );
  }


  // Method to change the view based on user selection
  selectView(view: string, data: any = null) {
    this.selectedView = view;

    if (view === 'group') {
      this.selectedGroup = data;
      this.mainTitle = data.groupTitle; // Just the title without "Group:"
      this.mainIcon = this.viewIcons.group; // Set the corresponding icon
    } else if (view === 'friend') {
      this.selectedFriend = data;
      this.mainTitle = data.memberName; // Just the name without "Friend:"
      this.mainIcon = this.viewIcons.friend; // Set the corresponding icon
    } else if (view === 'dashboard') {
      this.mainTitle = 'Dashboard'; // Keep the original title
      this.mainIcon = this.viewIcons.dashboard; // Set the corresponding icon
    }
  }




  ngOnInit(): void {
    this.dataService.getGroups().subscribe((groups:any) => {
      this.featureGroupsData = groups || [];
      console.log('Fetched Groups:', this.featureGroupsData);
    });
    this.dataService.getFriends().subscribe((groups:any) => {
      this.allFriendsData = groups || [];
      console.log('Fetched Groups:', this.featureGroupsData);
    });
  }



  addGroup(selectedGroup?:any): void {

    const modalRef = this.modalService.open(AddEditGroupComponent, {
      centered: true,
      scrollable: false,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'custom-modal'
    });
    const addGroupComponentInstance: AddEditGroupComponent = modalRef.componentInstance;
    if (selectedGroup) {
      addGroupComponentInstance.selectedGroup = selectedGroup;
    }

    modalRef.result.then((result: any) => {
      if (result) {
        // Handle success
      } else {
        // Handle cancel
      }
    });
  }



  // // Function to open the action modal
  // openActionModal(group: any) {

  //   console.log('group------------', group)
  //   this.selectedGroup = group;  // Store the selected group
  //   this.modalRef = this.modalService.open(this.actionModalTemplate, { centered: true, windowClass: 'custom-modal' }); // Open the modal
  // }

  // // Function to edit group
  // editGroup() {
  //   this.modalRef.close();  // Close the action modal
  //   // You can now open another modal for editing, similar to how you handle group addition

  //   this.addGroup(this.selectedGroup);
  // }


  // // Function to delete group
  // deleteGroup() {
  //   this.modalRef.close(); // Close the action modal
  //   if (confirm('Are you sure you want to delete this group?')) {
  //     this.dataService.deleteGroup(this.selectedGroup.id).subscribe(
  //       response => {
  //         console.log('Group deleted successfully');
  //         // Refresh or update your list of groups after delete
  //       },
  //       error => {
  //         console.error('Error while deleting group:', error);
  //       }
  //     );
  //   }
  // }
}



