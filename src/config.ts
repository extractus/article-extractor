// config.ts

import { clone } from "@pwshub/bellajs";

const sanitizeHtmlOptions: Record<string, unknown> = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "u", "b", "i", "em", "strong", "small", "sup", "sub",
    "div", "span", "p", "article", "blockquote", "section",
    "details", "summary",
    "pre", "code",
    "ul", "ol", "li", "dd", "dl",
    "table", "th", "tr", "td", "thead", "tbody", "tfoot",
    "fieldset", "legend",
    "figure", "figcaption", "img", "picture",
    "video", "audio", "source",
    "iframe",
    "progress",
    "br", "p", "hr",
    "label",
    "abbr",
    "a",
    "svg",
  ],
  allowedAttributes: {
    h1: ["id"],
    h2: ["id"],
    h3: ["id"],
    h4: ["id"],
    h5: ["id"],
    h6: ["id"],
    a: ["href", "target", "title"],
    abbr: ["title"],
    progress: ["value", "max"],
    img: ["src", "srcset", "alt", "title"],
    picture: ["media", "srcset"],
    video: ["controls", "width", "height", "autoplay", "muted", "loop", "src"],
    audio: ["controls", "width", "height", "autoplay", "muted", "loop", "src"],
    source: ["src", "srcset", "data-srcset", "type", "media", "sizes"],
    iframe: ["src", "frameborder", "height", "width", "scrolling", "allow"],
    svg: ["width", "height"],
  },
  allowedIframeDomains: [
    "youtube.com", "vimeo.com", "odysee.com",
    "soundcloud.com", "audius.co",
    "github.com", "codepen.com",
    "twitter.com", "facebook.com", "instagram.com",
  ],
  disallowedTagsMode: "discard",
  allowVulnerableTags: false,
  parseStyleAttributes: false,
  enforceHtmlBoundary: false,
};

/** Get a clone of the current sanitize-html options. */
export const getSanitizeHtmlOptions = (): Record<string, unknown> => {
  return clone(sanitizeHtmlOptions);
};

/** Update sanitize-html options by merging with the current ones. */
export const setSanitizeHtmlOptions = (opts: Record<string, unknown> = {}): void => {
  Object.keys(opts).forEach((key) => {
    (sanitizeHtmlOptions as Record<string, unknown>)[key] = clone(opts[key]);
  });
};
