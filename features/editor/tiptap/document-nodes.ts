import { Node, mergeAttributes } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';

/**
 * TipTap schema aligned with DocumentHtml conventions / SAFELIST_TEXT atoms.
 * @see docs/sta-entry-sections-documentvalue.md
 * @see de.dnb.sta.storage.entry.DocumentHtml
 */

function dataAttrs(
  attrs: Record<string, string | null | undefined>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value != null && value !== '') {
      out[key] = value;
    }
  }
  return out;
}

const originalLanguageAttributes = {
  lang: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) => element.getAttribute('lang'),
    renderHTML: (attributes: { lang?: string | null }) =>
      dataAttrs({ lang: attributes.lang }),
  },
  originalLanguage: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) =>
      element.getAttribute('data-original-language'),
    renderHTML: (attributes: { originalLanguage?: string | null }) =>
      dataAttrs({
        'data-original-language': attributes.originalLanguage,
      }),
  },
};

function isDocumentHtmlAtomDiv(element: HTMLElement): boolean {
  return (
    element.classList.contains('collapsible') ||
    element.classList.contains('example') ||
    element.classList.contains('embed') ||
    element.classList.contains('description')
  );
}

/** Empty embed shell: div.embed[data-entity-id][data-embed-property] */
export const StaEmbed = Node.create({
  name: 'staEmbed',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      entityId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-entity-id'),
        renderHTML: (attributes) =>
          dataAttrs({ 'data-entity-id': attributes.entityId }),
      },
      embedProperty: {
        default: 'P396',
        parseHTML: (element) =>
          element.getAttribute('data-embed-property') || 'P396',
        renderHTML: (attributes) =>
          dataAttrs({ 'data-embed-property': attributes.embedProperty }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div.embed' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ class: 'embed' }, HTMLAttributes)];
  },
});

/** Collapsible container: div.collapsible[data-intro] (+ optional P132) */
export const StaCollapsible = Node.create({
  name: 'staCollapsible',
  group: 'block',
  content: 'block*',
  defining: true,

  addAttributes() {
    return {
      intro: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-intro'),
        renderHTML: (attributes) =>
          dataAttrs({ 'data-intro': attributes.intro }),
      },
      ...originalLanguageAttributes,
    };
  },

  parseHTML() {
    return [{ tag: 'div.collapsible' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ class: 'collapsible' }, HTMLAttributes),
      0,
    ];
  },
});

/** Example container: div.example (+ optional P132) */
export const StaExample = Node.create({
  name: 'staExample',
  group: 'block',
  content: 'block*',
  defining: true,

  addAttributes() {
    return {
      ...originalLanguageAttributes,
    };
  },

  parseHTML() {
    return [{ tag: 'div.example' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ class: 'example' }, HTMLAttributes),
      0,
    ];
  },
});

/** Description co-qualifier: div.description */
export const StaDescription = Node.create({
  name: 'staDescription',
  group: 'block',
  content: 'block*',
  defining: true,

  parseHTML() {
    return [{ tag: 'div.description' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes({ class: 'description' }, HTMLAttributes),
      0,
    ];
  },
});

/**
 * P132 passage wrapper: plain div with lang + data-original-language.
 * Matches DocumentHtml.applyOriginalLanguage / extractOriginalLanguage.
 */
export const StaLangPassage = Node.create({
  name: 'staLangPassage',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      ...originalLanguageAttributes,
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-original-language]',
        getAttrs: (element) => {
          if (typeof element === 'string') {
            return false;
          }
          return isDocumentHtmlAtomDiv(element) ? false : null;
        },
      },
      {
        tag: 'div[lang]',
        getAttrs: (element) => {
          if (typeof element === 'string') {
            return false;
          }
          if (isDocumentHtmlAtomDiv(element)) {
            return false;
          }
          // Prefer data-original-language rule; accept lang-only wrappers.
          return element.hasAttribute('data-original-language') ? false : null;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setStaLangPassage:
        (attributes: {
          lang?: string | null;
          originalLanguage?: string | null;
        }) =>
        ({ commands }) =>
          commands.wrapIn(this.name, attributes),
      unsetStaLangPassage:
        () =>
        ({ commands }) =>
          commands.lift(this.name),
    };
  },
});

/** Paragraph with optional P132 attrs (single-root passage without wrapper). */
export const StaParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...originalLanguageAttributes,
    };
  },
});

/**
 * Links: web (no class), a.ref, a.see — distinguished by class + data-entity-id.
 * Disable StarterKit.link when registering this.
 */
export const StaLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => dataAttrs({ class: attributes.class }),
      },
      entityId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-entity-id'),
        renderHTML: (attributes) =>
          dataAttrs({ 'data-entity-id': attributes.entityId }),
      },
    };
  },
}).configure({
  openOnClick: false,
  HTMLAttributes: {
    rel: 'noopener noreferrer',
  },
});

/**
 * Shared extensions without React NodeViews (unit tests / headless).
 * Collapsible, example, embed stay plain here; the browser editor swaps in
 * interactive variants.
 */
export const documentHtmlBaseExtensions = [
  StaParagraph,
  StaDescription,
  StaLangPassage,
  StaLink,
];

/** Plain schema nodes including layout containers (no React NodeView). */
export const documentHtmlExtensions = [
  ...documentHtmlBaseExtensions,
  StaCollapsible,
  StaExample,
  StaEmbed,
];

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    staLangPassage: {
      setStaLangPassage: (attributes: {
        lang?: string | null;
        originalLanguage?: string | null;
      }) => ReturnType;
      unsetStaLangPassage: () => ReturnType;
    };
  }
}
