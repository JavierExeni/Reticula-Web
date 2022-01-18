import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  template: `
    <app-header></app-header>
    <main class="m-5">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class PrincipalComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
