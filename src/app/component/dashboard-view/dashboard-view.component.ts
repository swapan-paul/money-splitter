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

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // Call this for each group on initialization if needed
    // Example: this.fetchAndCalculateGroupBalances('someGroupId');
  }

  fetchAndCalculateGroupBalances(groupId: string): void {
    this.dataService.getBalanceByGroupId(groupId).subscribe({
      next: (data) => {
        console.log('Balance data for groupId:', data);
        this.calculateBalancesForGroup(data); // Calculate balances for the fetched group
      },
      error: (error) => {
        console.error('Error fetching balance data:', error);
      }
    });
  }


  getMemberListFromBalances(group: any): any[] {
    const memberBalances = group.memberBalances; // Access the member balances from the group
    const memberList: any[] = []; // Initialize an empty array for the member list

    // Check if memberBalances exists and is an object before proceeding
    if (!memberBalances || typeof memberBalances !== 'object') {
      console.error(`Invalid member balances for groupId: ${group.id}`, memberBalances);
      return memberList; // Return an empty array if data is invalid
    }

    // Iterate through each member in memberBalances
    Object.keys(memberBalances).forEach(memberId => {
      const memberData = memberBalances[memberId];

      // Ensure memberData and balances exist and are valid
      if (!memberData || typeof memberData !== 'object' || !memberData.balance) {
        console.warn(`Invalid member data or balance for memberId: ${memberId}`, memberData);
        return; // Skip this iteration if data is invalid
      }

      const memberName = memberData.memberName;
      const balances = memberData.balance;

      // Push member info to the memberList
      memberList.push({
        memberId,
        memberName,
        balances
      });
    });

    return memberList; // Return the constructed member list
  }


  calculateBalancesForGroup(group: any): void {
    const groupId = group.id;
    const memberBalances = group.memberBalances;
    this.memberList = this.getMemberListFromBalances(group);
    console.log('this.memberList&&group!!!!!!!!!!!!!&&&&&&&&', group)
    console.log('this.memberList&&&&&&!!!!!!!!!!!!!!!&&&&&&&&', this.memberList)


    // Check if memberBalances exists and is an object before proceeding
    if (!memberBalances || typeof memberBalances !== 'object') {
      console.error(`Invalid member balances for groupId: ${groupId}`, memberBalances);
      return;
    }

    // Initialize group-specific balance objects
    this.totalBalances[groupId] = {
      youOwe: 0,
      youAreOwed: 0,
      debts: [],
      credits: [],
      groupTotalBalance: 0,
      netBalances: {} // Store net balances for each member
    };

    // Iterate through each member in the memberBalances
    Object.keys(memberBalances).forEach(memberId => {
      const memberData = memberBalances[memberId];

      // Ensure memberData and balances exist and are valid
      if (!memberData || typeof memberData !== 'object' || !memberData.balance) {
        console.warn(`Invalid member data or balance for memberId: ${memberId}`, memberData);
        return; // Skip this iteration if data is invalid
      }

      const memberName = memberData.memberName;
      const balances = memberData.balance;

      let totalOwes = 0;
      let totalOwed = 0;

      // Calculate owed amounts and debts with other members
      Object.keys(balances).forEach(otherMemberId => {
        const amount = balances[otherMemberId];
        if (amount > 0) {
          totalOwed += amount; // The member is owed this amount
        } else if (amount < 0) {
          totalOwes -= amount; // The member owes this amount
        }
      });

      // Calculate net balance
      const netBalance = totalOwed - totalOwes;

      // Store net balance in totalBalances
      this.totalBalances[groupId].netBalances[memberId] = netBalance;

      // Update total balances based on whether the member owes or is owed money
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
    const groupBalance = this.totalBalances[groupId]; // Get the balance for the specific group
    if (!groupBalance) return []; // Return empty array if no balances found for this group

    const balancesArray: string[] = [];

    // Iterate through netBalances to show consolidated results
    Object.keys(groupBalance.netBalances).forEach(memberId => {
      const netAmount = groupBalance.netBalances[memberId];
      const memberName = this.getMemberNameById(memberId); // Function to retrieve member name by ID

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

  // Example method to get member name by ID
  getMemberNameById(memberId: string): string {

    console.log('this.memberList&&&&&&&&&&&&&&', this.memberList)
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
