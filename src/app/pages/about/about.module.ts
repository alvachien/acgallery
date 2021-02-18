import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { UIModulesModule } from 'src/app/ui-modules.module';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
  declarations: [
    AboutComponent
  ],
  imports: [
    CommonModule,
    UIModulesModule,
    AboutRoutingModule
  ]
})
export class AboutModule { }
