import {
  Component,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
  HostListener
} from '@angular/core';
import {ILanguage} from "../../interfaces/ILanguage";
import {Metadata} from "../../models/Metadata";

@Component({
  selector: 'app-symbols',
  templateUrl: './symbols.component.html',
  styleUrls: ['./symbols.component.scss']
})
export class SymbolsComponent implements OnChanges {
  @Input() language: ILanguage;
  @Input() disabled: boolean;
  @Output() symbol = new EventEmitter<string>();
  symbols: string[];
  shiftPressed: boolean;
  shiftWasPressed: boolean;
  altPressed: boolean;
  numberStore: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.language?.currentValue) {
      this.symbols = Metadata.symbols.find(s => s.lang.id === this.language.id)?.letters;
    }
  }

  @HostListener('document:keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    this.altPressed = event.getModifierState('Alt');
    this.shiftPressed = event.getModifierState('Shift');
    this.shiftWasPressed = event.getModifierState('Shift');

    const digits = '0123456789';
    const match = event.code.match(/\d{1}/);
    const digit = match && match[0];

    if (digit && digits.includes(digit) && this.altPressed) {
      this.numberStore += digit;
    }
  }

  @HostListener('document:keyup', ['$event'])
  private onKeyUp(event: KeyboardEvent) {
    this.altPressed = event.getModifierState('Alt');

    if (this.numberStore && !this.altPressed) {
      const index = +this.numberStore - 1;
      const symbol = this.symbols[index]
        ? this.shiftPressed
          ? this.symbols[index].toUpperCase()
          : this.symbols[index]
        : '';

      console.log(this.shiftPressed);

      this.symbol.emit(symbol);
      this.numberStore = '';
    }

    setTimeout(() => {
      this.shiftPressed = event.getModifierState('Shift');
    }, 100);
  }

  emitLetter(symbol: string) {
    this.symbol.emit(this.shiftPressed ? symbol.toUpperCase() : symbol)
  }
}
