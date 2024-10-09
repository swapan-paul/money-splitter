import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }

  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(async (res: any) => {
      localStorage.setItem('token', 'true');

      const token = await res.user?.getIdToken();

      if (res.user) {
        this.firestore.collection('users').doc(res.user.uid).valueChanges().subscribe((userData: any) => {
          localStorage.setItem('userToken', token || '');
          localStorage.setItem('userName', userData?.username || '');
          localStorage.setItem('uId', userData?.uid || '');

          if (res.user.emailVerified) {
            this.router.navigate(['dashboard']);
          } else {
            this.router.navigate(['/varify-email']);
          }
        });
      }

    }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
    });
  }



  register(email: string, password: string, username: string, mobile: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(res => {
      this.firestore.collection('users').doc(res.user?.uid).set({
        uid: res.user?.uid,
        email: res.user?.email,
        username: username,
        mobile: mobile
      }).then(() => {
        alert('Registration Successful');
        this.sendEmailForVarification(res.user);
        this.router.navigate(['/login']);
      }).catch(err => {
        alert('Error saving user data: ' + err.message);
      });

    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    });
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('userToken');
    return !!user;
  }

  logout(): Observable<any> {

    return from(this.fireauth.signOut().then(() => {
      // Clear any stored user session or tokens
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('uId');

      // Navigate to login after signout
      this.router.navigate(['/login']);
    }).catch(err => {
      // Handle error
      alert(err.message);
    }));
  }




  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/varify-email']);
    }, err => {
      alert('Something went wrong');
    });
  }

  sendEmailForVarification(user: any) {
    user.sendEmailVerification().then(() => {
      this.router.navigate(['/varify-email']);
    }, (err: any) => {
      alert('Something went wrong. Not able to send mail to your email.');
    });
  }

  googleSignIn() {
    return this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(res => {
      this.router.navigate(['/dashboard']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
    }, err => {
      alert(err.message);
    });
  }



  updateUserProfile(groupCreaterUid: any, user: any): Promise<any> {
    return this.firestore.collection('users').doc(groupCreaterUid).update({
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      profileImageUrl: user.profileImageUrl
    }).then(() => {
      console.log('User profile updated successfully.');
      return { success: true, message: 'Profile updated successfully' };
    }).catch(error => {
      console.error('Error updating user profile: ', error);
      return { success: false, message: 'Error updating profile', error: error };
    });
  }

}