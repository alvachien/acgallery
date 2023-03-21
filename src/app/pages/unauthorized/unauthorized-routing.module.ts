import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UnauthorizedComponent } from "./unauthorized.component";

const routes: Routes = [{ path: "", component: UnauthorizedComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnauthorizedRoutingModule {}
