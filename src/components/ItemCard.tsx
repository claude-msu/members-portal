import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { MetadataItem, CardAction, MembershipInfo } from '@/types/modal.types';

interface ItemCardProps {
    title: string;
    badges?: React.ReactNode[];
    metadata?: MetadataItem[];
    description?: string;
    members?: {
        data: MembershipInfo[];
        onViewAll?: () => void;
        maxDisplay?: number;
    };
    actions?: CardAction[];
    className?: string;
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const ItemCard = ({
    title,
    badges,
    metadata,
    description,
    members,
    actions,
    className = '',
}: ItemCardProps) => {
    const maxDisplay = members?.maxDisplay || 5;
    const displayedMembers = members?.data.slice(0, maxDisplay) || [];
    const remainingCount = (members?.data.length || 0) - maxDisplay;

    const iconActions = actions?.filter(a => a.size === 'icon') ?? [];
    const mainActions = actions?.filter(a => a.size !== 'icon') ?? [];

    return (
        <Card className={`flex flex-col h-full w-full ${className}`}>
            <CardHeader className="pb-0">
                <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-lg flex-1 min-w-0">{title}</CardTitle>
                    {(badges?.length ?? 0) > 0 || iconActions.length > 0 ? (
                        <div className="flex flex-row items-center gap-3 shrink-0">
                            {badges && badges.length > 0 && (
                                <>
                                    {badges.map((badge, index) => (
                                        <div key={index}>{badge}</div>
                                    ))}
                                </>
                            )}
                            {iconActions.length > 0 && (
                                <>
                                    {iconActions.map((action, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={action.onClick}
                                            disabled={action.disabled || action.loading}
                                            title={action.label}
                                            className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-colors duration-150 [&_svg]:h-4 [&_svg]:w-4"
                                        >
                                            {action.icon}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>
                    ) : null}
                </div>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 min-h-0">
                {/* Metadata */}
                {metadata && metadata.length > 0 && (
                    <div className="space-y-3 text-sm text-muted-foreground pt-1">
                        {metadata.map((item, index) => (
                            item.render ? (
                                item.render(item)
                            ) : (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 ${item.interactive
                                        ? 'cursor-pointer group w-fit'
                                        : ''
                                        }`}
                                    onClick={item.onClick}
                                >
                                    <div className={item.interactive ? 'group-hover:text-orange-600 transition-colors' : ''}>
                                        {item.icon}
                                    </div>
                                    <span
                                        className={
                                            item.interactive
                                                ? 'underline decoration-transparent group-hover:decoration-orange-600 group-hover:text-orange-600 transition-all'
                                                : ''
                                        }
                                    >
                                        {item.text}
                                    </span>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* Members Preview */}
                {members && members.data.length > 0 && (
                    <div className="space-y-3 text-sm text-muted-foreground mt-3">
                        <div className="flex -space-x-2">
                            {displayedMembers.map((member) => (
                                <Avatar key={member.id} className="h-8 w-8 border-2 border-page">
                                    <AvatarImage src={member.profile.profile_picture_url || undefined} />
                                    <AvatarFallback className="text-xs">
                                        {member.profile.full_name
                                            ? getInitials(member.profile.full_name)
                                            : member.profile.email.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                            {remainingCount > 0 && (
                                <div className="h-8 w-8 rounded-full border-2 border-page bg-muted flex items-center justify-center text-xs">
                                    +{remainingCount}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Description */}
                {description && (
                    <div className="text-sm line-clamp-3 text-muted-foreground flex-1 space-y-3 break-words pt-3 whitespace-pre-line">
                        {description}
                    </div>
                )}

                {/* Actions: main actions only (icon actions are in header) */}
                {mainActions.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4">
                        {mainActions.map((action, index) => (
                            <Button
                                key={index}
                                className="w-full"
                                variant={action.variant || 'default'}
                                onClick={action.onClick}
                                disabled={action.disabled || action.loading}
                            >
                                {action.icon}
                                {action.loading ? 'Loading...' : action.label}
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};