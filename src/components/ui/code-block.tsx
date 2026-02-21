// Generic code block with JavaScript/TypeScript syntax highlighting and preserved indentation.
// Uses inline styles (no Tailwind in dynamic strings) so styles survive build.

const JS_KEYWORD_COLOR = '#60a5fa'; // blue-400
const JS_STRING_COLOR = '#fbbf24'; // amber-400
const JS_FUNCTION_COLOR = '#a78bfa'; // purple-400
const JS_OPERATOR_COLOR = '#f472b6'; // pink-400
const JS_NUMBER_COLOR = '#d4a574'; // warm sand
const JS_BRACKET_COLOR = '#94a3b8'; // slate-400
const JS_COMMENT_COLOR = '#71717a'; // zinc-500
const JS_DEFAULT_COLOR = '#d4d4d8'; // zinc-300

function highlightJs(raw: string): string {
    let s = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const MARKER_PREFIX = '\u0001';
    const MARKER_SUFFIX = '\u0002';

    // Strings (single, double, template literals)
    const stringMarkers: string[] = [];
    s = s.replace(/(`[^`]*`|'[^']*'|"[^"]*")/g, (match) => {
        const marker = `${MARKER_PREFIX}STR${stringMarkers.length}${MARKER_SUFFIX}`;
        stringMarkers.push(match);
        return marker;
    });

    // Numbers
    const numberMarkers: string[] = [];
    s = s.replace(/\b(\d+\.?\d*)\b/g, (match) => {
        const marker = `${MARKER_PREFIX}NUM${numberMarkers.length}${MARKER_SUFFIX}`;
        numberMarkers.push(match);
        return marker;
    });

    // Keywords
    const keywordMarkers: string[] = [];
    s = s.replace(
        /\b(const|let|var|function|if|else|return|import|export|from|default|class|extends|super|this|new|typeof|instanceof|in|of|for|while|do|break|continue|switch|case|try|catch|finally|throw|async|await|yield|true|false|null|undefined|void|delete|static|public|private|protected|readonly|abstract|interface|type|enum|namespace|module|declare|as|is|asserts|satisfies|const|readonly|keyof|typeof|infer)\b/g,
        (match) => {
            const marker = `${MARKER_PREFIX}KW${keywordMarkers.length}${MARKER_SUFFIX}`;
            keywordMarkers.push(match);
            return marker;
        }
    );

    // Function names: identifiers followed by (
    const functionMarkers: string[] = [];
    s = s.replace(/\b([a-z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, (match) => {
        const marker = `${MARKER_PREFIX}FN${functionMarkers.length}${MARKER_SUFFIX}`;
        functionMarkers.push(match.trim());
        return marker;
    });

    // Member access operators
    const operatorMarkers: string[] = [];
    s = s.replace(/(->|\.|\.\.\.)/g, (match) => {
        const marker = `${MARKER_PREFIX}OP${operatorMarkers.length}${MARKER_SUFFIX}`;
        operatorMarkers.push(match);
        return marker;
    });

    // Other operators
    s = s.replace(/([+\-*/%=<>!&|^~?:]+)/g, (match) => {
        if (match.includes('&') || match.includes(';')) return match;
        const marker = `${MARKER_PREFIX}OP${operatorMarkers.length}${MARKER_SUFFIX}`;
        operatorMarkers.push(match);
        return marker;
    });

    // Brackets
    const bracketMarkers: string[] = [];
    s = s.replace(/([(){}[\]]+)/g, (match) => {
        const marker = `${MARKER_PREFIX}BR${bracketMarkers.length}${MARKER_SUFFIX}`;
        bracketMarkers.push(match);
        return marker;
    });

    // Restore markers
    bracketMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}BR${i}${MARKER_SUFFIX}`, `<span style="color:${JS_BRACKET_COLOR}">${val}</span>`);
    });
    operatorMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}OP${i}${MARKER_SUFFIX}`, `<span style="color:${JS_OPERATOR_COLOR}">${val}</span>`);
    });
    functionMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}FN${i}${MARKER_SUFFIX}`, `<span style="color:${JS_FUNCTION_COLOR}">${val}</span>`);
    });
    keywordMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}KW${i}${MARKER_SUFFIX}`, `<span style="color:${JS_KEYWORD_COLOR}">${val}</span>`);
    });
    numberMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}NUM${i}${MARKER_SUFFIX}`, `<span style="color:${JS_NUMBER_COLOR}">${val}</span>`);
    });
    stringMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}STR${i}${MARKER_SUFFIX}`, `<span style="color:${JS_STRING_COLOR}">${val}</span>`);
    });

    return s;
}

export interface CodeBlockLine {
    text: string;
    dim?: boolean;
}

export interface CodeBlockProps {
    title: string;
    lines: CodeBlockLine[];
}

export function CodeBlock({ title, lines }: CodeBlockProps) {
    // Build HTML with syntax highlighting and proper whitespace preservation
    const content = lines.map((line) => {
        // Check if line is a comment
        const trimmed = line.text.trimStart();
        const isComment = trimmed.startsWith('//') || trimmed.startsWith('/*');

        let highlightedText: string;
        const baseColor = line.dim ? JS_COMMENT_COLOR : JS_DEFAULT_COLOR;

        if (isComment) {
            // Comments - simple escape and color
            highlightedText = line.text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            highlightedText = `<span style="color:${JS_COMMENT_COLOR}">${highlightedText}</span>`;
        } else {
            // Apply syntax highlighting
            highlightedText = highlightJs(line.text);
        }

        return `<span style="display: block; white-space: pre; color: ${baseColor};">${highlightedText || '\u00A0'}</span>`;
    }).join('');

    return (
        <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
            <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">{title}</div>
            <pre
                className="bg-zinc-950"
                style={{
                    whiteSpace: 'pre',
                    margin: 0,
                    padding: '1rem 1.25rem',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 1.6,
                    overflow: 'auto',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                }}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
