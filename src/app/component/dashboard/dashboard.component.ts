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

  @ViewChild('actionModalTemplate') actionModalTemplate:any;
  selectedGroup: any;
  private modalRef!: NgbModalRef;
  expenses: any[] = [];
  groups: any[] = [];
  featureGroupsData: any[] = [];
  allFriendsData: any[] = [];
  allExpenseData: any[] = [];
  allExpenseDataByGroupId: any[] = [];
  selectedView: string = 'dashboard'; // Default to dashboard
  selectedFriend: any = null;
  mainTitle: string = 'Dashboard';
  mainIcon: string = 'fas fa-tachometer-alt';

  viewIcons = {
    dashboard: 'fas fa-tachometer-alt',
    group: 'fas fa-users',
    friend: 'fas fa-user'
  };
  selectedExpenseBalanceData: any;

  constructor(private modalService: NgbModal,
    private dataService: DataService,) { }



  ngOnInit(): void {
    // this.dataService.getGroups().subscribe((groups: any) => {
    //   this.featureGroupsData = groups || [];

    //   this.dataService.getBalanceByGroupId(this.featureGroupsData[0].groupId).subscribe(
    //     (balanceData: any) => {
    //       this.selectedExpenseBalanceData = balanceData;

    //       console.log('Balance data :+++++++++++++++++++++', balanceData);

    //     },
    //     (error) => {
    //       console.error('Error fetching balance data:', error);
    //     }
    //   );
    //   console.log('Fetched Groups:', this.featureGroupsData);
    // });
    // this.dataService.getFriends().subscribe((friends: any) => {
    //   this.allFriendsData = friends || [];
    //   console.log('All friends:', this.featureGroupsData);
    // });
    // // this.dataService.getExpenses().subscribe((expense: any) => {
    // //   this.allExpenseData = expense || [];
    // //   console.log(' allExpenseData:', this.allExpenseData);
    // // });
    // // Fetch balance by groupId (not balanceId)


      // Fetch groups
      this.dataService.getGroups().subscribe((groups: any) => {
        this.featureGroupsData = groups || [];
        console.log('Fetched Groups:', this.featureGroupsData);

        if (this.featureGroupsData.length > 0) {
          // Initialize an array to store all balance data
          this.selectedExpenseBalanceData = [];

          // Loop through each group and fetch balance data
          this.featureGroupsData.forEach((group: any) => {
            this.dataService.getAllBalance().subscribe(
              (balanceData: any) => {
                // Add the fetched balance data to the array
                this.selectedExpenseBalanceData.push({
                  groupId: group.groupId,
                  groupTitle: group.groupTitle,
                  balanceData: balanceData
                });
                console.log(`Balance data fetched for groupId ${group.groupId}:`, balanceData);
              },
              (error) => {
                console.error(`Error fetching balance data for groupId ${group.groupId}:`, error);
              }
            );
          });
        }
      });

      // Fetch friends data
      this.dataService.getFriends().subscribe((friends: any) => {
        this.allFriendsData = friends || [];
        console.log('All friends:', this.allFriendsData);
      });
    }

   



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
          // this.expenses.push(expense);
          // console.log('Expense added:', this.expenses);
          // console.log('Expense&&&&&&&&&&&&&&&&&&&&&:', expense);
        }
      },
      (dismissed) => {
        console.log('Modal dismissed');
      }
    );
  }


  selectView(view: string, data: any = null) {
    this.selectedView = view;

    if (view === 'group') {
      // Fetch expenses by groupId
      this.dataService.getExpensesByGroupId(data.groupId).subscribe((expense: any) => {
        this.allExpenseDataByGroupId = expense || [];
        console.log('All Expense Data By group Id:', this.allExpenseDataByGroupId);
      });

      // Update UI elements
      this.selectedGroup = data;
      this.mainTitle = data.groupTitle;  // Set the group title
      this.mainIcon = this.viewIcons.group;  // Set the corresponding icon
    } else if (view === 'friend') {
      // Handle friend view
      this.selectedFriend = data;
      this.mainTitle = data.memberName;  // Set the friend name
      this.mainIcon = this.viewIcons.friend;  // Set the corresponding icon
    } else if (view === 'dashboard') {  
      // Handle dashboard view
      this.mainTitle = 'Dashboard';  // Keep the original title
      this.mainIcon = this.viewIcons.dashboard;  // Set the corresponding icon
    }
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



