declare module 'mdast-util-to-markdown' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ConstructNameMap {
    /**
     * Inline note.
     *
     * ```markdown
     * > | A^[b].
     *      ^^^^
     * ```
     */
    footnote: 'footnote'
    /**
     * Whole definition.
     *
     * ```markdown
     * > | [^a]: b.
     *     ^^^^^^^^
     * ```
     */
    footnoteDefinition: 'footnoteDefinition'
    /**
     * Whole reference.
     *
     * ```markdown
     * > | A[^b].
     *      ^^^^
     * ```
     */
    footnoteReference: 'footnoteReference'
  }
}

export {footnoteFromMarkdown, footnoteToMarkdown} from './lib/index.js'
