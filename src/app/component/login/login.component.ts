import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

//   email : string = '';
//   password : string = '';

//   constructor(private auth : AuthService) { }

//   ngOnInit(): void {
//   }

//   login() {

//     if(this.email == '') {
//       alert('Please enter email');
//       return;
//     }

//     if(this.password == '') {
//       alert('Please enter password');
//       return;
//     }

//     this.auth.login(this.email,this.password);
    
//     this.email = '';
//     this.password = '';

//   }

//   signInWithGoogle() {
//     this.auth.googleSignIn();
//   }
 
// }

  loginForm: FormGroup;
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
    // .subscribe(
    //     (res: any) => {
    //       console.log('Login successful', res);
    //       this.router.navigate(['/dashboard']);
    //     },
    //     (err:any) => {
    //       console.error('Login error', err);
    //       this.errorMessage = 'Invalid login credentials. Please try again.';
    //     }
    //   );
    // } else {
    //   this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }



  signInWithGoogle() {
    this.authService.googleSignIn();
      }



}

