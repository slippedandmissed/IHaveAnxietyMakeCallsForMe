import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-text-input',
  templateUrl: './form-text-input.component.html',
  styleUrls: ['./form-text-input.component.scss']
})
export class FormTextInputComponent implements OnInit {

  constructor() { }

  @Input() multiline: boolean = false;
  @Input() label: string = "";
  @Input() placeholder: string = "";
  @Input() value: string = "";
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
  }

  onChange(event: string) {
    this.value=event;
    this.valueChange.emit(event);
  }

}
