import { GallerywebappPage } from './app.po';

describe('gallerywebapp App', function() {
  let page: GallerywebappPage;

  beforeEach(() => {
    page = new GallerywebappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
