import mqtt, { MqttClient } from 'mqtt';
import { useAuth } from '@/stores/auth';
import { useRunningSessionStore } from '@/stores/session';
import { IEvent } from '@/types';
import { audioManager } from './audioManager';

class MQTTService {
  private client: MqttClient | null = null;
  private isConnected = false;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private readonly brokerUrl = 'wss://node.floway.edgar-lecomte.fr:1886/mqtt';
  private readonly fallbackUrl = 'mqtt://node.floway.edgar-lecomte.fr:1884';

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  /**
   * Establishes connection to the MQTT broker via WebSocket
   */
  async connect(): Promise<boolean> {
    try {
      console.log('🔌 Connecting to MQTT broker via WebSocket...');

      // Get user token for authentication
      const { token } = useAuth.getState();

      if (!token) {
        console.error('❌ No authentication token available for MQTT connection');
        return false;
      }

      // Try WebSocket connection first with authentication
      this.client = mqtt.connect(this.brokerUrl, {
        reconnectPeriod: 5000,
        connectTimeout: 10000,
        clean: true,
        keepalive: 60,
        // Use username/password for authentication with MQTT
        username: 'auth-token',
        password: token,
        // Also try WebSocket headers
        wsOptions: {
          headers: {
            'Authorization': `${token}`,
            'sec-websocket-protocol': token,
          },
        },
        // Alternative: use transformWsUrl to append token to URL
        transformWsUrl: (url, options) => {
          console.log('🔧 Transforming WebSocket URL with token');
          return `${url}?token=${encodeURIComponent(token)}`;
        },
      });

      return new Promise((resolve, reject) => {
        if (!this.client) {
          reject(new Error('Failed to create MQTT client'));
          return;
        }

        this.client.on('connect', () => {
          console.log('✅ Successfully connected to MQTT broker via WebSocket');
          this.isConnected = true;
          this.setupEventListeners();
          this.subscribeToUserEvents();
          resolve(true);
        });

        this.client.on('error', (error) => {
          console.error('❌ MQTT WebSocket connection error:', error);
          this.isConnected = false;
          reject(error);
        });

        this.client.on('offline', () => {
          console.log('📵 MQTT client went offline');
          this.isConnected = false;
        });

        this.client.on('reconnect', () => {
          console.log('🔄 MQTT client attempting to reconnect...');
        });
      });
    } catch (error) {
      console.error('❌ Failed to connect to MQTT broker:', error);
      return false;
    }
  }

  /**
   * Sets up event listeners for the MQTT client
   */
  private setupEventListeners(): void {
    if (!this.client) return;

    this.client.on('message', (topic, message) => {
      try {
        const messageStr = message.toString();
        console.log(`📨 Received message on topic "${topic}":`, messageStr);

        // Parse the message if it's JSON
        let parsedMessage;
        try {
          parsedMessage = JSON.parse(messageStr);
        } catch {
          parsedMessage = messageStr;
        }

        // Handle different types of events
        this.handleIncomingMessage(topic, parsedMessage);
      } catch (error) {
        console.error('❌ Error processing MQTT message:', error);
      }
    });

    this.client.on('close', () => {
      console.log('🔌 MQTT connection closed');
      this.isConnected = false;
    });
  }

  /**
   * Handles incoming MQTT messages based on topic
   */
  private handleIncomingMessage(topic: string, message: any): void {
    console.log(`🎯 Handling message for topic: ${topic}`, message);

    // Add your custom message handling logic here
    // For example, you could emit events or update stores based on the topic

    if (topic.includes('event/')) {
      // Handle event messages
      console.log('📅 Event message received:', message);
      this.handleEventMessage(message);
    }
  }

  /**
   * Handles incoming IEvent messages
   */
  private async handleEventMessage(eventData: any): Promise<void> {
    try {
      // Valider que c'est un événement IEvent valide
      if (!eventData || typeof eventData.type !== 'string') {
        console.warn('⚠️ Événement MQTT invalide:', eventData);
        return;
      }

      const event: IEvent = eventData as IEvent;
      console.log('🎉 Traitement de l\'événement:', event);

      // Ajouter l'événement au store de session en cours
      const { addEvent } = useRunningSessionStore.getState();
      addEvent(event);

      switch (event.type) {
        case 'text':
        case 'internal':
          if (event.text_content) {
            // Faire parler le texte
            this.speakText(event.text_content);
          }
          break;

        case 'audio':
          if (event.audio_name) {
            // Télécharger et jouer l'audio
            await this.playAudio(event.audio_name);
          }
          break;

        default:
          console.warn('⚠️ Type d\'événement non supporté:', event.type);
      }
    } catch (error) {
      console.error('❌ Erreur lors du traitement de l\'événement:', error);
    }
  }

  /**
   * Makes the device speak the provided text via the audio manager
   */
  private speakText(text: string): void {
    console.log('🗣️ MQTT - Demande de lecture vocale:', text);
    audioManager.speakText(text, 'normal');
  }

  /**
   * Plays audio via the audio manager
   */
  private async playAudio(audioName: string): Promise<void> {
    console.log('🎵 MQTT - Demande de lecture audio:', audioName);
    audioManager.playAudio(audioName, 'normal');
  }

  /**
   * Subscribes to user-specific events
   */
  private async subscribeToUserEvents(): Promise<void> {
    const { user } = useAuth.getState();

    if (!user || !this.client || !this.isConnected) {
      console.warn('⚠️ Cannot subscribe: user not authenticated or MQTT not connected');
      return;
    }

    const topic = `event/${user.id}/`;

    try {
      await this.subscribe(topic);
      console.log(`✅ Successfully subscribed to user events: ${topic}`);
    } catch (error) {
      console.error('❌ Failed to subscribe to user events:', error);
    }
  }

  /**
   * Subscribes to a specific MQTT topic
   */
  async subscribe(topic: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      throw new Error('MQTT client not connected');
    }

    return new Promise((resolve, reject) => {
      this.client!.subscribe(topic, { qos: 1 }, (error) => {
        if (error) {
          console.error(`❌ Failed to subscribe to topic "${topic}":`, error);
          reject(error);
        } else {
          console.log(`📡 Successfully subscribed to topic: ${topic}`);
          resolve();
        }
      });
    });
  }

  /**
   * Publishes a message to a specific topic
   */
  async publish(topic: string, message: string | object): Promise<void> {
    if (!this.client || !this.isConnected) {
      throw new Error('MQTT client not connected');
    }

    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

    return new Promise((resolve, reject) => {
      this.client!.publish(topic, messageStr, { qos: 1 }, (error) => {
        if (error) {
          console.error(`❌ Failed to publish to topic "${topic}":`, error);
          reject(error);
        } else {
          console.log(`📤 Successfully published to topic: ${topic}`);
          resolve();
        }
      });
    });
  }

  /**
   * Disconnects from the MQTT broker
   */
  disconnect(): void {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    if (this.client) {
      console.log('🔌 Disconnecting from MQTT broker...');
      this.client.end();
      this.client = null;
      this.isConnected = false;
      console.log('✅ Disconnected from MQTT broker');
    }
  }

  /**
   * Gets the current connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Gets the MQTT client instance
   */
  getClient(): MqttClient | null {
    return this.client;
  }
}

// Export singleton instance
export const mqttService = new MQTTService();
