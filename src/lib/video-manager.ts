type VideoListener = (activeId: string | null) => void;

let currentActiveVideoId: string | null = null;
const listeners = new Set<VideoListener>();

export const videoManager = {
  play(id: string) {
    currentActiveVideoId = id;
    listeners.forEach((fn) => {
      try {
        fn(currentActiveVideoId);
      } catch {
        // Safe dispatch
      }
    });
  },
  stop(id: string) {
    if (currentActiveVideoId === id) {
      currentActiveVideoId = null;
      listeners.forEach((fn) => {
        try {
          fn(null);
        } catch {
          // Safe dispatch
        }
      });
    }
  },
  subscribe(fn: VideoListener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  getActiveId() {
    return currentActiveVideoId;
  },
};
