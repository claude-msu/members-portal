// C++ code block with syntax highlighting and preserved indentation.
// Uses inline styles (no Tailwind in dynamic strings) so styles survive build.

const KEYWORD_COLOR = '#60a5fa'; // blue-400
const STRING_COLOR = '#fbbf24'; // amber-400
const TYPE_COLOR = '#34d399'; // emerald-400
const FUNCTION_COLOR = '#a78bfa'; // purple-400
const OPERATOR_COLOR = '#f472b6'; // pink-400
const NUMBER_COLOR = '#d4a574'; // warm sand (numbers)
const BRACKET_COLOR = '#94a3b8'; // slate-400
const COMMENT_COLOR = '#71717a'; // zinc-500
const DEFAULT_COLOR = '#d4d4d8'; // zinc-300

function highlightCpp(raw: string): string {
    let s = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const MARKER_PREFIX = '\u0001';
    const MARKER_SUFFIX = '\u0002';

    const stringMarkers: string[] = [];
    s = s.replace(/"([^"]*)"/g, (match) => {
        const marker = `${MARKER_PREFIX}STR${stringMarkers.length}${MARKER_SUFFIX}`;
        stringMarkers.push(match);
        return marker;
    });

    const numberMarkers: string[] = [];
    s = s.replace(/\b(\d+\.?\d*)\b/g, (match) => {
        const marker = `${MARKER_PREFIX}NUM${numberMarkers.length}${MARKER_SUFFIX}`;
        numberMarkers.push(match);
        return marker;
    });

    const keywordMarkers: string[] = [];
    s = s.replace(
        /\b(int|void|bool|string|auto|class|struct|public|private|protected|return|if|else|while|for|new|delete|nullptr|true|false|const|size_t|template|typename|virtual|override|using|namespace|include|char|double|float|long|short|unsigned|signed|static|extern|inline|explicit|friend|operator|this|throw|try|catch|enum|typedef|union|volatile|mutable|register|goto|break|continue|switch|case|default|do|static_cast|dynamic_cast|const_cast|reinterpret_cast)\b/g,
        (match) => {
            const marker = `${MARKER_PREFIX}KW${keywordMarkers.length}${MARKER_SUFFIX}`;
            keywordMarkers.push(match);
            return marker;
        }
    );

    s = s.replace(/^(\s*#\w+)/gm, (match) => {
        const marker = `${MARKER_PREFIX}KW${keywordMarkers.length}${MARKER_SUFFIX}`;
        keywordMarkers.push(match);
        return marker;
    });

    const typeMarkers: string[] = [];
    s = s.replace(/\b([A-Z][A-Za-z0-9]+)\b(?=\s*[&lt;({])/g, (match) => {
        const marker = `${MARKER_PREFIX}TYP${typeMarkers.length}${MARKER_SUFFIX}`;
        typeMarkers.push(match);
        return marker;
    });

    const functionMarkers: string[] = [];
    s = s.replace(/\b([a-z][a-zA-Z0-9_]*)\s*(?=\()/g, (match) => {
        const marker = `${MARKER_PREFIX}FN${functionMarkers.length}${MARKER_SUFFIX}`;
        functionMarkers.push(match.trim());
        return marker;
    });

    const operatorMarkers: string[] = [];
    s = s.replace(/(->|\.)/g, (match) => {
        const marker = `${MARKER_PREFIX}OP${operatorMarkers.length}${MARKER_SUFFIX}`;
        operatorMarkers.push(match);
        return marker;
    });

    s = s.replace(/([+\-*/%=<>!&|^~?:]+)/g, (match) => {
        if (match.includes('&') || match.includes(';')) return match;
        const marker = `${MARKER_PREFIX}OP${operatorMarkers.length}${MARKER_SUFFIX}`;
        operatorMarkers.push(match);
        return marker;
    });

    const bracketMarkers: string[] = [];
    s = s.replace(/([(){}[\]]+)/g, (match) => {
        const marker = `${MARKER_PREFIX}BR${bracketMarkers.length}${MARKER_SUFFIX}`;
        bracketMarkers.push(match);
        return marker;
    });

    bracketMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}BR${i}${MARKER_SUFFIX}`, `<span style="color:${BRACKET_COLOR}">${val}</span>`);
    });
    operatorMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}OP${i}${MARKER_SUFFIX}`, `<span style="color:${OPERATOR_COLOR}">${val}</span>`);
    });
    functionMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}FN${i}${MARKER_SUFFIX}`, `<span style="color:${FUNCTION_COLOR}">${val}</span>`);
    });
    typeMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}TYP${i}${MARKER_SUFFIX}`, `<span style="color:${TYPE_COLOR}">${val}</span>`);
    });
    keywordMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}KW${i}${MARKER_SUFFIX}`, `<span style="color:${KEYWORD_COLOR}">${val}</span>`);
    });
    numberMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}NUM${i}${MARKER_SUFFIX}`, `<span style="color:${NUMBER_COLOR}">${val}</span>`);
    });
    stringMarkers.forEach((val, i) => {
        s = s.replace(`${MARKER_PREFIX}STR${i}${MARKER_SUFFIX}`, `<span style="color:${STRING_COLOR}">${val}</span>`);
    });

    return s;
}

export interface CppBlockProps {
    title: string;
    lines: string[];
}

const preStyle: React.CSSProperties = {
    whiteSpace: 'pre',
    margin: 0,
    padding: '1rem 1.25rem',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 1.6,
    overflow: 'auto',
};

export function CppBlock({ title, lines }: CppBlockProps) {
    return (
        <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
            <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">{title}</div>
            <pre
                className="bg-zinc-950"
                style={{ ...preStyle, userSelect: 'none', WebkitUserSelect: 'none' }}
            >
                {lines.map((line, i) =>
                    line.trimStart().startsWith('//') ? (
                        <span
                            key={i}
                            style={{ display: 'block', whiteSpace: 'pre', color: COMMENT_COLOR }}
                        >
                            {line}
                        </span>
                    ) : (
                        <span
                            key={i}
                            style={{ display: 'block', whiteSpace: 'pre', color: DEFAULT_COLOR }}
                            dangerouslySetInnerHTML={{ __html: highlightCpp(line) }}
                        />
                    )
                )}
            </pre>
        </div>
    );
}
