import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditsComponent } from './';

const routes: Routes = [
  { path: '', component: CreditsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditsRoutingModule { }
