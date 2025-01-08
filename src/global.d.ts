declare global {
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {}

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
  }  

  interface SpeechRecognitionResult {
    transcript: string;
    confidence: number;
  }

  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export {};
