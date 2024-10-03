import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-friend-view',
  templateUrl: './friend-view.component.html',
  styleUrls: ['./friend-view.component.css']
})
export class FriendViewComponent implements OnInit {
  @Input() friend: any;
  constructor() { }

  ngOnInit(): void {
  }

}
