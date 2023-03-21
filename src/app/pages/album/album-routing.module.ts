import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AlbumDetailComponent } from "./album-detail";
import { AlbumListComponent } from "./album-list";
import { AuthGuard, CanDeactivateGuard } from "src/app/services";

const routes: Routes = [
  { path: "", component: AlbumListComponent },
  // { path: 'create', component: AlbumDetailComponent },
  { path: "display/:id", component: AlbumDetailComponent },
  {
    path: "change/:id",
    canActivate: [AuthGuard],
    component: AlbumDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlbumRoutingModule {}
