// Generic flow diagram component for pipeline/process flows

export interface FlowStage {
    label: string;
    icon?: string;
    desc: string;
    color: string;
    bg: string;
}

export interface FlowDiagramProps {
    stages: FlowStage[];
    description?: string;
    className?: string;
}

export function FlowDiagram({ stages, description, className = '' }: FlowDiagramProps) {
    return (
        <div className={`my-8 ${className}`}>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {stages.map((stage, i) => (
                    <div key={stage.label} className="flex items-center gap-1 shrink-0">
                        <div className={`rounded-xl border px-4 py-3 text-center min-w-[90px] ${stage.bg}`}>
                            {stage.icon && (
                                <p className={`text-lg font-bold ${stage.color}`}>{stage.icon}</p>
                            )}
                            <p className={`text-xs font-bold mt-0.5 ${stage.color}`}>{stage.label}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-tight">{stage.desc}</p>
                        </div>
                        {i < stages.length - 1 && (
                            <span className="text-muted-foreground text-sm font-bold shrink-0">→</span>
                        )}
                    </div>
                ))}
            </div>
            {description && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{description}</p>
            )}
        </div>
    );
}
