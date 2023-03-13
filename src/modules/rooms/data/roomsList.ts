export interface Room {
  id: number;
  roomName: string;
  isPlaying: boolean;
  src?: string;
  progress: number;
  event?: string;
}

export const roomsList = new Map<number, Room>();
