import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Student } from 'src/app/model/student';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';
import { AddEditGroupComponent } from '../add-edit-group/add-edit-group.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { EmailService } from 'src/app/shared/email/email.service';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { ProfileComponent } from '../profile/profile.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  @ViewChild('actionModalTemplate') actionModalTemplate:any;
  inviteEmail: string = '';
  selectedGroup: any;
  private modalRef!: NgbModalRef;
  expenses: any[] = [];
  groups: any[] = [];
  featureGroupsData: any[] = [];
  allFriendsData: any[] = [];
  allExpenseData: any[] = [];
  allExpenseDataByGroupId: any[] = [];
  allExpense: any[] = [];
  selectedView: string = 'dashboard'; // Default to dashboard
  selectedFriend: any = null;
  mainTitle: string = 'Dashboard';
  mainIcon: string = 'fas fa-tachometer-alt';

  viewIcons = {
    dashboard: 'fas fa-tachometer-alt',
    group: 'fas fa-users',
    friend: 'fas fa-user',
    expenses: 'fas fa-money-bill-wave'
  };
  selectedExpenseBalanceData: any;
  allExpenseDataByMemberId: any[] = [];
  selectedGroupDetail: any;
  memberNames: any[] = [];
  allmemberNames: any[] = [];
  groupCreatedBy: any;
  groupCreaterUid: any;


  user = {
    profileImage: 'assets/logo/profile.png'
  };
  userData: any;
  isMobileView: boolean = false;




  constructor(private modalService: NgbModal,
    private dataService: DataService,
    private firestore: AngularFirestore, 
    private auth: AngularFireAuth, 
    private emailService: EmailService) { }


  // Detect screen size changes
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileView = window.innerWidth <= 768; // Example mobile breakpoint at 768px
  }



  ngOnInit(): void {

    this.isMobileView = window.innerWidth <= 768;

    this.groupCreatedBy = localStorage.getItem('userName') || '';
    this.groupCreaterUid = localStorage.getItem('uId') || '';

    this.dataService.getUserData(this.groupCreaterUid).subscribe({
        next: (data) => {

        this.userData = data;

        this.user = {
          profileImage: this.userData.profileImageUrl ? this.userData.profileImageUrl : 'assets/logo/profile.png'
        };

        console.log('this.userData++++++++++++', this.userData)
        },
        error: (error) => {
          console.error('Error fetching balance data:', error);
        }
      });
 
    this.dataService.getGroups(this.groupCreaterUid).subscribe((groups: any) => {
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
    this.dataService.getFriends(this.groupCreaterUid).subscribe((friends: any) => {
        this.allFriendsData = friends || [];
        this.allmemberNames = this.allFriendsData.map(friend => friend.memberName);
        console.log('All friends:##########', this.allFriendsData);
        console.log('allmemberNames#########', this.allmemberNames);
      });
    }


  openExpensesModal() {
    const modalRef = this.modalService.open(AddExpenseModalComponent, { size: 'lg' });

    if (this.selectedGroup, this.featureGroupsData) {
      console.log('this.selectedGroup+++++++', this.selectedGroup);
      modalRef.componentInstance.selectedGroup = this.selectedGroup;
      modalRef.componentInstance.allGroup = this.featureGroupsData;
      modalRef.componentInstance.selectedView = this.selectedView;
    }

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


    console.log('data=============',data);
    this.selectedView = view;

    if (view === 'group') {
      this.dataService.getExpensesByGroupId(data.groupId).subscribe((expense: any) => {
        this.allExpenseDataByGroupId = expense || [];
        console.log('All Expense Data By group Id:', this.allExpenseDataByGroupId);
      });

      // if(){

      // }


      this.selectedGroup = data;
      this.selectedGroupDetail = data;

      console.log('selectedGroupDetail------444444', this.selectedGroupDetail);

      const getMemberNames = (group: any) => {
        return group.members
          .filter((member: any) => !member.groupCreater) // Exclude the group creator
          .map((member: any) => member.memberName); // Get the member names
      };

      // Usage
      this.memberNames = getMemberNames(this.selectedGroupDetail);
      console.log(this.memberNames); // ["chintu", "pintu"]



      this.mainTitle = data.groupTitle;  // Set the group title
      this.mainIcon = this.viewIcons.group;  // Set the corresponding icon
    } else if (view === 'friend') {
      // Handle friend view

      this.dataService.getExpensesByMemberId(data.id).subscribe((expense: any) => {
        this.allExpenseDataByMemberId = expense || [];
        console.log('All Expense Data By member Id:', this.allExpenseDataByMemberId);
      });

      
      const selectedGroupFriend = {
        ...data,
        createdAt: new Date(),
        groupCreaterUid: this.groupCreaterUid,
        groupCreatedBy: this.groupCreatedBy,
        members: [
          { memberId: data.id , memberName: data.memberName },
          { memberId: this.groupCreaterUid, memberName: this.groupCreatedBy }
        ]  
      };



      this.selectedGroup = selectedGroupFriend;
      this.mainTitle = data.memberName;  // Set the friend name
      this.mainIcon = this.viewIcons.friend;  // Set the corresponding icon
    } else if (view === 'dashboard') {  
      // Handle dashboard view
      this.mainTitle = 'Dashboard';  // Keep the original title
      this.mainIcon = this.viewIcons.dashboard;  // Set the corresponding icon
    }
    else if (view === 'allExpenses') { 
      
      
      this.dataService.getExpenses(this.groupCreaterUid).subscribe((expense: any) => {
        this.allExpense = expense || [];
        console.log('All Expense:', this.allExpense);
      });
      // Handle dashboard view

      this.mainTitle = 'All Expenses';
      this.mainIcon = this.viewIcons.expenses;
    }
  }

 


  openProfileModal() {
    const modalRef = this.modalService.open(ProfileComponent, { centered: true, windowClass: 'custom-modal-profile' });
    modalRef.componentInstance.user = {
      email: this.userData?.email,
      mobile: this.userData?.mobile,
      uid: this.userData?.uid,
      username: this.userData?.username,
      profileImageUrl: this.userData?.profileImageUrl ? this.userData.profileImageUrl: ''
    };

    modalRef.result.then(
      (updatedProfile) => {
        console.log('Profile updated:', updatedProfile);
      },
      () => {
        console.log('Profile modal closed');
      }
    );
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




  sendInvite() {
    if (this.inviteEmail) {
      const inviteData = {
        email: this.inviteEmail,
        timestamp: new Date(),
      };

      // Storing invite information in Firestore
      this.firestore.collection('invites').add(inviteData).then(() => {
        console.log('Invite saved in Firebase');
      });

      // // Call a service to send the actual email (assumes you have a service for this)
      // this.emailService.sendInviteEmail(this.inviteEmail).subscribe(response => {
      //   console.log('Invite sent successfully', response);
      // });

      // Reset the invite email input field
      this.inviteEmail = '';
    } else {
      console.log('Please enter a valid email');
    }
  }

  openPaymentModal() {


    console.log('this.allmemberNames&&&&&&&&&', this.allmemberNames)
    const modalRef = this.modalService.open(PaymentModalComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.memberNames = this.memberNames.length > 0 ? this.memberNames : this.allmemberNames;
    modalRef.componentInstance.groupName = this.selectedGroup.groupTitle ? this.selectedGroup.groupTitle : '';
    modalRef.result.then(
      (paymentData: any) => {
        // Handle result when modal is closed with data
        console.log('>>>>>>>>>>>Payment modal result<<<<<<<<<<<<', paymentData);
      },
      (dismissed) => {
        console.log('Modal dismissed:', dismissed);
      }
    );
  }


}


