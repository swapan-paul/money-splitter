import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  // private cloudFunctionUrl = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendInviteEmail'; // Replace with your Cloud Function URL

  constructor() { }

  // // Method to send the invite email
  // sendInviteEmail(email: string): Observable<any> {
  //   const payload = { email: email };
  //   return this.http.post(this.cloudFunctionUrl, payload);
  // }
}
