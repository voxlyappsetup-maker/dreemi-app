"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const LANG_CODES: Record<string, string[]> = {
  ar: ["ar-SA", "ar-EG", "ar-AE", "ar"],
  en: ["en-US", "en-GB", "en"],
  fr: ["fr-FR", "fr-CA", "fr"],
};

const FEMALE_HINTS = [
  "female", "woman", "girl", "femme", "fille",
  "samantha", "victoria", "karen", "moira", "tessa", "fiona",
  "alice", "amelie", "anna", "helena", "joana", "kathy",
  "laura", "luciana", "marie", "mei-jia", "milena", "monica",
  "nora", "paulina", "sara", "satu", "sin-ji", "ting-ting",
  "xander", "yelda", "zosia", "zuzana", "ellen", "kate",
  "susan", "linda", "hala", "maged",
];

const MALE_HINTS = [
  "male", "man", "boy", "homme", "garçon",
  "daniel", "david", "fred", "jorge", "juan", "luca",
  "thomas", "aaron", "alex", "bruce", "carlos", "diego",
  "james", "mark", "ralph", "rishi", "oliver", "george",
];

type VoiceGender = "male" | "female";
type PlayerState = "idle" | "playing" | "paused";

function classifyVoice(voice: SpeechSynthesisVoice): VoiceGender | null {
  const name = voice.name.toLowerCase();
  if (FEMALE_HINTS.some((h) => name.includes(h))) return "female";
  if (MALE_HINTS.some((h) => name.includes(h))) return "male";
  return null;
}

function storageKey(lang: string) {
  return `dreemi_voice_${lang}`;
}

interface StoryPlayerProps {
  text: string;
  language: string;
}

export function StoryPlayer({ text, language }: StoryPlayerProps) {
  const t = useTranslations("storyView");
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<PlayerState>("idle");
  const [progress, setProgress] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [maleVoices, setMaleVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [femaleVoices, setFemaleVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedGender, setSelectedGender] = useState<VoiceGender | null>(null);
  const [langNative, setLangNative] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalCharsRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);

    function loadVoices() {
      const all = window.speechSynthesis.getVoices();
      const codes = LANG_CODES[language] ?? [language];
      const prefix = language;
      const langVoices = all.filter(
        (v) => codes.includes(v.lang) || v.lang.startsWith(prefix + "-"),
      );
      const native = langVoices.length > 0;
      setLangNative(native);
      const usable = native ? langVoices : all;
      setVoices(usable);

      const males: SpeechSynthesisVoice[] = [];
      const females: SpeechSynthesisVoice[] = [];
      for (const v of usable) {
        const g = classifyVoice(v);
        if (g === "male") males.push(v);
        else if (g === "female") females.push(v);
      }
      setMaleVoices(males);
      setFemaleVoices(females);

      const saved = localStorage.getItem(storageKey(language)) as VoiceGender | null;
      if (saved === "male" && males.length > 0) setSelectedGender("male");
      else if (saved === "female" && females.length > 0) setSelectedGender("female");
      else if (females.length > 0) setSelectedGender("female");
      else if (males.length > 0) setSelectedGender("male");
      else setSelectedGender(null);
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [language]);

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (selectedGender === "male" && maleVoices.length > 0) return maleVoices[0];
    if (selectedGender === "female" && femaleVoices.length > 0) return femaleVoices[0];
    return voices[0] ?? null;
  }, [selectedGender, maleVoices, femaleVoices, voices]);

  function selectGender(g: VoiceGender) {
    setSelectedGender(g);
    try { localStorage.setItem(storageKey(language), g); } catch {}
    if (state !== "idle") handleStop();
  }

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
      const voice = pickVoice();
      if (voice) utter.voice = voice;
      utter.lang = (LANG_CODES[language] ?? [language])[0];
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

  const hasBoth = maleVoices.length > 0 && femaleVoices.length > 0;

  const genderBtnBase = "inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition active:scale-95";
  const genderActive = "bg-violet-600 text-white shadow-md";
  const genderInactive = "border border-violet-200 bg-white text-slate-600 hover:bg-violet-50";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-4">
      {!langNative && (
        <p className="text-xs text-amber-600">{t("voiceNotOptimized")}</p>
      )}
      {hasBoth && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => selectGender("female")}
            className={`${genderBtnBase} ${selectedGender === "female" ? genderActive : genderInactive}`}
          >
            <span className="text-base">👩</span>
            {t("voiceFemale")}
          </button>
          <button
            type="button"
            onClick={() => selectGender("male")}
            className={`${genderBtnBase} ${selectedGender === "male" ? genderActive : genderInactive}`}
          >
            <span className="text-base">👨</span>
            {t("voiceMale")}
          </button>
        </div>
      )}

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
