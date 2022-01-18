import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-validationlist',
  templateUrl: './validationlist.component.html',
  styleUrls: ['./validationlist.component.scss'],
})
export class ValidationlistComponent implements OnInit {
  @Input('msg') msg: string = '';

  constructor() {}

  ngOnInit(): void {}
}
