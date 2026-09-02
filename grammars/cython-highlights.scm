; Ported from b0o/tree-sitter-cython queries at 756a20c4 (MIT).
; Scopes end in ".cython".

; Identifier naming conventions

(identifier) @variable.other.cython

((identifier) @support.class.cython
 (#match? @support.class.cython "^[A-Z]"))

((identifier) @constant.other.cython
 (#match? @constant.other.cython "^[A-Z][A-Z_]*$"))

; Function calls

(decorator) @entity.name.function.cython

(call
  function: (attribute attribute: (identifier) @entity.name.function.method.cython))
(call
  function: (identifier) @entity.name.function.cython)

; Builtin functions

((call
  function: (identifier) @support.function.builtin.cython)
 (#match?
   @support.function.builtin.cython
   "^(abs|all|any|ascii|bin|bool|breakpoint|bytearray|bytes|callable|chr|classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|memoryview|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip|__import__)$"))

; Types

(maybe_typed_name
  type: ((_) @support.storage.type.cython))

(type
  (identifier) @support.storage.type.cython)

(c_type
  type: ((_) @support.storage.type.cython))
(c_type
  ((identifier) @support.storage.type.cython))
(c_type
  ((int_type) @support.storage.type.cython))

(maybe_typed_name
  name: ((identifier) @variable.other.cython))

; Function definitions

(function_definition
  name: (identifier) @entity.name.function.cython)

(class_definition
  name: (identifier) @entity.name.type.class.cython)

(cdef_statement
  (cvar_def
    (maybe_typed_name
      name: ((identifier) @entity.name.function.cython))
    (c_function_definition)))

(cvar_decl
  (c_type
    ([(identifier) (int_type)]))
  (c_name
    ((identifier) @entity.name.function.cython))
  (c_function_definition))

(attribute attribute: (identifier) @variable.other.member.cython)

; Literals

[
  (none)
] @constant.language.cython

[
  (true)
  (false)
] @constant.language.boolean.cython

(integer) @constant.numeric.integer.cython
(float) @constant.numeric.float.cython

(comment) @comment.line.number-sign.cython
((comment) @punctuation.definition.comment.cython
  (#set! adjust.endAfterFirstMatchOf "^#"))

((string) @string.quoted.triple.block.cython
  (#match? @string.quoted.triple.block.cython "^[bBfFrRuU]*(?:\"\"\"|''')"))

((string) @string.quoted.double.cython
  (#match? @string.quoted.double.cython "^[bBfFrRuU]*\"(?!\")"))

((string) @string.quoted.single.cython
  (#match? @string.quoted.single.cython "^[bBfFrRuU]*'(?!')"))

(string
  (string_start) @punctuation.definition.string.begin.cython)

(string
  (string_end) @punctuation.definition.string.end.cython)

(escape_sequence) @constant.character.escape.cython

(interpolation
  "{" @punctuation.section.embedded.begin.cython
  "}" @punctuation.section.embedded.end.cython) @meta.embedded.line.interpolation.cython

("(" @punctuation.definition.parameters.begin.bracket.round.cython
  (#is? test.childOfType "parameters c_parameters")
  (#is? test.first true))
(")" @punctuation.definition.parameters.end.bracket.round.cython
  (#is? test.childOfType "parameters c_parameters")
  (#is? test.last true))

("(" @punctuation.definition.arguments.begin.bracket.round.cython
  (#is? test.childOfType "argument_list")
  (#is? test.first true))
(")" @punctuation.definition.arguments.end.bracket.round.cython
  (#is? test.childOfType "argument_list")
  (#is? test.last true))

("[" @punctuation.definition.list.begin.bracket.square.cython
  (#is? test.childOfType "list list_comprehension subscript"))
("]" @punctuation.definition.list.end.bracket.square.cython
  (#is? test.childOfType "list list_comprehension subscript"))

("{" @punctuation.definition.dictionary.begin.bracket.curly.cython
  (#is? test.childOfType "dictionary dictionary_comprehension set set_comprehension"))
("}" @punctuation.definition.dictionary.end.bracket.curly.cython
  (#is? test.childOfType "dictionary dictionary_comprehension set set_comprehension"))

"," @punctuation.separator.comma.cython
":" @punctuation.separator.colon.cython

[
  "-"
  "-="
  "!="
  "*"
  "**"
  "**="
  "*="
  "/"
  "//"
  "//="
  "/="
  "&"
  "&="
  "%"
  "%="
  "^"
  "^="
  "+"
  "->"
  "+="
  "<"
  "<<"
  "<<="
  "<="
  "<>"
  "="
  ":="
  "=="
  ">"
  ">="
  ">>"
  ">>="
  "|"
  "|="
  "~"
  "@="
  "and"
  "in"
  "is"
  "not"
  "or"
 "@"
] @keyword.operator.cython

[
  "as"
  "assert"
  "async"
  "await"
  "break"
  "class"
  "continue"
  "def"
  "del"
  "elif"
  "else"
  "except"
  "exec"
  "finally"
  "for"
  "from"
  "global"
  "if"
  "import"
  "lambda"
  "nonlocal"
  "pass"
  "print"
  "raise"
  "return"
  "try"
  "while"
  "with"
  "yield"
  "match"
  "case"

  ; cython-specific
  "cdef"
  "cpdef"
  "ctypedef"
  "cimport"
  "nogil"
  "gil"
  "extern"
  "inline"
  "public"
  "readonly"
  "struct"
  "union"
  "enum"
  "fused"
  "property"
  "namespace"
  "cppclass"
  "const"
] @keyword.control.cython
