import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SoundtrackPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25;

    // Attempt to play automatically
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log("Autoplay prevented:", error);
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.play().then(() => {
        setIsPlaying(true);
        // If we're starting playback, ensure we're not muted unless user explicitly muted previously? 
        // Actually, just play.
      }).catch((err) => {
        console.error("Playback failed", err);
        toast.error("Could not play soundtrack");
      });
    } else {
      // If playing, this button will act as a Mute toggle based on requirement "can be muted"
      // But we need a way to un-mute too.
      // Let's separate functionality:
      // If we are NOT playing (autoplay blocked), click -> PLAY.
      // If we ARE playing, click -> TOGGLE MUTE.

      const newMutedState = !isMuted;
      audio.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:right-12 lg:right-16 z-50 animate-fade-in">
      <audio
        ref={audioRef}
        src="/soundtrack.mp3"
        loop
        onEnded={() => setIsPlaying(true)}
        onPause={() => {
          // If manually paused via controls (if we expose them) or system
        }}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={`rounded-full w-10 h-10 backdrop-blur-sm shadow-lg hover:scale-105 transition-all duration-300 ${isPlaying && !isMuted
              ? "bg-primary hover:bg-black border-primary text-white"
              : "bg-background/80 border-primary/20 hover:border-primary/50"
              }`}
            onClick={togglePlayback}
            aria-label={isPlaying ? (isMuted ? "Unmute soundtrack" : "Mute soundtrack") : "Play soundtrack"}
          >
            {!isPlaying ? (
              <Play className="w-6 h-6 ml-1" />
            ) : isMuted ? (
              <VolumeX className="w-6 h-6 text-muted-foreground" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </Button>
        </TooltipTrigger>

    <TooltipContent side="left" className="m-2">
      <p className="text-xs font-medium flex items-center gap-2">
      <span className="animate-[spin_3s_linear_infinite]">💿</span>
            <span className="text-primary">The Girl Next Door</span>
            by
            <span className="text-primary">tomppabeats</span>
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
