import { useEffect, useRef, useState } from "react";

type BrowserRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type BrowserRecognitionConstructor = new () => BrowserRecognition;

type UseDictationOptions = {
  onTranscript: (text: string) => void;
  onUnavailable: () => void;
  lang?: string;
};

/** Dictado real vía Web Speech API del navegador — sin fallback fabricado, ver `onUnavailable`. */
export function useDictation({ onTranscript, onUnavailable, lang = "es-MX" }: UseDictationOptions) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<BrowserRecognition | null>(null);

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const dictar = () => {
    const recognitionWindow = window as unknown as {
      SpeechRecognition?: BrowserRecognitionConstructor;
      webkitSpeechRecognition?: BrowserRecognitionConstructor;
    };
    const Recognition = recognitionWindow.SpeechRecognition || recognitionWindow.webkitSpeechRecognition;
    if (!Recognition) {
      onUnavailable();
      return;
    }
    recognitionRef.current?.stop();
    const recognition = new Recognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
      if (result) onTranscript(result.trim());
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  return { isListening, dictar };
}
