import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Check, ChevronsUpDown, Trash2, Link2, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface MemberWithRole extends Profile {
    role: AppRole;
}

interface FamilyRelationship {
    id: string;
    big_id: string;
    little_id: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    members: MemberWithRole[];
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

// ─── Member combobox ────────────────────────────────────────────────────────

function MemberCombobox({
    members,
    value,
    onChange,
    placeholder,
    disabled,
    align = 'start',
}: {
    members: MemberWithRole[];
    value: string | null;
    onChange: (id: string) => void;
    placeholder: string;
    disabled?: boolean;
    align?: 'start' | 'end' | 'center';
}) {
    const [open, setOpen] = useState(false);
    const selected = members.find(m => m.id === value) ?? null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-full justify-between font-normal"
                >
                    {selected ? (
                        <span className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-6 w-6 shrink-0">
                                <AvatarImage src={selected.profile_picture_url ?? undefined} />
                                <AvatarFallback className="text-xs bg-muted text-muted-foreground font-medium">
                                    {getInitials(selected.full_name ?? selected.email ?? '?')}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate text-sm">{selected.full_name ?? selected.email}</span>
                        </span>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 bg-background text-foreground" align={align}>
                <div
                    className="p-1"
                    style={{
                        height: '280px',
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehavior: 'none',
                    }}
                    onWheel={e => e.stopPropagation()}
                    onTouchMove={e => e.stopPropagation()}
                >
                    <Command>
                        <CommandInput placeholder="Search members..." />
                        <CommandList>
                            <CommandEmpty>No members found.</CommandEmpty>
                            <CommandGroup>
                                {members.map(m => (
                                    <CommandItem
                                        key={m.id}
                                        value={`${m.full_name ?? ''} ${m.email ?? ''}`}
                                        onSelect={() => {
                                            onChange(m.id);
                                            setOpen(false);
                                        }}
                                        className="flex items-center gap-3 py-2"
                                    >
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src={m.profile_picture_url ?? undefined} />
                                            <AvatarFallback className="text-xs bg-muted text-muted-foreground font-medium">
                                                {getInitials(m.full_name ?? m.email ?? '?')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span>{m.full_name ?? 'No name'}</span>
                                            <span className="text-xs">{m.email}</span>
                                        </div>
                                        <Check
                                            className={cn('h-4 w-4 shrink-0', value === m.id ? 'opacity-100' : 'opacity-0')}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ─── Full-width arrow ────────────────────────────────────────────────────────
// CSS line for the shaft + SVG chevron-only for the head.
// Kept separate so they never overlap and the weight stays consistent.

function ConnectionArrow() {
    return (
        <div className="flex-1 flex items-center mx-2 min-w-0">
            <div className="flex-1 h-px bg-border" />
            <svg
                viewBox="0 0 6 10"
                className="h-2.5 w-1.5 shrink-0 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M1 1l4 4-4 4" />
            </svg>
        </div>
    );
}

// ─── Main modal ────────────────────────────────────────────────────────────

export function ManageFamilyModal({ open, onClose, members }: Props) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [bigId, setBigId] = useState<string | null>(null);
    const [littleId, setLittleId] = useState<string | null>(null);
    const [linking, setLinking] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data: relationships = [], isLoading } = useQuery<FamilyRelationship[]>({
        queryKey: ['family-relationships'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('family_relationships')
                .select('id, big_id, little_id');
            if (error) return [];
            return data ?? [];
        },
        staleTime: 1000 * 60 * 5,
    });

    const memberMap = new Map(members.map(m => [m.id, m]));
    const existingLittleIds = new Set(relationships.map(r => r.little_id));
    const availableLittles = members.filter(m => !existingLittleIds.has(m.id));

    async function handleLink() {
        if (!bigId || !littleId) return;
        if (bigId === littleId) {
            toast({ title: 'Invalid', description: 'A member cannot be their own big.', variant: 'destructive' });
            return;
        }
        setLinking(true);
        try {
            const { error } = await supabase
                .from('family_relationships')
                .insert({ big_id: bigId, little_id: littleId });
            if (error) throw error;
            toast({ title: 'Linked', description: 'Big/little connection created.' });
            setBigId(null);
            setLittleId(null);
            await queryClient.invalidateQueries({ queryKey: ['family-relationships'] });
        } catch (err) {
            toast({
                title: 'Error',
                description: err instanceof Error ? err.message : 'Failed to create link.',
                variant: 'destructive',
            });
        } finally {
            setLinking(false);
        }
    }

    async function handleUnlink(relId: string) {
        setDeletingId(relId);
        try {
            const { error } = await supabase
                .from('family_relationships')
                .delete()
                .eq('id', relId);
            if (error) throw error;
            toast({ title: 'Unlinked', description: 'Connection removed.' });
            await queryClient.invalidateQueries({ queryKey: ['family-relationships'] });
        } catch (err) {
            toast({
                title: 'Error',
                description: err instanceof Error ? err.message : 'Failed to remove link.',
                variant: 'destructive',
            });
        } finally {
            setDeletingId(null);
        }
    }

    const canLink = !!bigId && !!littleId && bigId !== littleId && !linking;

    return (
        <DialogPrimitive.Root open={open} onOpenChange={v => { if (!v) onClose(); }}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

                <DialogPrimitive.Content
                    className={cn(
                        'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
                        'flex w-[90vw] max-w-lg flex-col gap-4',
                        'rounded-lg border bg-background p-6 shadow-lg',
                        'duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
                        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
                        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
                        'max-h-[90vh] overflow-y-auto',
                    )}
                >
                    {/* Header */}
                    <div className="flex flex-col space-y-1.5">
                        <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                            Manage Big/Little Links
                        </DialogPrimitive.Title>
                    </div>

                    {/* ── Add new link ── */}
                    <div className="space-y-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Add New Link
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                                <MemberCombobox
                                    members={members}
                                    value={bigId}
                                    onChange={setBigId}
                                    placeholder="Select big…"
                                    align="start"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <MemberCombobox
                                    members={availableLittles}
                                    value={littleId}
                                    onChange={setLittleId}
                                    placeholder="Select little…"
                                    disabled={availableLittles.length === 0}
                                    align="end"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleLink}
                            disabled={!canLink}
                            className="w-full gap-2"
                        >
                            {linking
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Link2 className="h-4 w-4" />
                            }
                            Link
                        </Button>
                    </div>

                    <Separator />

                    {/* ── Existing connections ── */}
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Existing Connections
                            {relationships.length > 0 && (
                                <span className="ml-1.5 normal-case font-normal">
                                    ({relationships.length})
                                </span>
                            )}
                        </p>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : relationships.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No connections yet.
                            </p>
                        ) : (
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {relationships.map(rel => {
                                    const big = memberMap.get(rel.big_id);
                                    const little = memberMap.get(rel.little_id);
                                    if (!big || !little) return null;
                                    return (
                                        <div
                                            key={rel.id}
                                            className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-card/60 transition-colors group"
                                        >
                                            {/* Big side */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Avatar className="h-8 w-8 shrink-0">
                                                    <AvatarImage src={big.profile_picture_url ?? undefined} />
                                                    <AvatarFallback className="text-xs bg-muted text-muted-foreground font-medium">
                                                        {getInitials(big.full_name ?? big.email ?? '?')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium whitespace-nowrap">
                                                    {big.full_name?.split(' ')[0] ?? big.email}
                                                </span>
                                            </div>

                                            <ConnectionArrow />

                                            {/* Little side */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Avatar className="h-8 w-8 shrink-0">
                                                    <AvatarImage src={little.profile_picture_url ?? undefined} />
                                                    <AvatarFallback className="text-xs bg-muted text-muted-foreground font-medium">
                                                        {getInitials(little.full_name ?? little.email ?? '?')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                    {little.full_name?.split(' ')[0] ?? little.email}
                                                </span>
                                            </div>

                                            {/* Delete */}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 shrink-0 ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                                onClick={() => handleUnlink(rel.id)}
                                                disabled={deletingId === rel.id}
                                                title="Remove connection"
                                            >
                                                {deletingId === rel.id
                                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                                    : <Trash2 className="h-4 w-4" />
                                                }
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}

export default ManageFamilyModal;
