const TemplateEngine = require('../src/services/templateEngine');

describe('TemplateEngine', () => {
  it('interpolates variables', () => {
    const html = TemplateEngine._interpolate('<p>Hello {{name}}</p>', { name: 'World' });
    expect(html).toBe('<p>Hello World</p>');
  });
});
