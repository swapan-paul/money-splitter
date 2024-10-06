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

 
  // ---------------------------------balance-------------------------------------------------------------------------------
  
  // calculateBalancesForGroup(groupId: string): void {
  //   // Step 1: Fetch group details and members
  //   this.db.collection('Groups').doc(groupId).get().subscribe((groupSnapshot: any) => {
  //     const groupData = groupSnapshot.data();
  //     const members = groupData.members;

  //     // Initialize member balances
  //     const memberBalances: any = {};
  //     members.forEach((member: any) => {
  //       // Initialize the member's balance object
  //       memberBalances[member.memberId] = {
  //         balance: {},  // Initialize as an empty object
  //         memberName: member.memberName,
  //       };

  //       // Ensure balance is initialized between each member
  //       members.forEach((otherMember: any) => {
  //         if (member.memberId !== otherMember.memberId) {
  //           memberBalances[member.memberId].balance[otherMember.memberId] = 0;  // Initialize balance between members
  //         }
  //       });
  //     });

  //     // Step 2: Fetch all expenses for the group
  //     this.db.collection('Expenses', ref => ref.where('groupId', '==', groupId)).get().subscribe((expensesSnapshot: any) => {
  //       const expenses = expensesSnapshot.docs.map((doc: any) => doc.data());

  //       // Step 3: Iterate through each expense and calculate balances
  //       expenses.forEach((expense: any) => {
  //         const totalAmount = parseFloat(expense.amount);
  //         const payersData = expense.payersData || [];
  //         const participants = expense.withYou || [];

  //         // Calculate how much each participant owes for the total expense
  //         const numParticipants = participants.length;
  //         const sharePerPerson = totalAmount / numParticipants;

  //         // Step 4: Distribute the amount each payer paid
  //         payersData.forEach((payer: any) => {
  //           const payerId = payer.memberId;
  //           const paidAmount = parseFloat(payer.amount);

  //           if (!memberBalances[payerId]) {
  //             console.error(`Payer with ID ${payerId} not found in memberBalances`);
  //             return;  // Skip if payer is not found
  //           }

  //           // Calculate each participant's share of this payer's contribution
  //           const shareOfThisPayer = paidAmount / numParticipants;

  //           participants.forEach((participantId: any) => {
  //             if (payerId !== participantId) {
  //               // Each participant owes this payer their share of this payer's contribution
  //               memberBalances[payerId].balance[participantId] += shareOfThisPayer;

  //               // Update participant's balance (they owe this payer)
  //               memberBalances[participantId].balance[payerId] -= shareOfThisPayer;
  //             }
  //           });
  //         });
  //       });

  //       // Step 5: Store balances in Firestore under 'balances' collection
  //       this.db.collection('Balances').doc(groupId).set({
  //         memberBalances
  //       }).then((balanceData) => {
  //         console.log("Balances calculated and stored successfully!", balanceData);
  //       }).catch(err => {
  //         console.error("Error storing balances: ", err);
  //       });
  //     });
  //   });
  // }


  calculateBalancesForGroup(groupId: string): void {
    // Step 1: Fetch group details and members
    this.db.collection('Groups').doc(groupId).get().subscribe((groupSnapshot: any) => {
      const groupData = groupSnapshot.data();
      const members = groupData.members;

      // Initialize member balances
      const memberBalances: any = {};
      members.forEach((member: any) => {
        // Initialize the member's balance object
        memberBalances[member.memberId] = {
          balance: {},  // Initialize as an empty object
          memberName: member.memberName,
        };

        // Ensure balance is initialized between each member
        members.forEach((otherMember: any) => {
          if (member.memberId !== otherMember.memberId) {
            memberBalances[member.memberId].balance[otherMember.memberId] = 0;  // Initialize balance between members
          }
        });
      });

      // Step 2: Fetch all expenses for the group
      this.db.collection('Expenses', ref => ref.where('groupId', '==', groupId)).get().subscribe((expensesSnapshot: any) => {
        const expenses = expensesSnapshot.docs.map((doc: any) => doc.data());

        // Step 3: Iterate through each expense and calculate balances
        expenses.forEach((expense: any) => {
          const totalAmount = parseFloat(expense.amount);
          const payersData = expense.payersData || [];
          const participants = expense.withYou || [];

          // Calculate how much each participant owes for the total expense
          const numParticipants = participants.length;
          const sharePerPerson = totalAmount / numParticipants;

          // Step 4: Distribute the amount each payer paid
          payersData.forEach((payer: any) => {
            const payerId = payer.memberId;
            const paidAmount = parseFloat(payer.amount);
            const isCreator = payer.groupCreater || false; // Check if payer is the group creator

            if (!memberBalances[payerId]) {
              console.error(`Payer with ID ${payerId} not found in memberBalances`);
              return;  // Skip if payer is not found
            }

            // Calculate each participant's share of this payer's contribution
            const shareOfThisPayer = paidAmount / numParticipants;

            participants.forEach((participantId: any) => {
              if (payerId !== participantId) {
                // Each participant owes this payer their share of this payer's contribution
                memberBalances[payerId].balance[participantId] += shareOfThisPayer;

                // Update participant's balance (they owe this payer)
                memberBalances[participantId].balance[payerId] -= shareOfThisPayer;

                // Special handling if the payer is the group creator
                if (isCreator) {
                  // Patch this payer into the balance object if they are the group creator
                  memberBalances[payerId].groupCreater = true;
                  console.log(`Group creator ${payer.memberName} has paid and is now patched into balances.`);
                }
              }
            });
          });
        });

        // Step 5: Store balances in Firestore under 'balances' collection
        this.db.collection('Balances').doc(groupId).set({
          memberBalances
        }).then((balanceData) => {
          console.log("Balances calculated and stored successfully!", balanceData);
        }).catch(err => {
          console.error("Error storing balances: ", err);
        });
      });
    });
  }







  public getAllBalance(): Observable<any[]> {

    return this.db.collection('Balances')
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


  public getBalanceByGroupId(groupId: string): Observable<any> {
    return this.db.collection('Balances').doc(groupId)
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data();
          const id = action.payload.id;
          return { id, ...(data as object) };
        }),
        catchError(error => {
          console.error('Error fetching balance by document id:', error);
          return throwError(error);  // Handle errors here
        })
      );
  }




  

  // calculateBalancesForExpense(groupId: string, expenseId: string): void {

  //   console.log('groupId: string, expenseId: string', groupId, expenseId);

  //   // Step 1: Fetch group details and members
  //   this.db.collection('Groups').doc(groupId).get().subscribe((groupSnapshot: any) => {
  //     const groupData = groupSnapshot.data();
  //     const members = groupData.members;

  //     // Initialize member balances
  //     const memberBalances: any = {};
  //     members.forEach((member: any) => {
  //       memberBalances[member.memberId] = {
  //         balance: {},  // Initialize as an empty object
  //         memberName: member.memberName,
  //         groupCreater: false  // Initialize as false for all members
  //       };

  //       // Ensure balance is initialized between each member
  //       members.forEach((otherMember: any) => {
  //         if (member.memberId !== otherMember.memberId) {
  //           memberBalances[member.memberId].balance[otherMember.memberId] = 0;  // Initialize balance between members
  //         }
  //       });
  //     });

  //     // Step 2: Fetch the specific expense by its ID
  //     this.db.collection('Expenses').doc(expenseId).get().subscribe((expenseSnapshot: any) => {
  //       const expense = expenseSnapshot.data();

  //       const totalAmount = parseFloat(expense.amount);
  //       const payersData = expense.payersData || [];
  //       const participants = expense.withYou || [];

  //       // Calculate how much each participant owes for the total expense
  //       const numParticipants = participants.length;
  //       const sharePerPerson = totalAmount / numParticipants;

  //       // Step 3: Distribute the amount each payer paid
  //       payersData.forEach((payer: any) => {
  //         const payerId = payer.memberId;
  //         const paidAmount = parseFloat(payer.amount);

  //         if (!memberBalances[payerId]) {
  //           console.error(`Payer with ID ${payerId} not found in memberBalances`);
  //           return;  // Skip if payer is not found
  //         }

  //         // Set the groupCreater flag for the payer if they are the creator
  //         if (payer.groupCreater) {
  //           memberBalances[payerId].groupCreater = true;
  //         }

  //         // Calculate each participant's share of this payer's contribution
  //         const shareOfThisPayer = paidAmount / numParticipants;

  //         participants.forEach((participantId: any) => {
  //           if (payerId !== participantId) {
  //             // Each participant owes this payer their share of this payer's contribution
  //             memberBalances[payerId].balance[participantId] += shareOfThisPayer;

  //             // Update participant's balance (they owe this payer)
  //             memberBalances[participantId].balance[payerId] -= shareOfThisPayer;
  //           }
  //         });
  //       });

  //       // Step 4: Update the expense document with the calculated balances
  //       this.db.collection('Expenses').doc(expenseId).update({
  //         calculatedBalances: memberBalances  // Add the balances object directly into the expense
  //       }).then(() => {
  //         console.log("Balances calculated and stored in the expense document successfully!");
  //       }).catch(err => {
  //         console.error("Error updating the expense document: ", err);
  //       });
  //     });
  //   });
  // }

  calculateBalancesForExpense(groupId: string, expenseId: string): void {
    console.log('groupId: string, expenseId: string', groupId, expenseId);

    // Step 1: Fetch group details and members
    this.db.collection('Groups').doc(groupId).get().subscribe((groupSnapshot: any) => {
      const groupData = groupSnapshot.data();
      const members = groupData.members;

      // Initialize member balances
      const memberBalances: any = {};
      members.forEach((member: any) => {
        memberBalances[member.memberId] = {
          balance: {}, // Initialize as an empty object
          memberName: member.memberName,
          groupCreater: member.groupCreater || false // Initialize group creator status
        };

        // Ensure balance is initialized between each member
        members.forEach((otherMember: any) => {
          if (member.memberId !== otherMember.memberId) {
            memberBalances[member.memberId].balance[otherMember.memberId] = 0; // Initialize balance between members
          }
        });
      });

      // Step 2: Fetch the specific expense by its ID
      this.db.collection('Expenses').doc(expenseId).get().subscribe((expenseSnapshot: any) => {
        const expense = expenseSnapshot.data();

        const totalAmount = parseFloat(expense.amount);
        const payersData = expense.payersData || [];
        const participants = expense.withYou || [];

        // Calculate how much each participant owes for the total expense
        const numParticipants = participants.length;
        const sharePerPerson = totalAmount / numParticipants;

        // Step 3: Distribute the amount each payer paid
        payersData.forEach((payer: any) => {
          const payerId = payer.memberId;
          const paidAmount = parseFloat(payer.amount);

          // Ensure payer is a participant
          if (!memberBalances[payerId]) {
            console.error(`Payer with ID ${payerId} not found in memberBalances`);
            return; // Skip if payer is not found
          }

          // Calculate how much each participant owes to this payer
          participants.forEach((participantId: any) => {
            if (payerId !== participantId) {
              // Each participant owes their share of the payer's contribution
              const shareOfThisPayer = (paidAmount / numParticipants);
              memberBalances[payerId].balance[participantId] += shareOfThisPayer; // This payer is owed this amount
              memberBalances[participantId].balance[payerId] -= shareOfThisPayer; // This participant owes this amount
            }
          });
        });

        // Step 4: Update the expense document with the calculated balances
        this.db.collection('Expenses').doc(expenseId).update({
          calculatedBalances: memberBalances // Add the balances object directly into the expense
        }).then(() => {
          console.log("Balances calculated and stored in the expense document successfully!");
        }).catch(err => {
          console.error("Error updating the expense document: ", err);
        });
      });
    });
  }




}