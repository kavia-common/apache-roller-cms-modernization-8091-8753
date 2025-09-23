'use strict';
const path = require('path');
const fs = require('fs');

/**
 * Simple file-based template loader with localization fallback.
 * Templates live under src/templates/{templateKey}/{locale}.html
 * or {templateKey}/default.html as fallback.
 */
class TemplateEngine {
  // PUBLIC_INTERFACE
  render(templateKey, locale, data) {
    /** Render a template for a given locale using {{var}} replacements.
     * - templateKey: logical template folder name
     * - locale: e.g., 'en', 'fr'
     * - data: object of variables
     * Returns: { subject, html }
     * SECURITY: Caller must ensure data is sanitized for HTML content.
     */
    const root = path.join(__dirname, '..', 'templates', templateKey);
    const localeHtml = path.join(root, `${locale}.html`);
    const defaultHtml = path.join(root, 'default.html');
    const subjectFile = path.join(root, 'subject.txt');

    let htmlPath = fs.existsSync(localeHtml) ? localeHtml : defaultHtml;
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`Template not found for key=${templateKey}`);
    }
    const subject = fs.existsSync(subjectFile) ? fs.readFileSync(subjectFile, 'utf-8') : `${templateKey}`;
    const html = fs.readFileSync(htmlPath, 'utf-8');

    const renderedSubject = this.interpolate(subject, data);
    const renderedHtml = this.interpolate(html, data);
    return { subject: renderedSubject, html: renderedHtml };
  }

  // PUBLIC_INTERFACE
  _interpolate(str, data) {
    return str.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
      const val = key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), data);
      return (val !== undefined && val !== null) ? String(val) : '';
    });
  }
}

module.exports = new TemplateEngine();
