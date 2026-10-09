describe("Cython regex argument semantics", () => {
  let editor;
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-regex");
    await lumine.packages.activatePackage("language-cython");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.cython"));
  });
  afterEach(async () => {
    editor.destroy();
    await lumine.packages.deactivatePackage("language-cython");
    await lumine.packages.deactivatePackage("language-regex");
  });
  for (const [label, source, injected] of [
    ["positional literal pattern", "re.search(r'hello+world', text)", true],
    ["input string after a nonliteral pattern", "re.search(pattern, 'hello+world')", false],
    [
      "replacement string after a nonliteral pattern",
      "re.sub(pattern, 'hello+world', text)",
      false,
    ],
    ["reordered keyword pattern", "re.search(string=text, pattern=r'hello+world')", true],
    ["whitespace around the module attribute", "re . search(r'hello+world', text)", true],
    [
      "positional pattern after a comment",
      "re.search(\n # explanation\n r'hello+world', text)",
      true,
    ],
  ]) {
    it(`selects the ${label} according to the actual call structure`, async () => {
      editor.setText(source);
      await editor.languageMode.ready;
      await editor.languageMode.atTransactionEnd();
      const point = editor.getBuffer().positionForCharacterIndex(source.indexOf("+"));
      const scopes = editor.scopeDescriptorForBufferPosition(point).getScopesArray();
      expect(scopes.includes("keyword.operator.quantifier.regexp")).toBe(injected);
    });
  }
});
