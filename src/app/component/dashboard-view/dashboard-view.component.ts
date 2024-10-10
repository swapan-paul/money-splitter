import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {
  @Input() allGroup: any;

  totalBalances: any[] = [];
  youOwe: number = 0;
  youAreOwed: number = 0;
  debts: any[] = [];
  credits: any[] = [];
  balanceData: any;
  memberList: any;
  groupCreaterUid: any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.groupCreaterUid = localStorage.getItem('uId') || '';

  }

  fetchAndCalculateGroupBalances(groupId: string): void {
    this.dataService.getBalanceByGroupId(groupId).subscribe({
      next: (data) => {
        // console.log('Balance data for groupId:', data);
        this.calculateBalancesForGroup(data);
      },
      error: (error) => {
        console.error('Error fetching balance data:', error);
      }
    });
  }


  getMemberListFromBalances(group: any): any[] {
    const memberBalances = group.memberBalances;
    const memberList: any[] = [];

    if (!memberBalances || typeof memberBalances !== 'object') {
      console.error(`Invalid member balances for groupId: ${group.id}`, memberBalances);
      return memberList;
    }

    Object.keys(memberBalances).forEach(memberId => {
      const memberData = memberBalances[memberId];

      if (!memberData || typeof memberData !== 'object' || !memberData.balance) {
        console.warn(`Invalid member data or balance for memberId: ${memberId}`, memberData);
        return;
      }

      const memberName = memberData.memberName;
      const balances = memberData.balance;

      memberList.push({
        memberId,
        memberName,
        balances
      });
    });

    return memberList;
  }


  calculateBalancesForGroup(group: any): void {
    const groupId = group.id;
    const memberBalances = group.memberBalances;
    this.memberList = this.getMemberListFromBalances(group);


    if (!memberBalances || typeof memberBalances !== 'object') {
      console.error(`Invalid member balances for groupId: ${groupId}`, memberBalances);
      return;
    }

    this.totalBalances[groupId] = {
      youOwe: 0,
      youAreOwed: 0,
      debts: [],
      credits: [],
      groupTotalBalance: 0,
      netBalances: {}
    };

    Object.keys(memberBalances).forEach(memberId => {
      const memberData = memberBalances[memberId];

      if (!memberData || typeof memberData !== 'object' || !memberData.balance) {
        console.warn(`Invalid member data or balance for memberId: ${memberId}`, memberData);
        return;
      }

      const memberName = memberData.memberName;
      const balances = memberData.balance;

      let totalOwes = 0;
      let totalOwed = 0;

      Object.keys(balances).forEach(otherMemberId => {
        const amount = balances[otherMemberId];
        if (amount > 0) {
          totalOwed += amount;
        } else if (amount < 0) {
          totalOwes -= amount;
        }
      });

      const netBalance = totalOwed - totalOwes;

      this.totalBalances[groupId].netBalances[memberId] = netBalance;

      if (totalOwed > 0) {
        this.totalBalances[groupId].credits.push({
          memberName: memberName,
          amount: totalOwed,
          details: [`is owed INR ${totalOwed.toFixed(2)}`]
        });
        this.totalBalances[groupId].youAreOwed += totalOwed;
        this.totalBalances[groupId].groupTotalBalance += totalOwed;
      }

      if (totalOwes > 0) {
        this.totalBalances[groupId].debts.push({
          memberName: memberName,
          amount: totalOwes,
          details: [`owes INR ${totalOwes.toFixed(2)}`]
        });
        this.totalBalances[groupId].youOwe += totalOwes;
        this.totalBalances[groupId].groupTotalBalance -= totalOwes;
      }
    });
  }


  displayBalancesForGroup(groupId: any): string[] {
    const groupBalance = this.totalBalances[groupId];
    if (!groupBalance) return [];

    const balancesArray: string[] = [];

    Object.keys(groupBalance.netBalances).forEach(memberId => {
      const netAmount = groupBalance.netBalances[memberId];
      const memberName = this.getMemberNameById(memberId);

      if (netAmount < 0) {
        balancesArray.push(`${memberName} owes INR ${Math.abs(netAmount).toFixed(2)}`);
      } else if (netAmount > 0) {
        balancesArray.push(`${memberName} is lent INR ${netAmount.toFixed(2)}`);
      } else {
        balancesArray.push(`${memberName} has no balance`);
      }
    });

    return balancesArray;
  }

  getMemberNameById(memberId: string): string {
    const memberData = this.memberList.find((member: any) => member.memberId === memberId);
    return memberData ? memberData.memberName : 'Unknown Member';
  }



  getMemberIds(memberBalances: any): string[] {
    return Object.keys(memberBalances);
  }

  getMemberName(memberId: string, memberBalances: any): string {
    return memberBalances[memberId].memberName || 'Unknown Member';
  }

  getGroupCreatorId(group: any): string {
    return group.groupCreator;
  }
}
