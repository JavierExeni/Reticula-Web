import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Cliente } from '../../models/clientes';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
  @Output() onDebounce: EventEmitter<string> = new EventEmitter();
  @Input() termino: string = '';
  @Input() disabled: boolean = false;
  @Input() titulo: string = '';

  debouncer: Subject<string> = new Subject();

  //termino: string = '';

  constructor() {}

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(300)).subscribe((valor) => {
      this.onDebounce.emit(valor);
    });
  }

  teclaPresionada() {
    this.debouncer.next(this.termino);
  }
}
