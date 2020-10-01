var test = require('tape')
var fromMarkdown = require('mdast-util-from-markdown')
var toMarkdown = require('mdast-util-to-markdown')
var syntax = require('micromark-extension-footnote')
var footnote = require('.')

test('markdown -> mdast', function (t) {
  t.deepEqual(
    fromMarkdown('[^a]: b\nc\n\n    d', {
      extensions: [syntax()],
      mdastExtensions: [footnote.fromMarkdown]
    }),
    {
      type: 'root',
      children: [
        {
          type: 'footnoteDefinition',
          identifier: 'a',
          label: 'a',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'b\nc',
                  position: {
                    start: {line: 1, column: 7, offset: 6},
                    end: {line: 2, column: 2, offset: 9}
                  }
                }
              ],
              position: {
                start: {line: 1, column: 7, offset: 6},
                end: {line: 2, column: 2, offset: 9}
              }
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  value: 'd',
                  position: {
                    start: {line: 4, column: 5, offset: 15},
                    end: {line: 4, column: 6, offset: 16}
                  }
                }
              ],
              position: {
                start: {line: 4, column: 5, offset: 15},
                end: {line: 4, column: 6, offset: 16}
              }
            }
          ],
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 4, column: 6, offset: 16}
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 4, column: 6, offset: 16}
      }
    },
    'should support a footnote definition'
  )

  t.deepEqual(
    fromMarkdown('Call.[^a]\n[^a]: b', {
      extensions: [syntax()],
      mdastExtensions: [footnote.fromMarkdown]
    }).children[0],
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'Call.',
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 6, offset: 5}
          }
        },
        {
          type: 'footnoteReference',
          identifier: 'a',
          label: 'a',
          position: {
            start: {line: 1, column: 6, offset: 5},
            end: {line: 1, column: 10, offset: 9}
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 10, offset: 9}
      }
    },
    'should support a footnote call'
  )

  t.deepEqual(
    fromMarkdown('Note:^[inline\n*note*]', {
      extensions: [syntax({inlineNotes: true})],
      mdastExtensions: [footnote.fromMarkdown]
    }).children[0],
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          value: 'Note:',
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 6, offset: 5}
          }
        },
        {
          type: 'footnote',
          children: [
            {
              type: 'text',
              value: 'inline\n',
              position: {
                start: {line: 1, column: 8, offset: 7},
                end: {line: 2, column: 1, offset: 14}
              }
            },
            {
              type: 'emphasis',
              children: [
                {
                  type: 'text',
                  value: 'note',
                  position: {
                    start: {line: 2, column: 2, offset: 15},
                    end: {line: 2, column: 6, offset: 19}
                  }
                }
              ],
              position: {
                start: {line: 2, column: 1, offset: 14},
                end: {line: 2, column: 7, offset: 20}
              }
            }
          ],
          position: {
            start: {line: 1, column: 6, offset: 5},
            end: {line: 2, column: 8, offset: 21}
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 2, column: 8, offset: 21}
      }
    },
    'should support a footnote call'
  )

  t.end()
})

test('mdast -> markdown', function (t) {
  t.deepEqual(
    toMarkdown(
      {type: 'footnoteReference', identifier: 'a'},
      {extensions: [footnote.toMarkdown]}
    ),
    '[^a]\n',
    'should serialize a footnote reference w/ identifier'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'footnoteReference', label: 'X]Y'},
      {extensions: [footnote.toMarkdown]}
    ),
    '[^X\\]Y]\n',
    'should serialize a footnote reference w/ label'
  )

  t.deepEqual(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'a'},
          {type: 'footnoteReference', label: 'b'},
          {type: 'text', value: 'c'}
        ]
      },
      {extensions: [footnote.toMarkdown]}
    ),
    'a[^b]c\n',
    'should serialize a footnote reference in a paragraph'
  )

  t.deepEqual(
    toMarkdown({type: 'footnote'}, {extensions: [footnote.toMarkdown]}),
    '^[]\n',
    'should serialize an empty footnote'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'footnote', children: [{type: 'text', value: 'asd'}]},
      {extensions: [footnote.toMarkdown]}
    ),
    '^[asd]\n',
    'should serialize a footnote'
  )

  t.deepEqual(
    toMarkdown(
      {
        type: 'paragraph',
        children: [
          {type: 'text', value: 'a'},
          {type: 'footnote', children: [{type: 'text', value: 'b'}]},
          {type: 'text', value: 'c'}
        ]
      },
      {extensions: [footnote.toMarkdown]}
    ),
    'a^[b]c\n',
    'should serialize a footnote in a paragraph'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'footnoteDefinition', identifier: 'a'},
      {extensions: [footnote.toMarkdown]}
    ),
    '[^a]:\n',
    'should serialize a footnote definition w/ identifier'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'footnoteDefinition', label: 'X]Y'},
      {extensions: [footnote.toMarkdown]}
    ),
    '[^X\\]Y]:\n',
    'should serialize a footnote definition w/ label'
  )

  t.deepEqual(
    toMarkdown(
      {
        type: 'footnoteDefinition',
        label: 'a',
        children: [
          {type: 'paragraph', children: [{type: 'text', value: 'b\nc'}]},
          {type: 'paragraph', children: [{type: 'text', value: 'd'}]}
        ]
      },
      {extensions: [footnote.toMarkdown]}
    ),
    '[^a]: b\n    c\n\n    d\n',
    'should serialize a footnote definition w/ content'
  )

  t.deepEqual(
    toMarkdown(
      {
        type: 'footnoteDefinition',
        label: 'a',
        children: [{type: 'code', value: 'b'}]
      },
      {extensions: [footnote.toMarkdown]}
    ),
    '[^a]:     b\n',
    'should serialize code in a footnote definition'
  )

  t.deepEqual(
    toMarkdown(
      {
        type: 'footnoteDefinition',
        label: 'a',
        children: [
          {type: 'paragraph', children: [{type: 'text', value: 'b'}]},
          {type: 'code', value: 'c'}
        ]
      },
      {extensions: [footnote.toMarkdown]}
    ),
    '[^a]: b\n\n        c\n',
    'should serialize code as the 2nd child in a footnote definition'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'paragraph', children: [{type: 'text', value: 'b^[a]'}]},
      {extensions: [footnote.toMarkdown]}
    ),
    'b^\\[a]\n',
    'should escape what would otherwise be an inline note'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'paragraph', children: [{type: 'text', value: 'b[^a]'}]},
      {extensions: [footnote.toMarkdown]}
    ),
    'b\\[^a]\n',
    'should escape what would otherwise be an footnote call'
  )

  t.deepEqual(
    toMarkdown(
      {type: 'paragraph', children: [{type: 'text', value: '[a]: b'}]},
      {extensions: [footnote.toMarkdown]}
    ),
    '\\[a]: b\n',
    'should escape what would otherwise be an footnote definition'
  )

  t.end()
})
