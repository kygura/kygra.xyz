import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { GuestbookEntry } from "@/components/GuestbookEntry";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, SendHorizontal, ArrowDown } from "lucide-react";



interface Entry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const PAGE_SIZE = 12;
const MAX_CHARS = 280;

const Guestbook = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const { toast } = useToast();

  const fetchEntries = async (offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) throw error;

      const newEntries = data || [];

      if (offset === 0) {
        setEntries(newEntries);
      } else {
        setEntries(prev => [...prev, ...newEntries]);
      }

      if (newEntries.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: "Error",
        description: "Failed to load guestbook entries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    setLoadingMore(true);
    fetchEntries(entries.length);
  };

  useEffect(() => {
    fetchEntries();

    // Set up realtime subscription
    const channel = supabase
      .channel('public:guestbook')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
        setEntries((current) => {
          // Check if entry already exists to prevent duplicates from overlapping fetches/subscription
          if (current.some(e => e.id === payload.new.id)) return current;
          return [payload.new as Entry, ...current];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to sign the guestbook.",
        variant: "destructive",
      });
      return;
    }

    if (cooldown) {
      toast({
        title: "Slow down",
        description: "Please wait a moment before posting again.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('guestbook')
        .insert([
          {
            name: name.trim() || "Anonymous",
            message: message.trim()
          }
        ]);

      if (error) throw error;

      setMessage("");
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000); // 30s cooldown

      toast({
        title: "Signed!",
        description: "Thanks for signing the guestbook.",
      });

    } catch (error) {
      console.error('Error submitting entry:', error);
      toast({
        title: "Error",
        description: "Failed to sign the guestbook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-6 md:px-12 lg:px-16 py-12 max-w-3xl mx-auto flex flex-col min-h-screen">
      <div className="prose-minimal animate-fade-in flex-grow">
        <h1 className="text-5xl md:text-6xl font-display font-light mb-4">
          Guestbook
        </h1>

        <p className="text-lg font-light text-muted-foreground mb-8">
          Leave a mark brother, say hello, or just let me know you were here.
        </p>

        <Card className="mb-12 border-muted bg-card/40 shadow-sm">
          <CardContent className="pt-4 pb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-3">
                <Input
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-muted w-1/3"
                />
                <div className="relative flex-1">
                  <AutosizeTextarea
                    placeholder="Leave a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={MAX_CHARS}
                    minRows={1}
                    maxRows={8}
                    className="w-full bg-background/50 border-muted pr-12 resize-none"
                  />
                  <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground pointer-events-none select-none">
                    {message.length}/{MAX_CHARS}
                  </span>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || cooldown || !message.trim()}
                  variant="secondary"
                  size="icon"
                  className="shrink-0"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-xl font-light text-foreground/70 mb-4">Signatures</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 w-full bg-muted/10 animate-pulse rounded-lg border border-muted/20" />
              ))}
            </div>
          ) : entries.length > 0 ? (
            <>
              <div className="space-y-3">
                {entries.map((entry) => (
                  <GuestbookEntry key={entry.id} {...entry} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="ghost"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {loadingMore ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowDown className="mr-2 h-4 w-4" />
                    )}
                    Load more
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-muted rounded-lg bg-card/20">
              <p>No entries yet. Be the first to sign!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Guestbook;
