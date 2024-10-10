import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { from, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) { }

  // ---------------------------------------group-------------------------------------------------------------

  addGroup(groupData: any): Observable<any> {
    // console.log('groupData------', groupData);
    return new Observable(observer => {
      const groupPayload = {
        ...groupData,
        createdAt: new Date()
      };

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


  uploadImage(file: File, filePath: string): Observable<string> {
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, file);

    return new Observable(observer => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            observer.next(downloadURL);
            observer.complete();
          });
        })
      ).subscribe();
    });
  }


  public getGroups(groupCreaterUid: any): Observable<any[]> {
    return this.db.collection('Groups', ref => ref.where('groupCreaterUid', '==', groupCreaterUid))
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


  addFriendsWithIds(groupId: string, members: string[], groupTitle: any, groupCreatedBy: any, groupCreaterUid: any): Observable<any> {
    return new Observable(observer => {
      const updatedMembers: any[] = [];
      const batch = this.db.firestore.batch();

      members.forEach(memberName => {
        const friendRef = this.db.firestore.collection('Friends').doc();

        batch.set(friendRef, {
          groupId,
          groupTitle,
          memberName,
          addedAt: new Date(),
          groupCreaterUid: groupCreaterUid,
          groupCreatedBy: groupCreatedBy,
        });

        updatedMembers.push({
          memberName: memberName,
          memberId: friendRef.id
        });
      });

      batch.commit()
        .then(() => {
          console.log('Friends added successfully with IDs');
          observer.next(updatedMembers);
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



  updateGroupMembers(groupId: string, updatedMembers: any[]) {
    this.db.collection('Groups').doc(groupId).update({
      members: updatedMembers,
      groupId: groupId
    })
      .then(() => {
        console.log('Group members updated with IDs');
      })
      .catch((error: any) => {
        console.error('Error updating group members with IDs:', error);
      });
  }


  public getFriends(groupCreaterUid: any): Observable<any[]> {
    return this.db.collection('Friends', ref => ref.where('groupCreaterUid', '==', groupCreaterUid))
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


  addExpense(expenseData: any): Observable<any> {
    // console.log('groupData------', expenseData);
    return new Observable(observer => {
      const expensesPayload = {
        ...expenseData,
        createdAt: new Date()
      };

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

  public getExpenses(groupCreaterUid: any): Observable<any[]> {
    return this.db.collection('Expenses', ref => ref.where('groupCreaterUid', '==', groupCreaterUid))
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

    // console.log('groupId******', groupId);
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
          return throwError(error);
        })
      );
  }

  public getExpensesByMemberId(memberId: string): Observable<any[]> {

    return this.db.collection('Expenses').snapshotChanges()
      .pipe(
        map(actions => {

          return actions.map(action => {
            const data = action.payload.doc.data();
            const id = action.payload.doc.id;

            // console.log('data%%%%%%%%%%', data);

            const isMemberPresentInWithYou = (data as any).withYou && (data as any).withYou.includes(memberId);

            // console.log('isMemberPresentInWithYou%%%%%%%%%%', isMemberPresentInWithYou);

            if (isMemberPresentInWithYou) {
              return { id, ...(data as object) };
            }

            return null;
          }).filter(expense => expense !== null);
        }),
        catchError(error => {
          console.error('Error fetching expenses by memberId:', error);
          return throwError(error);
        })
      );
  }





  deleteExpenseById(expenseId: string): Observable<void> {
    const deletePromise = this.db.collection('Expenses').doc(expenseId).delete();
    return from(deletePromise);
  }


  // ---------------------------------balance-------------------------------------------------------------------------------

  calculateBalancesForGroup(groupId: string): void {
    this.db.collection('Groups').doc(groupId).get().subscribe((groupSnapshot: any) => {
      const groupData = groupSnapshot.data();
      const members = groupData.members;

      const memberBalances: any = {};
      members.forEach((member: any) => {
        memberBalances[member.memberId] = {
          balance: {},
          memberName: member.memberName,
        };

        members.forEach((otherMember: any) => {
          if (member.memberId !== otherMember.memberId) {
            memberBalances[member.memberId].balance[otherMember.memberId] = 0;
          }
        });
      });

      this.db.collection('Expenses', ref => ref.where('groupId', '==', groupId)).get().subscribe((expensesSnapshot: any) => {
        const expenses = expensesSnapshot.docs.map((doc: any) => doc.data());

        expenses.forEach((expense: any) => {
          const totalAmount = parseFloat(expense.amount);
          const payersData = expense.payersData || [];
          const participants = expense.withYou || [];

          const numParticipants = participants.length;
          const sharePerPerson = totalAmount / numParticipants;

          payersData.forEach((payer: any) => {
            const payerId = payer.memberId;
            const paidAmount = parseFloat(payer.amount);
            const isCreator = payer.groupCreater || false;

            if (!memberBalances[payerId]) {
              console.error(`Payer with ID ${payerId} not found in memberBalances`);
              return;
            }

            const shareOfThisPayer = paidAmount / numParticipants;

            participants.forEach((participantId: any) => {
              if (payerId !== participantId) {
                memberBalances[payerId].balance[participantId] += shareOfThisPayer;

                memberBalances[participantId].balance[payerId] -= shareOfThisPayer;

                if (isCreator) {
                  memberBalances[payerId].groupCreater = true;
                  console.log(`Group creator ${payer.memberName} has paid and is now patched into balances.`);
                }
              }
            });
          });
        });

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
          return throwError(error);
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
          return throwError(error);
        })
      );
  }


  public getUserData(userId: string): Observable<any> {
    return this.db.collection('users').doc(userId)
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data();
          const id = action.payload.id;
          return { id, ...(data as object) };
        }),
        catchError(error => {
          console.error('Error fetching User by document id:', error);
          return throwError(error);
        })
      );
  }



  calculateBalancesForExpense(groupId: string, expenseId: string): void {
    // console.log('groupId: string, expenseId: string', groupId, expenseId);

    this.db.collection('Groups').doc(groupId).get().subscribe((groupSnapshot: any) => {
      const groupData = groupSnapshot.data();
      const members = groupData.members;

      const memberBalances: any = {};
      members.forEach((member: any) => {
        memberBalances[member.memberId] = {
          balance: {},
          memberName: member.memberName,
          groupCreater: member.groupCreater || false
        };

        members.forEach((otherMember: any) => {
          if (member.memberId !== otherMember.memberId) {
            memberBalances[member.memberId].balance[otherMember.memberId] = 0;
          }
        });
      });

      this.db.collection('Expenses').doc(expenseId).get().subscribe((expenseSnapshot: any) => {
        const expense = expenseSnapshot.data();

        const totalAmount = parseFloat(expense.amount);
        const payersData = expense.payersData || [];
        const participants = expense.withYou || [];

        const numParticipants = participants.length;
        const sharePerPerson = totalAmount / numParticipants;

        payersData.forEach((payer: any) => {
          const payerId = payer.memberId;
          const paidAmount = parseFloat(payer.amount);

          if (!memberBalances[payerId]) {
            console.error(`Payer with ID ${payerId} not found in memberBalances`);
            return;
          }

          participants.forEach((participantId: any) => {
            if (payerId !== participantId) {
              const shareOfThisPayer = (paidAmount / numParticipants);
              memberBalances[payerId].balance[participantId] += shareOfThisPayer;
              memberBalances[participantId].balance[payerId] -= shareOfThisPayer;
            }
          });
        });

        this.db.collection('Expenses').doc(expenseId).update({
          calculatedBalances: memberBalances
        }).then(() => {
          console.log("Balances calculated and stored in the expense document successfully!");
        }).catch(err => {
          console.error("Error updating the expense document: ", err);
        });
      });
    });
  }




}