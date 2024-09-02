export interface ITitlebarEvents {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

declare global {
  interface Window {
    titlebarEvents: ITitlebarEvents;
  }
}