import { Directive } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[routerLink], [routerLinkActive]',
})
export class RouterLinkStubDirective {}
