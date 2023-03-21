import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
  TestingDependsModule,
  getTranslocoModule,
  FakeDataHelper,
} from "src/testing/";
import { AlbumListComponent } from "./album-list.component";
import { OdataService } from "src/app/services";
import { of } from "rxjs";

describe("AlbumListComponent", () => {
  let component: AlbumListComponent;
  let fixture: ComponentFixture<AlbumListComponent>;
  let fakeData: FakeDataHelper;
  let odataService: any;
  let getAlbumsSpy: any;

  beforeAll(() => {
    fakeData = new FakeDataHelper();
    fakeData.buildCurrentUser();

    odataService = jasmine.createSpyObj("OdataService", ["getAlbums"]);
    getAlbumsSpy = odataService.getAlbums.and.returnValue(of([]));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingDependsModule, getTranslocoModule()],
      declarations: [AlbumListComponent],
      providers: [{ provide: OdataService, useValue: odataService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
