import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { NgbAccordionModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = 'assets/logo/profile.png';
  selectedFile: File | null = null;
  groupCreaterUid: any;

  editMode: any = {
    username: false,
    email: false,
    mobile: false,
    password: false
  };

  user: any = {
    username: 'swapan paul',
    email: 'swapanpaul5656@gmail.com',
    mobile: '9876543210',
    password: 'password123',
    profileImageUrl: 'assets/logo/profile.png'
  };

  constructor(
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private router: Router,
    private activeModal: NgbActiveModal,
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.pattern('^[0-9]{10,15}$')]],
    });
  }

  ngOnInit(): void {
    this.groupCreaterUid = localStorage.getItem('uId') || '';
  }

  toggleEdit(field: string) {
    this.editMode[field] = !this.editMode[field];
  }

  onFileChange(event: any) {
    const reader = new FileReader();
    const file = event.target.files && event.target.files.length ? event.target.files[0] : null;

    if (file) {
      this.selectedFile = file;
      this.uploadProfileImage(this.selectedFile);
      reader.onload = () => {
        this.profileImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected.');
    }
  }


  saveChanges() {
    if (this.selectedFile) {
      this.uploadProfileImage(this.selectedFile);
    } else {
      this.updateUserProfile();
    }
  }

  uploadProfileImage(file: File | null) {
    if (file) {
      const filePath = `profile-images/${this.groupCreaterUid}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.user.profileImageUrl = url;
            this.updateUserProfile();
          });
        })
      ).subscribe();
    } else {
      console.error('No file selected for upload.');
    }
  }


  updateUserProfile() {
    this.authService.updateUserProfile(this.groupCreaterUid, this.user)
      .then((res: any) => {
        if (res.success) {
          this.resetEditMode();
          console.log(res.message);
        } else {
          console.error(res.message);
        }
      })
      .catch((error) => {
        console.error('Unexpected error: ', error);
      });

  }

  resetEditMode() {
    this.editMode = {
      username: false,
      email: false,
      mobile: false,
      password: false
    };
  }

  isEditing() {
    return Object.values(this.editMode).some(edit => edit === true);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
      this.activeModal.dismiss();
    });
  }
}
