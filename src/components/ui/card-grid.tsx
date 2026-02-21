// Generic card grid component for displaying cards in a grid layout

export interface CardItem {
    id: string;
    title: string;
    subtitle?: string;
    color: string;
    bg: string;
    border: string;
    content: React.ReactNode;
}

export interface CardGridProps {
    cards: CardItem[];
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}

export function CardGrid({ cards, columns = 3, className = '' }: CardGridProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
        <div className={`my-6 grid ${gridCols[columns]} gap-3 ${className}`}>
            {cards.map((card) => (
                <div key={card.id} className={`rounded-xl border ${card.bg} ${card.border} overflow-hidden`}>
                    <div className="px-4 py-3 border-b border-inherit">
                        <p className={`text-xs font-black ${card.color}`}>{card.title}</p>
                        {card.subtitle && (
                            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                        )}
                    </div>
                    <div className="px-4 py-3">
                        {card.content}
                    </div>
                </div>
            ))}
        </div>
    );
}
