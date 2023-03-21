import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UIInfoService {
  private albumIDforPhotoSeaching?: number;
  private albumAccessCodeforPhotoSearching?: string;
  private albumTitleforPhotoSearching?: string;

  get AlbumIDForPhotoSearching(): number | undefined {
    return this.albumIDforPhotoSeaching;
  }
  set AlbumIDForPhotoSearching(aid: number | undefined) {
    this.albumIDforPhotoSeaching = aid;
  }
  get AlbumInfoForPhotoSearching(): string | undefined {
    return this.albumAccessCodeforPhotoSearching;
  }
  set AlbumInfoForPhotoSearching(ainfo: string | undefined) {
    this.albumAccessCodeforPhotoSearching = ainfo;
  }
  get AlbumTitleForPhotoSearching(): string | undefined {
    return this.albumTitleforPhotoSearching;
  }
  set AlbumTitleForPhotoSearching(title: string | undefined) {
    this.albumTitleforPhotoSearching = title;
  }
}
