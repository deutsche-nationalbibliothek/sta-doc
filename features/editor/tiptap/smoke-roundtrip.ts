import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { documentHtmlExtensions } from './document-nodes';

const html =
  '<p>Intro</p>' +
  '<div class="collapsible" data-intro="Mehr">' +
  '<p>Details <strong>fett</strong></p>' +
  '<div class="embed" data-entity-id="Q200" data-embed-property="P396"></div>' +
  '</div>' +
  '<div class="example"><p>Beispieltext</p></div>' +
  '<p><a class="ref" href="Q100" data-entity-id="Q100">Label</a></p>' +
  '<p lang="en" data-original-language="Q318">English</p>';

const editor = new Editor({
  extensions: [
    StarterKit.configure({
      paragraph: false,
      link: false,
      heading: { levels: [1, 2, 3] },
      codeBlock: false,
      blockquote: false,
      horizontalRule: false,
    }),
    ...documentHtmlExtensions,
  ],
  content: html,
});

const out = editor.getHTML();
editor.destroy();

const checks = [
  'class="collapsible"',
  'data-intro="Mehr"',
  'class="embed"',
  'data-entity-id="Q200"',
  'data-embed-property="P396"',
  'class="example"',
  'data-entity-id="Q100"',
  '<strong>fett</strong>',
  'lang="en"',
  'data-original-language="Q318"',
];

const missing = checks.filter((c) => !out.includes(c));
console.log(out);
if (missing.length) {
  console.error('MISSING', missing);
  process.exit(1);
}
console.log('OK');
