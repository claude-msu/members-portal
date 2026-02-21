// Generic data table component for structured data display

export interface TableColumn {
    key: string;
    label: string;
    className?: string;
}

export interface TableRow {
    [key: string]: React.ReactNode;
}

export interface DataTableProps {
    columns: TableColumn[];
    rows: TableRow[];
    footer?: React.ReactNode;
    className?: string;
}

export function DataTable({ columns, rows, footer, className = '' }: DataTableProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
    }[columns.length] || 'grid-cols-1';

    return (
        <div className={`my-6 rounded-xl border border-border overflow-hidden ${className}`}>
            <div className={`grid ${gridCols} bg-muted/50 border-b border-border text-xs font-semibold text-muted-foreground`}>
                {columns.map((col) => (
                    <div key={col.key} className={`px-3 py-2.5 ${col.className || ''}`}>
                        {col.label}
                    </div>
                ))}
            </div>
            {rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className={`grid ${gridCols} border-b border-border last:border-b-0 text-xs`}
                >
                    {columns.map((col) => (
                        <div key={col.key} className={`px-3 py-2.5 ${col.className || ''}`}>
                            {row[col.key]}
                        </div>
                    ))}
                </div>
            ))}
            {footer && (
                <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/20">
                    {footer}
                </div>
            )}
        </div>
    );
}
