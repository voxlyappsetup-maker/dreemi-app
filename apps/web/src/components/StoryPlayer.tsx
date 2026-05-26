"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const LANG_MAP: Record<string, string> = {
  ar: "ar-SA",
  en: "en-US",
  fr: "fr-FR",
};

type PlayerState = "idle" | "playing" | "paused";

interface StoryPlayerProps {
  text: string;
  language: string;
}

export function StoryPlayer({ text, language }: StoryPlayerProps) {
  const t = useTranslations("storyView");
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<PlayerState>("idle");
  const [progress, setProgress] = useState(0);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalCharsRef = useRef(0);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      window.speechSynthesis?.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const trackProgress = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const synth = window.speechSynthesis;
      if (!synth.speaking && !synth.paused) {
        setProgress(0);
        setState("idle");
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 500);
  }, []);

  const findVoice = useCallback((lang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    const target = LANG_MAP[lang] ?? lang;
    const prefix = target.split("-")[0];
    return (
      voices.find((v) => v.lang === target) ??
      voices.find((v) => v.lang.startsWith(prefix)) ??
      voices[0] ??
      null
    );
  }, []);

  function handlePlay() {
    const synth = window.speechSynthesis;
    synth.cancel();

    const chunks = text.match(/[\s\S]{1,800}(?=\s|$)/g) ?? [text];
    totalCharsRef.current = text.length;
    let charOffset = 0;

    function speakChunk(idx: number) {
      if (idx >= chunks.length) {
        setState("idle");
        setProgress(100);
        setTimeout(() => setProgress(0), 1500);
        return;
      }

      const utter = new SpeechSynthesisUtterance(chunks[idx]);
      const voice = findVoice(language);
      if (voice) utter.voice = voice;
      utter.lang = LANG_MAP[language] ?? language;
      utter.rate = 0.95;
      utter.pitch = 1.05;

      const chunkStart = charOffset;
      utter.onboundary = (e) => {
        if (e.name === "word" && totalCharsRef.current > 0) {
          setProgress(Math.min(100, Math.round(((chunkStart + e.charIndex) / totalCharsRef.current) * 100)));
        }
      };
      utter.onend = () => {
        charOffset += chunks[idx].length;
        speakChunk(idx + 1);
      };
      utter.onerror = () => {
        setState("idle");
        setProgress(0);
      };

      utterRef.current = utter;
      synth.speak(utter);
    }

    setState("playing");
    setProgress(0);
    speakChunk(0);
    trackProgress();
  }

  function handlePause() {
    window.speechSynthesis.pause();
    setState("paused");
  }

  function handleResume() {
    window.speechSynthesis.resume();
    setState("playing");
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState("idle");
    setProgress(0);
  }

  if (!supported) return null;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-4">
      <div className="flex items-center gap-2">
        {state === "idle" && (
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 active:scale-95"
          >
            <span className="text-base">🔊</span>
            {t("listen")}
          </button>
        )}
        {state === "playing" && (
          <>
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 active:scale-95"
            >
              <span className="text-base">⏸</span>
              {t("pause")}
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 active:scale-95"
            >
              <span className="text-base">⏹</span>
              {t("stop")}
            </button>
          </>
        )}
        {state === "paused" && (
          <>
            <button
              type="button"
              onClick={handleResume}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 active:scale-95"
            >
              <span className="text-base">▶</span>
              {t("resume")}
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 active:scale-95"
            >
              <span className="text-base">⏹</span>
              {t("stop")}
            </button>
          </>
        )}
      </div>
      {state !== "idle" && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-violet-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
