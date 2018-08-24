import { Component, OnInit } from '@angular/core';
import { AuthService, UserDetailService } from '../services';
import { LogLevel, UserDetail, UIMode, UIDisplayStringUtil } from '../model';
import { environment } from '../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'acgallery-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  userDetailInfo: UserDetail;
  userName: string;
  authValues: any[];
  private _uiMode: UIMode;

  get isFieldChangable(): boolean {
    return this._uiMode !== UIMode.Display;
  }

  constructor(private _authService: AuthService,
    private _userdetailService: UserDetailService,
    private _router: Router,
  ) {
    if (environment.LoggingLevel >= LogLevel.Debug) {
      console.log('ACGallery [Debug]: Entering constructor of UserDetailComponent.');
    }

    this._authService.userLoadededEvent.subscribe(() => {
      this.setUserInfo();
    });

    if (this._userdetailService.InfoLoaded) {
      this.userDetailInfo = this._userdetailService.UserDetailInfo;
      this._uiMode = UIMode.Display;
    } else {
      this.userDetailInfo = new UserDetail();
      this._uiMode = UIMode.Create;
      this.userDetailInfo.userId = this._authService.authSubject.getValue().getUserID();
    }
    this.userName = this._authService.authSubject.getValue().getUserName();

    this.authValues = UIDisplayStringUtil.getUserOperationAuthDisplayStrings();
   }

  ngOnInit(): void {
  }

  public onSubmit() {
    if (this._uiMode === UIMode.Create || this._uiMode === UIMode.Change) {
      this._userdetailService.saveDetailInfo(this.userDetailInfo).subscribe(() => {
        // Navigate to initial screen
        this._router.navigate(['/']);
      });
    }
  }

  private setUserInfo() {
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
}
