type Word = {
  id: string;
  word: string;
  part_of_speech: string;
  is_new?: boolean;
  definition: string;
  example: string;
  platform: string;
  show_name: string;
  season: number;
  episode: number;
};

type ExtensionMessage =
  | { type: 'PONG' }
  | { type: 'DISCONNECTED' }
  | { type: 'EXTENSION_DATA'; data: unknown }
  | { type: 'CONNECT_RESPONSE'; success: boolean; permanentDisconnect?: boolean }
  | { type: string; [key: string]: unknown };

type MessageResponse =
  | { type: 'PONG' }
  | { type: 'DISCONNECTED' }
  | { success: boolean; permanentDisconnect?: boolean }
  | null;

export class ExtensionConnector {
  private static _extensionId: string = '';
  private static readonly TIMEOUT = 1000;

  private static get chrome(): typeof chrome | null {
    return typeof window !== 'undefined' && 'chrome' in window
      ? (window.chrome as typeof chrome)
      : null;
  }

  private static permanentDisconnect = false;

  static setExtensionId(id: string) {
    this._extensionId = id;
  }

  static async isExtensionInstalled(): Promise<boolean> {
    const chrome = this.chrome;
    if (!chrome?.runtime?.sendMessage || !this._extensionId || this._extensionId.trim() === '') {
      console.log('Extension not installed, Chrome APIs not available, or extension ID not set');
      return false;
    }

    try {
      const response: MessageResponse = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          this._extensionId,
          { type: 'PING' },
          (resp) => {
            if (chrome.runtime.lastError) {
              console.warn('Extension ping failed:', chrome.runtime.lastError.message);
              resolve(null);
            } else {
              resolve(resp);
            }
          }
        );

        setTimeout(() => resolve(null), this.TIMEOUT);
      });

      if (response && 'permanentDisconnect' in response) {
        this.permanentDisconnect = response.permanentDisconnect ?? false;
      }

      return !!response && 'type' in response && response.type === 'PONG';
    } catch (error) {
      console.error('Error checking extension installation:', error);
      return false;
    }
  }

  static async connect(force = false): Promise<boolean> {
    const chrome = this.chrome;
    if (!chrome?.runtime?.sendMessage) return false;

    try {
      const response: MessageResponse = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          this._extensionId,
          { type: 'CONNECT_REQUEST', force },
          resolve
        );
      });

      if (response && 'permanentDisconnect' in response) {
        this.permanentDisconnect = response.permanentDisconnect ?? false;
      }

      return !!response && 'success' in response && response.success === true;
    } catch (error) {
      console.error('Connection error:', error);
      return false;
    }
  }

  static listenForWordMessages(callback: (word: Word) => void): () => void {
    const handler = (event: MessageEvent) => {
        if (event.source !== window || event.data?.source !== 'chrome-extension') return;

        if (event.data?.type === 'WORD_DATA') {
            const word = event.data.word as Word;
            console.log('Got WORD_DATA from extension:', word);
            callback(word);
        }
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }

  static async disconnect(permanent = false): Promise<boolean> {
    const chrome = this.chrome;
    if (!chrome?.runtime?.sendMessage) return false;

    try {
      const response: MessageResponse = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          this._extensionId,
          { type: 'DISCONNECT_REQUEST', permanent },
          resolve
        );
      });

      return !!response && 'success' in response && response.success === true;
    } catch (error) {
      console.error('Disconnection error:', error);
      return false;
    }
  }

  static listenForMessages(callback: (data: ExtensionMessage) => void): () => void {
    const chrome = this.chrome;
    if (!chrome?.runtime?.onMessage) {
      console.warn('Extension environment not detected');
      return () => {};
    }

    const handler = (message: ExtensionMessage, sender: chrome.runtime.MessageSender) => {
      if (sender.id === this._extensionId) {
        callback(message);
      }
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }

  static async sendData(data: Word[]): Promise<boolean> {
    const chrome = this.chrome;
    if (!chrome?.runtime?.sendMessage) return false;

    try {
      const response: { success?: boolean } = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          this._extensionId,
          { type: 'SEND_DATA', data },
          resolve
        );
      });

      return response?.success === true;
    } catch (error) {
      console.error('Failed to send data:', error);
      return false;
    }
  }
}
