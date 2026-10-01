# language-cython

Cython language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-cython](https://github.com/b0o/tree-sitter-cython).
- **Syntax highlighting**: highlights Python constructs, C declarations, types, operators, strings, and comments.
- **Editing**: provides parse-tree folding and indentation for Cython blocks and expressions.
- **Navigation**: exposes definitions, references, and local bindings from Tree-sitter queries.
- **Embedded regex**: parses patterns passed through the `re` module with the shared regex grammar when available.

## Installation

To install `language-cython` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-cython`.

## Injections

- Static Tree-sitter injections highlight URLs with `language-hyperlink`.
- Static Tree-sitter injections highlight comment markers with `language-todo`.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
