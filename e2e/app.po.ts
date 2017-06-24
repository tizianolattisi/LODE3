import { browser, by, element } from 'protractor';

export class Lode3Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('l3-root h1')).getText();
  }
}
