import { Client2Page } from './app.po';

describe('client2 App', function() {
  let page: Client2Page;

  beforeEach(() => {
    page = new Client2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
