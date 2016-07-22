import { Injectable } from '@angular/core';

import { Album } from './album';
import { MockedAlbum } from './album.mockdata';

@Injectable()
export class AlbumService {
    getMockedData() {
        return Promise.resolve(MockedAlbum);
    }
}