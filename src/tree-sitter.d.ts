declare module 'tree-sitter' {
  import { Tree, Parser } from 'tree-sitter';
  const TreeSitter: {
    new (): Parser;
  };
  export = TreeSitter;
}

declare module 'tree-sitter-python' {
  import { Language } from 'tree-sitter';
  const Python: Language;
  export = Python;
}

declare module 'tree-sitter-javascript' {
  import { Language } from 'tree-sitter';
  const JavaScript: Language;
  export = JavaScript;
}
