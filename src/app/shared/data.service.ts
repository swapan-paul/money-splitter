import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
// import { FileMetaData } from '../model/file-meta-data';
// import { Student } from '../model/student';
import { from, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // constructor(private afs : AngularFirestore, private fireStorage : AngularFireStorage) { }


  // // add student
  // addStudent(student : Student) {
  //   student.id = this.afs.createId();
  //   return this.afs.collection('/Students').add(student);
  // }

  // // get all students
  // getAllStudents() {
  //   return this.afs.collection('/Students').snapshotChanges();
  // }

  // // delete student
  // deleteStudent(student : Student) {
  //    this.afs.doc('/Students/'+student.id).delete();
  // }

  // // update student
  // updateStudent(student : Student) {
  //   this.deleteStudent(student);
  //   this.addStudent(student);
  // }



  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }


  // ---------------------------------------group-------------------------------------------------------------

  addGroup(groupData: any): Observable<any> {
    console.log('groupData------', groupData);
    return new Observable(observer => {
      // Add server timestamp and any other metadata
      const groupPayload = {
        ...groupData,
        createdAt: new Date() // Replace with serverTimestamp() if you prefer Firestore's server timestamp
      };

      // Add the group to the 'groups' collection
      this.db.collection('Groups').add(groupPayload)
        .then(docRef => {
          console.log('Group added successfully with ID:', docRef.id);
          observer.next({
            status: 200,
            message: 'Group added successfully',
            id: docRef.id,
            data: groupData
          });
          observer.complete();
        })
        .catch(error => {
          console.error('Error adding group:', error);
          observer.error({
            status: 400,
            message: 'Error adding group',
            error: error
          });
        });
    });
  }


  // Upload image to Firebase Storage and return the download URL
  uploadImage(file: File, filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Observable(observer => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          // Get the download URL after the upload is complete
          fileRef.getDownloadURL().subscribe(downloadURL => {
            observer.next(downloadURL);  // Emit the download URL
            observer.complete();
          });
        })
      ).subscribe();
    });
  }


  public getGroups(): Observable<any[]> {
    return this.db.collection('Groups')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...(typeof data === 'object' && data !== null ? data : {}) };
        }))
      );
  }

  public deleteGroup(groupId: string): Observable<void> {
    return from(this.db.collection('Groups').doc(groupId).delete());
  }

  updateGroup(groupId: string, formData: any): Promise<void> {
    return this.db.collection('Groups').doc(groupId).update(formData);
  }


// -------------------------------friend-----------------------------------------------------------------



  // addFriends(friendsData: any[]): Observable<any> {
  //   return new Observable(observer => {
  //     const batch = this.db.firestore.batch();

  //     friendsData.forEach(friend => {
  //       const friendRef = this.db.collection('Friends').doc().ref; // Create a new document for each friend
  //       batch.set(friendRef, friend);  // Add the friend data to the batch
  //     });

  //     batch.commit()
  //       .then(() => {
  //         console.log('Friends added successfully');
  //         observer.next({
  //           status: 200,
  //           message: 'Friends added successfully'
  //         });
  //         observer.complete();
  //       })
  //       .catch(error => {
  //         console.error('Error adding friends:', error);
  //         observer.error({
  //           status: 400,
  //           message: 'Error adding friends',
  //           error: error
  //         });
  //       });
  //   });
  // }


  addFriendsWithIds(groupId: string, members: string[], groupTitle: any): Observable<any> {
    return new Observable(observer => {
      const updatedMembers: any[] = [];
      const batch = this.db.firestore.batch();  // Direct Firestore batch operation

      members.forEach(memberName => {
        const friendRef = this.db.firestore.collection('Friends').doc(); // Direct Firestore DocumentReference

        batch.set(friendRef, {
          groupId,
          groupTitle,
          memberName,
          addedAt: new Date()  // Timestamp for when the friend was added
        });

        // Push the member object with ID into the updatedMembers array
        updatedMembers.push({
          memberName: memberName,
          memberId: friendRef.id  // Get the generated Firestore document ID
        });
      });

      // Commit the batch
      batch.commit()
        .then(() => {
          console.log('Friends added successfully with IDs');
          observer.next(updatedMembers); // Send the updated members array back with IDs
          observer.complete();
        })
        .catch(error => {
          console.error('Error adding friends with IDs:', error);
          observer.error({
            status: 400,
            message: 'Error adding friends with IDs',
            error: error
          });
        });
    });
  }



  // Method to update the group with members including IDs
  updateGroupMembers(groupId: string, updatedMembers: any[]) {
    this.db.collection('Groups').doc(groupId).update({
      members: updatedMembers ,
      groupId: groupId // Update the group document with the new members array containing member IDs
    })
      .then(() => {
        console.log('Group members updated with IDs');
      })
      .catch((error: any) => {
        console.error('Error updating group members with IDs:', error);
      });
  }


  public getFriends(): Observable<any[]> {
    return this.db.collection('Friends')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...(typeof data === 'object' && data !== null ? data : {}) };
        }))
      );
  }

    


// --------------------------Expenses---------------------------------------------------------------------------


addExpense(expenseData: any): Observable < any > {
  console.log('groupData------', expenseData);
  return new Observable(observer => {
    // Add server timestamp and any other metadata
    const expensesPayload = {
      ...expenseData,
      createdAt: new Date() // Replace with serverTimestamp() if you prefer Firestore's server timestamp
    };

    // Add the group to the 'groups' collection
    this.db.collection('Expenses').add(expensesPayload)
      .then(docRef => {
        console.log('Expenses added successfully with ID:', docRef.id);
        observer.next({
          status: 200,
          message: 'Expenses added successfully',
          id: docRef.id,
          data: expenseData
        });
        observer.complete();
      })
      .catch(error => {
        console.error('Error adding expenses:', error);
        observer.error({
          status: 400,
          message: 'Error adding expenses',
          error: error
        });
      });
  });
}

  public getExpenses(): Observable<any[]> {
    return this.db.collection('Expenses')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...(typeof data === 'object' && data !== null ? data : {}) };
        }))
      );
  }



  public getExpensesByGroupId(groupId: any): Observable<any[]> {

    console.log('groupId******', groupId);
    return this.db.collection('Expenses', ref => ref.where('groupId', '==', groupId))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;
            return { id, ...(data as object) };
          });
        }),
        catchError(error => {
          console.error('Error fetching expenses by groupId:', error);
          return throwError(error);  // Handle errors here
        })
      );
  }


  deleteExpenseById(expenseId: string): Observable<void> {
    const deletePromise = this.db.collection('Expenses').doc(expenseId).delete();
    return from(deletePromise); // Convert Promise to Observable
  }


}