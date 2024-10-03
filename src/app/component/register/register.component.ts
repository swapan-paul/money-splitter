import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

//   email : string = '';
//   password : string = '';

//   constructor(private auth : AuthService) { }

//   ngOnInit(): void {
//   }

//   register() {

//     if(this.email == '') {
//       alert('Please enter email');
//       return;
//     }

//     if(this.password == '') {
//       alert('Please enter password');
//       return;
//     }

//     this.auth.register(this.email,this.password);
    
//     this.email = '';
//     this.password = '';

//   }

// }



  registrationForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }

    // this.authService.register(this.registrationForm.value).subscribe((registerRes: any) => {
    //   console.log('register res-----', registerRes);

    //   this.router.navigate(['/login']);
    // },
    //   (err: any) => console.error('Login error', err)
    // )

    this.authService.register(this.registrationForm.value.email, this.registrationForm.value.password);
  }
}