let injectionRegistrations = [];

exports.activate = function () {
  injectionRegistrations.push(
    lumine.grammars.addInjectionPoint("source.cython", {
      type: "call",
      language(node) {
        return isRegularExpressionCall(node) ? "regex" : null;
      },
      content(node) {
        if (!isRegularExpressionCall(node)) return null;
        const argumentsNode = node.childForFieldName("arguments");
        const argumentsList =
          argumentsNode?.namedChildren.filter((child) => child.type !== "comment") ?? [];
        const keyword = argumentsList.find(
          (child) =>
            child.type === "keyword_argument" &&
            child.childForFieldName("name")?.text === "pattern",
        );
        const pattern = keyword?.childForFieldName("value") ?? argumentsList[0];
        if (!["string", "concatenated_string"].includes(pattern?.type)) return null;
        return pattern?.descendantsOfType("string_content") ?? null;
      },
      languageScope: null,
    }),
  );
};

function isRegularExpressionCall(node) {
  const functionNode = node.childForFieldName("function");
  if (functionNode?.type !== "attribute") return false;
  if (functionNode.childForFieldName("object")?.text !== "re") return false;
  return REGEX_FUNCTIONS.has(functionNode.childForFieldName("attribute")?.text);
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

exports.deactivate = function () {
  for (const registration of injectionRegistrations.splice(0)) registration.dispose();
};
