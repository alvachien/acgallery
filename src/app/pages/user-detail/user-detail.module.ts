import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";

import { UIModulesModule } from "src/app/ui-modules.module";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserDetailRoutingModule } from "./user-detail-routing.module";

@NgModule({
  declarations: [UserDetailComponent],
  imports: [
    CommonModule,
    UserDetailRoutingModule,
    UIModulesModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UserDetailModule {}
