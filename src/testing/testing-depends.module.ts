import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { UIModulesModule } from 'src/app/ui-modules.module';

@NgModule({
  imports: [],
  exports: [
    HttpClientTestingModule,
    FormsModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    RouterTestingModule,
    UIModulesModule,
  ],
})
export class TestingDependsModule {}
