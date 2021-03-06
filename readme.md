# mdast-util-footnote

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

Extension for [`mdast-util-from-markdown`][from-markdown] and/or
[`mdast-util-to-markdown`][to-markdown] to support footnotes in **[mdast][]**.
When parsing (`from-markdown`), must be combined with
[`micromark-extension-footnote`][extension].

## When to use this

Use this if you’re dealing with the AST manually.
It might be better to use [`remark-footnotes`][remark-footnotes] with
**[remark][]**, which includes this but provides a nicer interface and makes it
easier to combine with hundreds of plugins.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install mdast-util-footnote
```

## Use

Say we have the following file, `example.md`:

```markdown
Here is a footnote call,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here’s one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

        { some.code }

    The whole paragraph can be indented, or just the first
    line.  In this way, multi-paragraph footnotes work like
    multi-paragraph list items.

This paragraph won’t be part of the note, because it
isn’t indented.

Here is an inline note.^[Inlines notes are easier to write, since
you don’t have to pick an identifier and move down to type the
note.]
```

And our module, `example.js`, looks as follows:

```js
import fs from 'node:fs'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {toMarkdown} from 'mdast-util-to-markdown'
import {footnote} from 'micromark-extension-footnote'
import {footnoteFromMarkdown, footnoteToMarkdown} from 'mdast-util-footnote'

const doc = fs.readFileSync('example.md')

const tree = fromMarkdown(doc, {
  extensions: [footnote({inlineNotes: true})],
  mdastExtensions: [footnoteFromMarkdown]
})

console.log(tree)

const out = toMarkdown(tree, {extensions: [footnoteToMarkdown]})

console.log(out)
```

Now, running `node example` yields:

```js
{
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'Here is a footnote call,'},
        {type: 'footnoteReference', identifier: '1', label: '1'},
        {type: 'text', value: ' and another.'},
        {type: 'footnoteReference', identifier: 'longnote', label: 'longnote'}
      ]
    },
    {
      type: 'footnoteDefinition',
      identifier: '1',
      label: '1',
      children: [
        {
          type: 'paragraph',
          children: [{type: 'text', value: 'Here is the footnote.'}]
        }
      ]
    },
    {
      type: 'footnoteDefinition',
      identifier: 'longnote',
      label: 'longnote',
      children: [
        {
          type: 'paragraph',
          children: [{type: 'text', value: 'Here’s one with multiple blocks.'}]
        },
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'Subsequent paragraphs are indented to show that they\nbelong to the previous footnote.'}
          ]
        },
        {type: 'code', value: '{ some.code }'},
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'The whole paragraph can be indented, or just the first\nline.  In this way, multi-paragraph footnotes work like\nmulti-paragraph list items.'}
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'This paragraph won’t be part of the note, because it\nisn’t indented.'}
      ]
    },
    {
      type: 'paragraph',
      children: [
        {type: 'text', value: 'Here is an inline note.'},
        {
          type: 'footnote',
          children: [
            {type: 'text', value: 'Inlines notes are easier to write, since\nyou don’t have to pick an identifier and move down to type the\nnote.'}
          ]
        }
      ]
    }
  ]
}
```

```markdown
Here is a footnote call,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here’s one with multiple blocks.

    Subsequent paragraphs are indented to show that they
    belong to the previous footnote.

        { some.code }

    The whole paragraph can be indented, or just the first
    line.  In this way, multi-paragraph footnotes work like
    multi-paragraph list items.

This paragraph won’t be part of the note, because it
isn’t indented.

Here is an inline note.^[Inlines notes are easier to write, since
you don’t have to pick an identifier and move down to type the
note.]
```

## API

This package exports the following identifier: `footnoteFromMarkdown`,
`footnoteToMarkdown`.
There is no default export.

### `footnoteFromMarkdown`

### `footnoteToMarkdown`

Support footnotes.
These exports are extensions, respectively for
[`mdast-util-from-markdown`][from-markdown] and
[`mdast-util-to-markdown`][to-markdown].

## Related

*   [`remarkjs/remark`][remark]
    — markdown processor powered by plugins
*   [`remarkjs/remark-footnotes`][remark-footnotes]
    — remark plugin to support footnotes
*   [`micromark/micromark`][micromark]
    — the smallest commonmark-compliant markdown parser that exists
*   [`micromark/micromark-extension-footnote`][extension]
    — micromark extension to parse footnotes
*   [`syntax-tree/mdast-util-from-markdown`][from-markdown]
    — mdast parser using `micromark` to create mdast from markdown
*   [`syntax-tree/mdast-util-to-markdown`][to-markdown]
    — mdast serializer to create markdown from mdast

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/mdast-util-footnote/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/mdast-util-footnote/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/mdast-util-footnote.svg

[coverage]: https://codecov.io/github/syntax-tree/mdast-util-footnote

[downloads-badge]: https://img.shields.io/npm/dm/mdast-util-footnote.svg

[downloads]: https://www.npmjs.com/package/mdast-util-footnote

[size-badge]: https://img.shields.io/bundlephobia/minzip/mdast-util-footnote.svg

[size]: https://bundlephobia.com/result?p=mdast-util-footnote

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[mdast]: https://github.com/syntax-tree/mdast

[remark]: https://github.com/remarkjs/remark

[remark-footnotes]: https://github.com/remarkjs/remark-footnotes

[from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown

[to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown

[micromark]: https://github.com/micromark/micromark

[extension]: https://github.com/micromark/micromark-extension-footnote
