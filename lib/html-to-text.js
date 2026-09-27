/**
 * Plain-text rendering of an HTML email body, for the text/plain half of a
 * multipart/alternative message.
 *
 * Why this exists: a message that carries ONLY text/html is one of the oldest
 * bulk-mail signals spam filters score on, and every Drumee email left as
 * HTML only. Nodemailer builds the multipart for us as soon as `text` is set
 * next to `html`; this module derives that text so no caller has to.
 *
 * Deliberately small and dependency-free (no html-to-text package): the
 * inputs are our own templates, which are table layouts with headings,
 * paragraphs, buttons (anchors) and a footer. Good enough for a reader whose
 * client shows the text part, and for a filter comparing the two parts.
 */
const BLOCK_END = /<\/(p|div|tr|li|h[1-6]|table|section|article|header|footer|blockquote|pre)\s*>/gi;
const BREAK = /<br\s*\/?>/gi;
const DROP = /<(head|style|script|title|noscript)[^>]*>[\s\S]*?<\/\1\s*>/gi;
const COMMENT = /<!--[\s\S]*?-->/g;
const ANCHOR = /<a\b[^>]*?href\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a\s*>/gi;
const IMG_ALT = /<img\b[^>]*?\balt\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi;
const TAG = /<[^>]+>/g;
const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rarr: "→", larr: "←", mdash: "—", ndash: "–", hellip: "…", copy: "©", reg: "®", trade: "™",
  laquo: "«", raquo: "»", middot: "·", bull: "•",
};

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (m, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (m, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => (name.toLowerCase() in ENTITIES ? ENTITIES[name.toLowerCase()] : m));
}

/**
 * @param {string} html
 * @returns {string} plain text; "" when there is nothing to say
 */
function htmlToText(html) {
  if (!html) return "";
  let s = String(html);
  s = s.replace(COMMENT, "");
  s = s.replace(DROP, "");
  // Links keep their target so the text part is actionable: "Accept (https://...)".
  s = s.replace(ANCHOR, (m, h1, h2, label) => {
    const href = decodeEntities((h1 || h2 || "").trim());
    const text = decodeEntities(label.replace(TAG, "")).replace(/\s+/g, " ").trim();
    if (!href || /^(javascript|mailto):/i.test(href) && !text) return text;
    if (!text) return href;
    if (text === href) return href;
    return /^mailto:/i.test(href) ? `${text} (${href.slice(7)})` : `${text} (${href})`;
  });
  s = s.replace(IMG_ALT, (m, a1, a2) => {
    const alt = (a1 || a2 || "").trim();
    return alt ? ` ${alt} ` : "";
  });
  s = s.replace(BREAK, "\n");
  s = s.replace(BLOCK_END, "\n");
  s = s.replace(TAG, "");
  s = decodeEntities(s);
  // Whitespace: collapse runs inside a line, keep at most one blank line.
  s = s
    .split("\n")
    .map((line) => line.replace(/[ \t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return s;
}

module.exports = { htmlToText };
