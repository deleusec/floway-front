// Interface pour les événements MQTT
export interface IEvent {
  type: "audio" | "internal" | "text";
  friend_id?: string | null; 
  timestamp: number; 
  audio_name?: string; 
  text_content?: string; 
}