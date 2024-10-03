import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-add-edit-group',
  templateUrl: './add-edit-group.component.html',
  styleUrls: ['./add-edit-group.component.css']
})
export class AddEditGroupComponent implements OnInit {
  groupForm!: FormGroup;
  selectedImages: File[] = [];
  showImages: any[] = [];
  selectedGroup: any = '';
  hasChanges: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private loaderService: LoadingService,
    private dataService: DataService,
    
  ) { }

  ngOnInit(): void {
    console.log('selectedGroup==========', this.selectedGroup);

    this.groupForm = this.fb.group({
      groupTitle: [this.selectedGroup?.groupTitle || '', Validators.required],
      groupType: [this.selectedGroup?.groupType || '', Validators.required],
      members: this.fb.array([]),
    });

    this.populateMember();

    this.groupForm.valueChanges.subscribe(() => {
      this.hasChanges = this.isFormEdited();
    });
  }

  populateMember() {
    if (this.selectedGroup && this.selectedGroup.members) {
      this.selectedGroup.members.forEach((tech: string) => {
        this.members.push(this.createMemberNameControl(tech));
      });
    } else {
      this.members.push(this.createMemberNameControl());
    }
  }



  isFormEdited(): boolean {
    return (
      this.groupForm.get('groupTitle')?.value !== this.selectedGroup.groupTitle ||
      this.groupForm.get('groupType')?.value !== this.selectedGroup.groupType ||
      !this.areMemberSame()
    );
  }




  createMemberNameControl(memberName: string = ''): FormGroup {
    return this.fb.group({
      memberName: [memberName, Validators.required]
    });
  }

  get members(): FormArray {
    return this.groupForm.get('members') as FormArray;
  }

  addMemberName() {
    this.members.push(this.createMemberNameControl());
  }

  removeMemberName(index: number) {
    this.members.removeAt(index);
    this.hasChanges = this.isFormEdited() || this.selectedImages.length > 0 ;
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  editGroup() {
    console.log('this.groupForm--------->>', this.groupForm.value);

    const isFormChanged = this.isFormEdited();

    if (this.groupForm.valid && isFormChanged) {
      const uploadObservables: any[] = [];

      this.loaderService.show();

          const members = this.members.value.map((tech: any) => tech.memberName);
          const formData = {
            ...this.groupForm.value,
            members,
          };

          console.log('formData--------->>', formData);

          this.dataService.updateGroup(this.selectedGroup.id, formData).then(
            () => console.log('Group updated successfully'),
            (error:any) => console.error('Error while updating Group:', error)
          );
          this.loaderService.hide();

          this.closeModal();
        

        this.loaderService.hide();
      }
     else {
      console.log('No changes detected or form is invalid');
    }
  }
  



  onSubmit() {
    if (this.groupForm.valid) {

      console.log('Form is valid', this.groupForm.value);

      this.loaderService.show();

        const members = this.members.value.map((tech: any) => tech.memberName);
        const formData = {
          ...this.groupForm.value,
          members,
        };

        this.dataService.addGroup(formData).subscribe(
          (response:any) => {
            if (response.id){
              // this.addFriendsCollection(response.id, members, this.groupForm.value.groupTitle); // Pass the group id and members

              // If the group is added successfully, add friends and get their IDs
              this.dataService.addFriendsWithIds(response.id, members, this.groupForm.value.groupTitle).subscribe(
                (updatedMembers:any) => {
                  // After adding friends and getting their IDs, update the group with the updated members array
                  this.dataService.updateGroupMembers(response.id, updatedMembers);
                },
                (error: any) => {
                  console.error('Error while adding friends with IDs:', error);
                }
              );

              
            }
            console.log('Group added successfully:', response)},
          (error: any) => console.error('Error while adding group:', error)
        );
        this.loaderService.hide();

        this.closeModal();
    } else {
      console.log('Form is invalid');
    }
  }


  areMemberSame(): boolean {
    const formMember = this.members.value.map((tech: any) => tech.memberName);
    const originalMember = this.selectedGroup.members;

    if (formMember.length !== originalMember.length) {
      return false;
    }

    for (let i = 0; i < formMember.length; i++) {
      if (formMember[i] !== originalMember[i]) {
        return false;
      }
    }

    return true;
  }

  


}


