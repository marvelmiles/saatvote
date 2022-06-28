import katex from "katex";
import React from "react";
import {
  AtomicBlockUtils,
  convertFromRaw,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from "draft-js";
import { Map } from "immutable";
var rawContent = {
  blocks: [
    {
      text: "This is a Draft-based editor that supports TeX rendering.",
      type: "unstyled",
    },
    {
      text: "",
      type: "unstyled",
    },
    {
      text:
        "Each TeX block below is represented as a DraftEntity object and " +
        "rendered using Khan Academy's KaTeX library.",
      type: "unstyled",
    },
    {
      text: "",
      type: "unstyled",
    },
    {
      text: "Click any TeX block to edit.",
      type: "unstyled",
    },
    {
      text: " ",
      type: "atomic",
      entityRanges: [{ offset: 0, length: 1, key: "first" }],
    },
    {
      text: "You can also insert a new TeX block at the cursor location.",
      type: "unstyled",
    },
  ],

  entityMap: {
    first: {
      type: "TOKEN",
      mutability: "IMMUTABLE",
      data: {
        content:
          "\\left( \\sum_{k=1}^n a_k b_k \\right)^{\\!\\!2} \\leq\n" +
          "\\left( \\sum_{k=1}^n a_k^2 \\right)\n" +
          "\\left( \\sum_{k=1}^n b_k^2 \\right)",
      },
    },
  },
};

const dataContent = convertFromRaw(rawContent);

const removeTeXBlock = (editorState, blockKey) => {
  var content = editorState.getCurrentContent();
  var block = content.getBlockForKey(blockKey);

  var targetRange = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength(),
  });

  var withoutTeX = Modifier.removeRange(content, targetRange, "backward");
  var resetBlock = Modifier.setBlockType(
    withoutTeX,
    withoutTeX.getSelectionAfter(),
    "unstyled"
  );

  var newState = EditorState.push(editorState, resetBlock, "remove-range");
  return EditorState.forceSelection(newState, resetBlock.getSelectionAfter());
};

const insertTeXBlock = (editorState) => {
  let count = 0;
  const examples = [
    "\\int_a^bu\\frac{d^2v}{dx^2}\\,dx\n" +
      "=\\left.u\\frac{dv}{dx}\\right|_a^b\n" +
      "-\\int_a^b\\frac{du}{dx}\\frac{dv}{dx}\\,dx",

    "P(E) = {n \\choose k} p^k (1-p)^{ n-k} ",

    "\\tilde f(\\omega)=\\frac{1}{2\\pi}\n" +
      "\\int_{-\\infty}^\\infty f(x)e^{-i\\omega x}\\,dx",

    "\\frac{1}{(\\sqrt{\\phi \\sqrt{5}}-\\phi) e^{\\frac25 \\pi}} =\n" +
      "1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {1+\\frac{e^{-6\\pi}}\n" +
      "{1+\\frac{e^{-8\\pi}} {1+\\ldots} } } }",
  ];

  const contentState = editorState.getCurrentContent();
  const nextFormula = count++ % examples.length;
  const contentStateWithEntity = contentState.createEntity(
    "TOKEN",
    "IMMUTABLE",
    { content: examples[nextFormula] }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
};

class KatexOutput extends React.Component {
  _update() {
    katex.render(this.props.content, this.refs.container, {
      displayMode: true,
    });
  }

  componentDidMount() {
    this._update();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.content !== this.props.content) {
      this._update();
    }
  }

  render() {
    return <div ref="container" onClick={this.props.onClick} />;
  }
}

class TeXBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false };

    this._onClick = () => {
      if (this.state.editMode) {
        return;
      }

      this.setState(
        {
          editMode: true,
          texValue: this._getValue(),
        },
        () => {
          this._startEdit();
        }
      );
    };

    this._onValueChange = (evt) => {
      var value = evt.target.value;
      var invalid = false;
      try {
        katex.__parse(value);
      } catch (e) {
        invalid = true;
      } finally {
        this.setState({
          invalidTeX: invalid,
          texValue: value,
        });
      }
    };

    this._save = () => {
      var entityKey = this.props.block.getEntityAt(0);
      var newContentState = this.props.contentState.mergeEntityData(entityKey, {
        content: this.state.texValue,
      });
      this.setState(
        {
          invalidTeX: false,
          editMode: false,
          texValue: null,
        },
        this._finishEdit.bind(this, newContentState)
      );
    };

    this._remove = () => {
      this.props.blockProps.onRemove(this.props.block.getKey());
    };
    this._startEdit = () => {
      this.props.blockProps.onStartEdit(this.props.block.getKey());
    };
    this._finishEdit = (newContentState) => {
      this.props.blockProps.onFinishEdit(
        this.props.block.getKey(),
        newContentState
      );
    };
  }

  _getValue() {
    return this.props.contentState
      .getEntity(this.props.block.getEntityAt(0))
      .getData()["content"];
  }

  render() {
    var texContent = null;
    if (this.state.editMode) {
      if (this.state.invalidTeX) {
        texContent = "";
      } else {
        texContent = this.state.texValue;
      }
    } else {
      texContent = this._getValue();
    }

    var className = "TeXEditor-tex";
    if (this.state.editMode) {
      className += " TeXEditor-activeTeX";
    }

    var editPanel = null;
    if (this.state.editMode) {
      var buttonClass = "TeXEditor-saveButton";
      if (this.state.invalidTeX) {
        buttonClass += " TeXEditor-invalidButton";
      }

      editPanel = (
        <div className="TeXEditor-panel">
          <textarea
            className="TeXEditor-texValue"
            onChange={this._onValueChange}
            ref="textarea"
            value={this.state.texValue}
          />
          <div className="TeXEditor-buttons">
            <button
              className={buttonClass}
              disabled={this.state.invalidTeX}
              onClick={this._save}
            >
              {this.state.invalidTeX ? "Invalid TeX" : "Done"}
            </button>
            <button className="TeXEditor-removeButton" onClick={this._remove}>
              Remove
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        <KatexOutput content={texContent} onClick={this._onClick} />
        {editPanel}
      </div>
    );
  }
}
class TeXEditorExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(dataContent),
      liveTeXEdits: Map(),
    };

    this._blockRenderer = (block) => {
      if (block.getType() === "atomic") {
        return {
          component: TeXBlock,
          editable: false,
          props: {
            onStartEdit: (blockKey) => {
              var { liveTeXEdits } = this.state;
              this.setState({ liveTeXEdits: liveTeXEdits.set(blockKey, true) });
            },
            onFinishEdit: (blockKey, newContentState) => {
              var { liveTeXEdits } = this.state;
              this.setState({
                liveTeXEdits: liveTeXEdits.remove(blockKey),
                editorState: EditorState.createWithContent(newContentState),
              });
            },
            onRemove: (blockKey) => this._removeTeX(blockKey),
          },
        };
      }
      return null;
    };

    this._focus = () => this.refs.editor.focus();
    this._onChange = (editorState) => this.setState({ editorState });

    this._handleKeyCommand = (command, editorState) => {
      var newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this._onChange(newState);
        return true;
      }
      return false;
    };

    this._removeTeX = (blockKey) => {
      var { editorState, liveTeXEdits } = this.state;
      this.setState({
        liveTeXEdits: liveTeXEdits.remove(blockKey),
        editorState: removeTeXBlock(editorState, blockKey),
      });
    };

    this._insertTeX = () => {
      this.setState({
        liveTeXEdits: Map(),
        editorState: insertTeXBlock(this.state.editorState),
      });
    };
  }

  /**
   * While editing TeX, set the Draft editor to read-only. This allows us to
   * have a textarea within the DOM.
   */
  render() {
    return (
      <div className="TexEditor-container">
        <div className="TeXEditor-root">
          <div className="TeXEditor-editor" onClick={this._focus}>
            <Editor
              blockRendererFn={this._blockRenderer}
              editorState={this.state.editorState}
              handleKeyCommand={this._handleKeyCommand}
              onChange={this._onChange}
              placeholder="Start a document..."
              readOnly={this.state.liveTeXEdits.count()}
              ref="editor"
              spellCheck={true}
            />
          </div>
        </div>
        <button onClick={this._insertTeX} className="TeXEditor-insert">
          {"Insert new TeX"}
        </button>
      </div>
    );
  }
}

export default TeXEditorExample;
