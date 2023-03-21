import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";

import { AlbumRoutingModule } from "./album-routing.module";
import { AlbumListComponent } from "./album-list/album-list.component";
import { AlbumDetailComponent } from "./album-detail/album-detail.component";
import { UIModulesModule } from "src/app/ui-modules.module";
import { PhotoCommonModule } from "../photo-common/photo-common.module";
import { AlbumCommonModule } from "../album-common/album-common.module";

@NgModule({
  declarations: [AlbumListComponent, AlbumDetailComponent],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    UIModulesModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
    PhotoCommonModule,
    AlbumCommonModule,
  ],
})
export class AlbumModule {}
