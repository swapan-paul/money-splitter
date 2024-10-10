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
    this.emailVerificationSubscription = interval(5000).subscribe(() => {
      this.fireauth.currentUser.then(user => {
        if (user) {
          user.reload().then(() => {
            if (user.emailVerified) {
              alert('Email verified successfully!');
              this.router.navigate(['/login']);
            }
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.emailVerificationSubscription) {
      this.emailVerificationSubscription.unsubscribe();
    }
  }
}
