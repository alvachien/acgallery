import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './';
import { UIModulesModule } from 'src/app/ui-modules.module';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, NotFoundRoutingModule, UIModulesModule, TranslocoModule],
})
export class NotFoundModule {}
