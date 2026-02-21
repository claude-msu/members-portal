// Generic comparison diagram component for side-by-side comparisons

export interface ComparisonItem {
    label: string;
    color: string;
    border: string;
    header: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
}

export interface ComparisonDiagramProps {
    items: ComparisonItem[];
    className?: string;
}

export function ComparisonDiagram({ items, className = '' }: ComparisonDiagramProps) {
    return (
        <div className={`my-8 grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
            {items.map((item) => (
                <div key={item.label} className={`rounded-xl border ${item.border} overflow-hidden`}>
                    <div className={`px-4 py-2.5 ${item.header}`}>
                        <p className={`text-xs font-bold ${item.color}`}>{item.label}</p>
                    </div>
                    <div className="p-4">
                        {item.content}
                        {item.footer && <div className="mt-4">{item.footer}</div>}
                    </div>
                </div>
            ))}
        </div>
    );
}
