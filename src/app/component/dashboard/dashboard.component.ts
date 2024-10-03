import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Student } from 'src/app/model/student';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';
import { AddExpenseModalComponent } from '../add-expense-modal/add-expense-modal.component';

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

  expenses: any[] = [];

  constructor(private modalService: NgbModal) { }


  ngOnInit(): void {
    
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


  openModal() {
    const modalRef = this.modalService.open(AddExpenseModalComponent, { size: 'lg' });

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
}



