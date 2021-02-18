import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditsRoutingModule } from './credits-routing.module';
import { CreditsComponent } from './';
import { UIModulesModule } from 'src/app/ui-modules.module';


@NgModule({
  declarations: [
    CreditsComponent
  ],
  imports: [
    CommonModule,
    CreditsRoutingModule,
    UIModulesModule,
  ]
})
export class CreditsModule { }
