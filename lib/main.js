exports.activate = function () {
  lumine.grammars.addInjectionPoint("source.cython", {
    type: "call",
    language(node) {
      return isRegularExpressionCall(node) ? "regex" : null;
    },
    content(node) {
      if (!isRegularExpressionCall(node)) return null;
      const argumentsNode = node.descendantsOfType("argument_list")[0];
      const pattern = argumentsNode?.namedChildren.find((child) =>
        ["string", "concatenated_string"].includes(child.type),
      );
      return pattern?.descendantsOfType("string_content") ?? null;
    },
    languageScope: null,
  });
};

function isRegularExpressionCall(node) {
  const functionNode = node.firstNamedChild;
  if (functionNode?.type !== "attribute") return false;
  const match = /^re\.([A-Za-z_]+)$/.exec(functionNode.text);
  return match ? REGEX_FUNCTIONS.has(match[1]) : false;
}

const REGEX_FUNCTIONS = new Set([
  "compile",
  "findall",
  "finditer",
  "fullmatch",
  "match",
  "search",
  "split",
  "sub",
  "subn",
]);

exports.consumeHyperlinkInjection = (hyperlink) => {
  hyperlink.addInjectionPoint("source.cython", {
    types: ["comment"],
  });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint("source.cython", {
    types: ["comment"],
  });
};
