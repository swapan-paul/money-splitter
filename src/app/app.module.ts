import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { VarifyEmailComponent } from './component/varify-email/varify-email.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FileuploadComponent } from './component/fileupload/fileupload.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddExpenseModalComponent } from './component/add-expense-modal/add-expense-modal.component';
import { AddEditGroupComponent } from './component/add-edit-group/add-edit-group.component';
import { LoaderComponent } from './component/loader/loader.component';
import { PayerModalComponent } from './component/payer-modal/payer-modal.component';
import { DashboardViewComponent } from './component/dashboard-view/dashboard-view.component';
import { GroupViewComponent } from './component/group-view/group-view.component';
import { FriendViewComponent } from './component/friend-view/friend-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VarifyEmailComponent,
    FileuploadComponent,
    AddExpenseModalComponent,
    AddEditGroupComponent,
    LoaderComponent,
    PayerModalComponent,
    DashboardViewComponent,
    GroupViewComponent,
    FriendViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
