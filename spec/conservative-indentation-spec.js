describe("Conservative cython indentation", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage("language-cython");
    editor = await lumine.workspace.open();
    editor.setGrammar(lumine.grammars.grammarForScopeName("source.cython"));
    editor.update({ tabLength: 4, softTabs: true });
    await editor.whenGrammarSettled();
  });

  afterEach(() => editor?.destroy());

  for (const [name, source, row, columns] of [
    ["an unknown colon", "value:", 0, 0],
    ["an unfinished annotation", "value: Type", 0, 0],
    ["a one-line with suite", "with lock: work()", 0, 0],
    ["a with suite header", "with lock:", 0, 4],
    ["a C function header", "cdef int value():", 0, 4],
    ["a C class header", "cdef class Value:", 0, 4],
    ["an extern suite header", 'cdef extern from "value.h":', 0, 4],
    ["a one-line C function", "cdef int value(): return 1", 0, 0],
  ]) {
    it(`keeps the intended level after ${name}`, async () => {
      editor.setText(source);
      await editor.whenGrammarSettled();
      editor.setCursorBufferPosition([row, Infinity]);
      editor.insertText("\n", { autoIndent: true, autoIndentNewline: true });
      await editor.whenGrammarSettled();
      expect(editor.lineTextForBufferRow(row + 1)).toBe(" ".repeat(columns));
      expect(editor.getCursorBufferPosition().column).toBe(columns);
    });
  }

  it("dedents a closing delimiter only when it is typed at the start of a row", async () => {
    editor.setText("values = [" + "\n    ");
    await editor.whenGrammarSettled();
    editor.setCursorBufferPosition([1, Infinity]);
    editor.insertText("]", { autoIndent: true, autoDecreaseIndent: true });
    await editor.whenGrammarSettled();
    expect(editor.lineTextForBufferRow(1)).toBe("]");
  });

  it("preserves multiline literal contents during explicit reindent", async () => {
    const source = 'text = """first\n\tkeep this tab\n  keep these spaces\n"""\n';
    editor.setText(source);
    await editor.whenGrammarSettled();
    editor.getBuffer().clearUndoStack();
    editor.autoIndentBufferRows(0, editor.getLastBufferRow() - 1);
    await editor.whenGrammarSettled();
    expect(editor.getText()).toBe(source);
    editor.autoIndentBufferRows(0, editor.getLastBufferRow() - 1);
    expect(editor.getText()).toBe(source);
  });
});
