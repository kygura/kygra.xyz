import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

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
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <audio
        ref={audioRef}
        src="/soundtrack.mp3"
        loop
        onEnded={() => setIsPlaying(true)}
        onPause={() => {
          // If manually paused via controls (if we expose them) or system
        }}
      />
      <Button
        variant="outline"
        size="icon"
        className={`rounded-full w-12 h-12 backdrop-blur-sm shadow-lg hover:scale-105 transition-all duration-300 ${isPlaying && !isMuted
            ? "bg-green-500 hover:bg-green-600 border-green-600 text-white"
            : "bg-background/80 border-primary/20 hover:border-primary/50"
          }`}
        onClick={togglePlayback}
        aria-label={isPlaying ? (isMuted ? "Unmute soundtrack" : "Mute soundtrack") : "Play soundtrack"}
      >
        {!isPlaying ? (
          <Play className="w-5 h-5 ml-1" />
        ) : isMuted ? (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};
