import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Heading2, Italic, List, ListOrdered, type LucideIcon } from 'lucide-react';
import { cn } from 'cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { shortcutAria, shortcutLabel } from '@/lib/platform';

const SECTION_HEADING = 2;
const SUBSECTION_HEADING = 3;

/** What TipTap returns for an empty document. Stored as an empty description instead. */
const EMPTY_DOCUMENT = '<p></p>';

interface ToolbarAction {
  label: string;
  icon: LucideIcon;
  /** TipTap's built-in shortcut, shown in the tooltip. */
  shortcut?: string;
  isActive: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}

const TOOLBAR_ACTIONS: readonly ToolbarAction[] = [
  {
    label: 'Bold',
    icon: Bold,
    shortcut: 'B',
    isActive: (editor) => editor.isActive('bold'),
    run: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: 'Italic',
    icon: Italic,
    shortcut: 'I',
    isActive: (editor) => editor.isActive('italic'),
    run: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: 'Heading',
    icon: Heading2,
    isActive: (editor) => editor.isActive('heading', { level: SECTION_HEADING }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: SECTION_HEADING }).run(),
  },
  {
    label: 'Bulleted list',
    icon: List,
    isActive: (editor) => editor.isActive('bulletList'),
    run: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: 'Numbered list',
    icon: ListOrdered,
    isActive: (editor) => editor.isActive('orderedList'),
    run: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
];

interface RichTextEditorProps {
  /** The id of the visible label, which names the editable area for screen readers. */
  labelledBy: string;
  value: string;
  onChange: (html: string) => void;
}

/** The form stores an empty description as '', the editor as an empty paragraph. */
function sameDocument(editorHtml: string, value: string): boolean {
  return editorHtml === value || (editorHtml === EMPTY_DOCUMENT && value === '');
}

/**
 * Product descriptions. TipTap only keeps the nodes its schema knows, so pasted scripts or
 * styles never reach the form; the API sanitizes again on save.
 */
export function RichTextEditor({ labelledBy, value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [SECTION_HEADING, SUBSECTION_HEADING] } }),
    ],
    content: value,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-labelledby': labelledBy,
        class: 'prose-editor min-h-40 px-3 py-2 text-sm outline-none',
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      onChange(html === EMPTY_DOCUMENT ? '' : html);
    },
  });

  // Follow the form when it changes the value itself, as Discard and a save do.
  useEffect(() => {
    if (editor && !sameDocument(editor.getHTML(), value)) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className="rounded-md border border-input shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const activeLabels = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      TOOLBAR_ACTIONS.filter((action) => action.isActive(current)).map((action) => action.label),
  });

  return (
    <div className="flex gap-0.5 border-b p-1" role="toolbar" aria-label="Formatting">
      {TOOLBAR_ACTIONS.map((action) => (
        <Tooltip key={action.label}>
          <TooltipTrigger asChild>
            <button
              type="button"
              // Keep the caret in the editor: a focused button would swallow the next keystrokes.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => action.run(editor)}
              aria-label={action.label}
              aria-pressed={activeLabels.includes(action.label)}
              aria-keyshortcuts={action.shortcut && shortcutAria(action.shortcut)}
              className={cn(
                'grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                activeLabels.includes(action.label) && 'bg-muted text-foreground',
              )}
            >
              <action.icon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {action.label}
            {action.shortcut && ` (${shortcutLabel(action.shortcut)})`}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
