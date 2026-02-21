// Generic cycle diagram component for circular/iterative processes

export interface CyclePhase {
    title: string;
    color: string;
    bg: string;
    border: string;
    desc: string;
}

export interface CycleDiagramProps {
    phases: CyclePhase[];
    className?: string;
}

export function CycleDiagram({ phases, className = '' }: CycleDiagramProps) {
    return (
        <div className={`my-8 space-y-3 ${className}`}>
            {phases.map((phase, i) => (
                <div key={i} className="flex items-start gap-4">
                    <div className={`rounded-xl border ${phase.border} ${phase.bg} px-4 py-3 shrink-0 min-w-[140px]`}>
                        <p className={`text-xs font-bold ${phase.color}`}>{phase.title}</p>
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-xs text-muted-foreground leading-relaxed">{phase.desc}</p>
                    </div>
                    {i < phases.length - 1 && (
                        <div className="flex items-center justify-center shrink-0 w-8">
                            <span className="text-muted-foreground text-lg">↓</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
