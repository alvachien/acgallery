import { Component, OnInit } from '@angular/core';
import { AuthService, UserDetailService } from '../services';
import { LogLevel, UserDetail, UIMode } from '../model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'acgallery-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  userDetailInfo: UserDetail;
  userName: string;
  private _uiMode: UIMode;

  get isFieldChangable(): boolean {
    return this._uiMode !== UIMode.Display;
  }

  constructor(private _authService: AuthService,
    private _userdetailService: UserDetailService,
  ) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor of PhotoUploadComponent.');
    }

    if (this._userdetailService.InfoLoaded) {
      this.userDetailInfo = this._userdetailService.UserDetailInfo;
      this._uiMode = UIMode.Display;
    } else {
      this.userDetailInfo = new UserDetail();
      this._uiMode = UIMode.Create;
      this.userDetailInfo.userId = this._authService.authSubject.getValue().getUserID();
    }
    this.userName = this._authService.authSubject.getValue().getUserName();
   }

  ngOnInit() {
  }

  public onSubmit() {
    if (this._uiMode === UIMode.Create) {

    }
  }
}
