import { Ng2D3Page } from './app.po';

describe('ng2-d3 App', function() {
  let page: Ng2D3Page;

  beforeEach(() => {
    page = new Ng2D3Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
