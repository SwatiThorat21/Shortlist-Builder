import { load } from 'cheerio';

export function extractTextFromHtml(html, maxChars) {
  const $ = load(html);
  $('script,style,noscript,svg,header,footer,nav,form').remove();

  const lines = [];
  $('h1,h2,h3,p,li,table').each((_idx, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > 30) lines.push(text);
  });

  return lines.join('\n').slice(0, maxChars);
}
