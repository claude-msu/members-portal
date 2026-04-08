import type { CSSProperties } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * CodeBlock — unified syntax-highlighted code display for lecture pages.
 *
 * Usage:
 *   <CodeBlock
 *     language="python"
 *     title="database.py — connection setup"
 *     lines={[
 *       'from sqlalchemy import create_engine',
 *       'engine = create_engine(DATABASE_URL)',
 *     ]}
 *   />
 *
 * Supported languages (Prism identifiers):
 *   cpp | python | sql | typescript | tsx | javascript | yaml | markdown | bash | json | ...
 *   Any valid Prism language slug works.
 */

export type CodeLanguage =
    | 'cpp'
    | 'python'
    | 'sql'
    | 'typescript'
    | 'tsx'
    | 'javascript'
    | 'yaml'
    | 'markdown'
    | 'bash'
    | 'json'
    | (string & {});

export interface CodeBlockProps {
    language: CodeLanguage;
    title: string;
    lines: string[];
    copyable?: boolean;
}

const highlighterStyle: CSSProperties = {
    margin: 0,
    padding: '1rem 1.25rem',
    background: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 1.6,
    overflow: 'visible',
};

export function CodeBlock({ language, title, lines, copyable = false }: CodeBlockProps) {
    const code = lines.join('\n');

    return (
        <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 font-mono text-xs">
            <div className="bg-zinc-800 px-4 py-2 text-zinc-400 border-b border-zinc-700 select-none">
                {title}
            </div>
            <div className="bg-zinc-950 overflow-x-auto overscroll-x-contain">
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={highlighterStyle}
                    codeTagProps={{ style: !copyable && { userSelect: 'none', WebkitUserSelect: 'none' } }}
                    PreTag="div"
                    wrapLongLines={false}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
