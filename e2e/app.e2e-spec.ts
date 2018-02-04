import { Lode3Page } from './app.po';

describe('lode3 App', () => {
  let page: Lode3Page;

  beforeEach(() => {
    page = new Lode3Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to l3!!');
  });
});
