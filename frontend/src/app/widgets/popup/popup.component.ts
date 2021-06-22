import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy {

  constructor() { }

  faTimes = faTimes;

  @Input() enabled: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.close();
  }

  close(): void {
    this.enabled = false;
    this.onClose.emit();
  }

}
