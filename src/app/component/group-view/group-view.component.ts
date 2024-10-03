import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.css']
})
export class GroupViewComponent implements OnInit {
  @Input() group: any;
  constructor() { }

  ngOnInit(): void {
  }

}
