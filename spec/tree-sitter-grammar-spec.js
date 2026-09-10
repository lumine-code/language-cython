const { Point } = require("lumine");
const fs = require("fs");
const path = require("path");

const highlightsPath = path.join(__dirname, "..", "grammars", "cython-highlights.scm");

// Asserts the scopes the grammar actually produces, using the fixture beside
// this file. `runGrammarTests` reads `<- scope` and `^ scope` assertions out of
// the fixture's own comments, so the fixture is the readable spec.
//
// A fixture whose assertions never run still reports green, so break one
// expected scope and confirm this fails before trusting it.

describe("Cython Tree-sitter grammar", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-cython");
  });

  afterEach(() => editor?.destroy());

  it("tokenizes the fixture", async () => {
    await runGrammarTests(path.join(__dirname, "fixtures", "sample.pyx"), /#/);
  });

  it("scopes punctuation with leaf-rooted context checks", async () => {
    const querySource = fs.readFileSync(highlightsPath, "utf8");
    expect(querySource).not.toMatch(
      /\((?:argument_list|c_parameters|dictionary|list|parameters|subscript)\s*\n\s*"/,
    );
    expect(querySource).toContain('(#is? test.childOfType "list list_comprehension subscript")');

    editor = await lumine.workspace.open("punctuation.pyx");
    editor.setText(`cdef int add(int left, int right):
    return fn([left, right], {"left": left})[0]`);
    await editor.getBuffer().getLanguageMode().ready;

    const scopesAt = (row, text, occurrence = 0) => {
      const line = editor.lineTextForBufferRow(row);
      let column = -1;
      for (let index = 0; index <= occurrence; index++) column = line.indexOf(text, column + 1);
      return editor.scopeDescriptorForBufferPosition([row, column]).getScopesArray();
    };

    expect(scopesAt(0, "(")).toContain(
      "punctuation.definition.parameters.begin.bracket.round.cython",
    );
    expect(scopesAt(0, ")")).toContain(
      "punctuation.definition.parameters.end.bracket.round.cython",
    );
    expect(scopesAt(1, "(")).toContain(
      "punctuation.definition.arguments.begin.bracket.round.cython",
    );
    expect(scopesAt(1, "[", 0)).toContain(
      "punctuation.definition.list.begin.bracket.square.cython",
    );
    expect(scopesAt(1, "{")).toContain(
      "punctuation.definition.dictionary.begin.bracket.curly.cython",
    );
    expect(scopesAt(1, "[", 1)).toContain(
      "punctuation.definition.list.begin.bracket.square.cython",
    );
  });

  it("keeps raw captures bounded on punctuation-heavy CRLF input", async () => {
    editor = await lumine.workspace.open("capture-budget.pyx");
    editor.setText(
      Array.from(
        { length: 1000 },
        (_, index) => `x_${index} = fn([1, 2], {"a": 3}) # generated`,
      ).join("\r\n"),
    );
    const languageMode = editor.getBuffer().getLanguageMode();
    await languageMode.ready;
    const layer = languageMode.rootLanguageLayer;

    expect(layer.queries.highlightsQuery.captures(layer.tree.rootNode).length).toBeLessThanOrEqual(
      24000,
    );
    expect(
      layer.queries.highlightsQuery.captures(layer.tree.rootNode, {
        startPosition: new Point(400, 0),
        endPosition: new Point(406, 0),
      }).length,
    ).toBeLessThanOrEqual(145);
  });

  it("keeps tile query work bounded inside a large list parent", async () => {
    editor = await lumine.workspace.open("large-list.pyx");
    editor.setText(
      ["values = [", ...Array.from({ length: 6000 }, (_, index) => `  ${index},`), "]"].join(
        "\r\n",
      ),
    );
    const languageMode = editor.getBuffer().getLanguageMode();
    await languageMode.ready;
    const layer = languageMode.rootLanguageLayer;
    const options = {
      startPosition: new Point(3000, 0),
      endPosition: new Point(3006, 0),
    };

    expect(
      layer.queries.highlightsQuery.captures(layer.tree.rootNode, options).length,
    ).toBeLessThanOrEqual(100);
  });
});
