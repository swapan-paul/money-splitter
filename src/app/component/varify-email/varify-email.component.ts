import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-varify-email',
  templateUrl: './varify-email.component.html',
  styleUrls: ['./varify-email.component.css']
})
export class VarifyEmailComponent implements OnInit, OnDestroy {
  private emailVerificationSubscription: Subscription | null = null;

  constructor(private fireauth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.monitorEmailVerification();
  }

  monitorEmailVerification(): void {
    // Poll the Firebase user object every 5 seconds to check if the email is verified
    this.emailVerificationSubscription = interval(5000).subscribe(() => {
      this.fireauth.currentUser.then(user => {
        if (user) {
          user.reload().then(() => {
            if (user.emailVerified) {
              // If the email is verified, redirect to the login page or dashboard
              alert('Email verified successfully!');
              this.router.navigate(['/login']);  // or navigate to the dashboard if needed
            }
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    // Cleanup the subscription when the component is destroyed
    if (this.emailVerificationSubscription) {
      this.emailVerificationSubscription.unsubscribe();
    }
  }
}
