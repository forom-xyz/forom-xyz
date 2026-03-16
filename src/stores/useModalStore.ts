import { create } from 'zustand';
import type { Quest } from '../components/QuestModal';
import type { Memory } from '../data/memories';
import type { VideoData } from '../data/videos';

/**
 * @interface ModalStore
 * Global orchestration for modal overlays and side panels.
 * Prevents prop-drilling open/close bools deeply into CarouselGrid.
 */
interface ModalStore {
  // Modal visibility flags
  isWalletOpen: boolean;
  isQuestOpen: boolean;
  isUserOpen: boolean;
  isRomapOpen: boolean;
  isSettingsOpen: boolean;
  isMemoryOpen: boolean;
  isVideoOpen: boolean;

  // Selected Payloads (Data displayed inside the active modal)
  selectedQuest: Quest | null;
  selectedUserId: string | null;
  selectedMemory: Memory | null;
  selectedVideo: VideoData | null;

  // Open Actions
  openWallet: () => void;
  openQuest: (quest?: Quest) => void;
  openUser: (userId?: string) => void;
  openRomap: () => void;
  openSettings: () => void;
  openMemory: (memory?: Memory) => void;
  openVideo: (video?: VideoData) => void;

  // Close Actions
  closeWallet: () => void;
  closeQuest: () => void;
  closeUser: () => void;
  closeRomap: () => void;
  closeSettings: () => void;
  closeMemory: () => void;
  closeVideo: () => void;

  /** Instant reset button for UI emergency or phase shifts */
  closeAll: () => void;
}

export const useModalStore = create<ModalStore>((set, _get) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
  // Defaults
  isWalletOpen: false,
  isQuestOpen: false,
  isUserOpen: false,
  isRomapOpen: false,
  isSettingsOpen: false,
  isMemoryOpen: false,
  isVideoOpen: false,

  selectedQuest: null,
  selectedUserId: null,
  selectedMemory: null,
  selectedVideo: null,

  // Setters
  openWallet: () => set({ isWalletOpen: true }),
  closeWallet: () => set({ isWalletOpen: false }),

  openQuest: (quest?: Quest) => set({ isQuestOpen: true, selectedQuest: quest ?? null }),
  closeQuest: () => set({ isQuestOpen: false, selectedQuest: null }),

  openUser: (userId?: string) => set({ isUserOpen: true, selectedUserId: userId ?? null }),
  closeUser: () => set({ isUserOpen: false, selectedUserId: null }),

  openRomap: () => set({ isRomapOpen: true }),
  closeRomap: () => set({ isRomapOpen: false }),

  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),

  openMemory: (memory?: Memory) => set({ isMemoryOpen: true, selectedMemory: memory ?? null }),
  closeMemory: () => set({ isMemoryOpen: false, selectedMemory: null }),

  openVideo: (video?: VideoData) => set({ isVideoOpen: true, selectedVideo: video ?? null }),
  closeVideo: () => set({ isVideoOpen: false, selectedVideo: null }),

  closeAll: () => set({
    isWalletOpen: false,
    isQuestOpen: false,
    isUserOpen: false,
    isRomapOpen: false,
    isSettingsOpen: false,
    isMemoryOpen: false,
    isVideoOpen: false,
    selectedQuest: null,
    selectedUserId: null,
    selectedMemory: null,
    selectedVideo: null,
  }),
}));
