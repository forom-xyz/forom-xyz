import { create } from 'zustand';

export type AppPhase = 'loading' | 'mood' | 'lobby' | 'color-select' | 'creation-flow' | 'grid';
export type AppLanguage = 'fr' | 'en' | 'es';

/**
 * @interface AppStore
 * Global state management for core application flows, phase transitions, and user context.
 * Decouples top-level routing/phase state from App.tsx.
 */
interface AppStore {
  /** The current architectural phase of the user's session */
  phase: AppPhase;
  /** Global language preference */
  language: AppLanguage;
  /** Chosen Forom category/color (e.g., from the ChooseColorScreen) */
  selectedColor: string | null;
  /** The specific rule/category the user is attempting to join */
  joinRule: string | null;

  // Actions
  setPhase: (phase: AppPhase) => void;
  setLanguage: (language: AppLanguage) => void;
  setSelectedColor: (color: string | null) => void;
  setJoinRule: (rule: string | null) => void;
  
  /** Resets the user's Forom join context */
  clearJoinContext: () => void;
}

export const useAppStore = create<AppStore>((set, _get) => ({ // eslint-disable-line @typescript-eslint/no-unused-vars
  phase: 'loading',
  language: 'fr',
  selectedColor: null,
  joinRule: null,

  setPhase: (phase: AppPhase) => set({ phase }),
  setLanguage: (language: AppLanguage) => set({ language }),
  setSelectedColor: (color: string | null) => set({ selectedColor: color }),
  setJoinRule: (rule: string | null) => set({ joinRule: rule }),
  
  clearJoinContext: () => set({ selectedColor: null, joinRule: null }),
}));
