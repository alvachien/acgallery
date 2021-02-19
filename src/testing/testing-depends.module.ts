import { NgModule } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { UIModulesModule } from 'src/app/ui-modules.module';
import { getTranslocoModule } from './transloco-testing.module';
import { TranslocoModule, TranslocoTestingModule } from '@ngneat/transloco';

@NgModule({
    imports: [
        TranslocoTestingModule.forRoot({
        }),
    ],
    exports: [
        HttpClientTestingModule,
        FormsModule,
        NoopAnimationsModule,
        TranslocoTestingModule,

        UIModulesModule,        
    ]
})
export class TestingDependsModule { }
