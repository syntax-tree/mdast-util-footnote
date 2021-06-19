import {normalizeIdentifier} from 'micromark-util-normalize-identifier'
import association from 'mdast-util-to-markdown/lib/util/association.js'
import phrasing from 'mdast-util-to-markdown/lib/util/container-phrasing.js'
import flow from 'mdast-util-to-markdown/lib/util/container-flow.js'
import indentLines from 'mdast-util-to-markdown/lib/util/indent-lines.js'
import safe from 'mdast-util-to-markdown/lib/util/safe.js'

export const footnoteFromMarkdown = {
  canContainEols: ['footnote'],
  enter: {
    footnoteDefinition: enterFootnoteDefinition,
    footnoteDefinitionLabelString: enterFootnoteDefinitionLabelString,
    footnoteCall: enterFootnoteCall,
    footnoteCallString: enterFootnoteCallString,
    inlineNote: enterNote
  },
  exit: {
    footnoteDefinition: exitFootnoteDefinition,
    footnoteDefinitionLabelString: exitFootnoteDefinitionLabelString,
    footnoteCall: exitFootnoteCall,
    footnoteCallString: exitFootnoteCallString,
    inlineNote: exitNote
  }
}

export const footnoteToMarkdown = {
  // This is on by default already.
  unsafe: [{character: '[', inConstruct: ['phrasing', 'label', 'reference']}],
  handlers: {footnote, footnoteDefinition, footnoteReference}
}

footnoteReference.peek = footnoteReferencePeek
footnote.peek = footnotePeek

function enterFootnoteDefinition(token) {
  this.enter(
    {type: 'footnoteDefinition', identifier: '', label: '', children: []},
    token
  )
}

function enterFootnoteDefinitionLabelString() {
  this.buffer()
}

function exitFootnoteDefinitionLabelString(token) {
  const label = this.resume()
  this.stack[this.stack.length - 1].label = label
  this.stack[this.stack.length - 1].identifier = normalizeIdentifier(
    this.sliceSerialize(token)
  ).toLowerCase()
}

function exitFootnoteDefinition(token) {
  this.exit(token)
}

function enterFootnoteCall(token) {
  this.enter({type: 'footnoteReference', identifier: '', label: ''}, token)
}

function enterFootnoteCallString() {
  this.buffer()
}

function exitFootnoteCallString(token) {
  const label = this.resume()
  this.stack[this.stack.length - 1].label = label
  this.stack[this.stack.length - 1].identifier = normalizeIdentifier(
    this.sliceSerialize(token)
  ).toLowerCase()
}

function exitFootnoteCall(token) {
  this.exit(token)
}

function enterNote(token) {
  this.enter({type: 'footnote', children: []}, token)
}

function exitNote(token) {
  this.exit(token)
}

function footnoteReference(node, _, context) {
  const exit = context.enter('footnoteReference')
  const subexit = context.enter('reference')
  const reference = safe(context, association(node), {before: '^', after: ']'})
  subexit()
  exit()
  return '[^' + reference + ']'
}

function footnoteReferencePeek() {
  return '['
}

function footnote(node, _, context) {
  const exit = context.enter('footnote')
  const subexit = context.enter('label')
  const value = '^[' + phrasing(node, context, {before: '[', after: ']'}) + ']'
  subexit()
  exit()
  return value
}

function footnotePeek() {
  return '^'
}

function footnoteDefinition(node, _, context) {
  const exit = context.enter('footnoteDefinition')
  const subexit = context.enter('label')
  const label =
    '[^' + safe(context, association(node), {before: '^', after: ']'}) + ']:'
  subexit()
  const value = indentLines(flow(node, context), map)
  exit()

  return value

  function map(line, index, blank) {
    if (index) {
      return (blank ? '' : '    ') + line
    }

    return (blank ? label : label + ' ') + line
  }
}
