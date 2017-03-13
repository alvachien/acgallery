import { GallerywebsrcPage } from './app.po';

describe('gallerywebsrc App', () => {
  let page: GallerywebsrcPage;

  beforeEach(() => {
    page = new GallerywebsrcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
