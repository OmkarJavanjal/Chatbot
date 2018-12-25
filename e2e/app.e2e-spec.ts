import { ChatbotPage } from './app.po';

describe('chatbot App', () => {
  let page: ChatbotPage;

  beforeEach(() => {
    page = new ChatbotPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
