import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UIInfoService {
    private albumIDforPhotoSeaching?: number;
    private albumAccessCodeforPhotoSearching?: string;
    private albumTitleforPhotoSearching?: string;

    get AlbumIDForPhotoSearching(): number {
        return this.albumIDforPhotoSeaching;
    }
    set AlbumIDForPhotoSearching(aid: number) {
        this.albumIDforPhotoSeaching = aid;
    }
    get AlbumInfoForPhotoSearching(): string {
        return this.albumAccessCodeforPhotoSearching;
    }
    set AlbumInfoForPhotoSearching(ainfo: string) {
        this.albumAccessCodeforPhotoSearching = ainfo;
    }
    get AlbumTitleForPhotoSearching(): string {
        return this.albumTitleforPhotoSearching;
    }
    set AlbumTitleForPhotoSearching(title: string) {
        this.albumTitleforPhotoSearching = title;
    }
}

