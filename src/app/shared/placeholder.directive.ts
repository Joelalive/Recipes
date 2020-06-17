import { Directive, ViewContainerRef } from '@angular/core';
import { Direct } from 'protractor/built/driverProviders';

@Directive({
  selector: '[appPlaceholder]'
})

export class PlaceHolderDirective {

  constructor(public viewContainerRef: ViewContainerRef) {}

}
