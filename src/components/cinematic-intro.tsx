import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { FINAL_GREETING, greetingAt, INTRO_SESSION_KEY } from "../lib/intro-sequence";
import opening from "../assets/intro-opening.mp3.asset.json";
import welcome from "../assets/intro-welcome.mp3.asset.json";
import home from "../assets/intro-home.mp3.asset.json";
import about from "../assets/intro-about.mp3.asset.json";
import work from "../assets/intro-work.mp3.asset.json";
import projects from "../assets/intro-projects.mp3.asset.json";
import connect from "../assets/intro-connect.mp3.asset.json";
import finish from "../assets/intro-finish.mp3.asset.json";

const TOUR = [
  { route: "/", key: "home", label: "Home", audio: home.url },
  { route: "/about", key: "about", label: "About", audio: about.url },
  { route: "/work", key: "work", label: "Work", audio: work.url },
  { route: "/projects", key: "projects", label: "Projects", audio: projects.url },
  { route: "/connect", key: "connect", label: "Connect", audio: connect.url },
  { route: "/", key: "home", label: "Make yourself at home", audio: finish.url },
] as const;
type Phase = "boot" | "opening" | "blocked" | "title" | "tour" | "done";

export function CinematicIntro({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [phase, setPhase] = useState<Phase>("boot");
  const [muted, setMuted] = useState(false);
  const [text, setText] = useState("");
  const [step, setStep] = useState(0);
  const [titleBeat, setTitleBeat] = useState(0);
  const audio = useRef<HTMLAudioElement | null>(null);
  const muteRef = useRef(false);
  const sound = useRef<AudioContext | null>(null);

  const stop = () => {
    audio.current?.pause();
    if (audio.current) audio.current.src = "";
    audio.current = null;
  };
  const complete = () => {
    stop();
    void sound.current?.close().catch(() => {});
    sound.current = null;
    try { sessionStorage.setItem(INTRO_SESSION_KEY, "1"); } catch { /* storage is optional */ }
    setPhase("done");
  };
  const toggleSound = () => {
    muteRef.current = !muteRef.current;
    setMuted(muteRef.current);
    if (audio.current) audio.current.muted = muteRef.current;
    if (sound.current) void (muteRef.current ? sound.current.suspend() : sound.current.resume()).catch(() => {});
  };

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(INTRO_SESSION_KEY) === "1"; } catch { /* continue without storage */ }
    setPhase(path === "/" && !seen ? "opening" : "done");
    return () => { stop(); void sound.current?.close().catch(() => {}); };
  }, []);

  useEffect(() => {
    if (phase === "done" || phase === "tour") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [phase]);

  useEffect(() => {
    if (phase === "done") return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") complete();
      if (event.key === "Tab" && phase !== "tour") {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".cinema-overlay button"));
        if (!buttons.length) return;
        const first = buttons[0]; const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !buttons.includes(document.activeElement as HTMLButtonElement))) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [phase]);

  useEffect(() => {
    if (phase !== "opening" && phase !== "title" && phase !== "tour") return;
    let disposed = false;
    let silent = false;
    let started = performance.now();
    const player = phase === "opening" && audio.current && !audio.current.paused ? audio.current : new Audio(phase === "opening" ? opening.url : phase === "title" ? welcome.url : TOUR[step]?.audio);
    player.muted = muteRef.current;
    audio.current = player;
    setText(""); setTitleBeat(0);
    const advance = () => {
      if (disposed) return;
      if (phase === "opening") setPhase("title");
      else if (phase === "title") { setStep(0); setPhase("tour"); }
      else if (step < TOUR.length - 1) setStep(step + 1);
      else complete();
    };
    const fail = () => { silent = true; started = performance.now(); };
    player.onended = advance;
    player.onerror = fail;
    player.onplaying = () => { started = performance.now(); };
    void player.play().catch((error: unknown) => {
      if (disposed) return;
      if (phase === "opening" && error instanceof DOMException && error.name === "NotAllowedError") setPhase("blocked");
      else fail();
    });
    const timer = window.setInterval(() => {
      const elapsed = silent ? (performance.now() - started) / 1000 : player.currentTime;
      const duration = Number.isFinite(player.duration) ? player.duration : phase === "opening" ? 28 : phase === "title" ? 5 : 8;
      if (phase === "opening") setText(greetingAt(elapsed, duration));
      if (phase === "title") setTitleBeat(elapsed < 0.8 ? 0 : elapsed < 2 ? 1 : 2);
      // A stalled external asset never traps visitors; silently finish this scene.
      if (!silent && player.currentTime === 0 && performance.now() - started > 6000) fail();
      if (silent && elapsed >= duration) advance();
    }, 50);
    if (phase === "tour") {
      const target = TOUR[step];
      if (target) void navigate({ to: target.route }).then(() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
    }
    return () => { disposed = true; clearInterval(timer); player.pause(); player.src = ""; player.onended = null; player.onerror = null; if (audio.current === player) audio.current = null; };
  }, [phase, step]);

  useEffect(() => {
    if (phase !== "tour") return;
    const target = document.querySelector(`[data-tour="${TOUR[step]?.key}"]`);
    target?.classList.add("cinema-tour-highlight");
    const heading = document.querySelector("main h1");
    heading?.classList.add("cinema-tour-highlight");
    return () => { target?.classList.remove("cinema-tour-highlight"); heading?.classList.remove("cinema-tour-highlight"); };
  }, [phase, step, path]);

  const enter = () => {
    // Resume audio inside the visitor gesture, before restarting the visual clock.
    const probe = new Audio(opening.url);
    probe.muted = muteRef.current;
    audio.current = probe;
    void probe.play().then(() => {
      audio.current = probe;
      setPhase("opening");
    }).catch(() => { muteRef.current = true; setMuted(true); setPhase("opening"); });
    try {
      const context = new AudioContext(); sound.current = context;
      const oscillator = context.createOscillator(); const gain = context.createGain();
      oscillator.frequency.value = 48; gain.gain.value = 0.012;
      oscillator.connect(gain).connect(context.destination); oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 35);
      oscillator.stop(context.currentTime + 35);
      if (muteRef.current) void context.suspend();
    } catch { /* ambience is optional */ }
  };
  const full = phase !== "done" && phase !== "tour" && (path === "/" || phase !== "boot");
  return <>
    <noscript><style>{`.cinema-overlay { display: none; }`}</style></noscript>
    <div inert={(full && phase !== "boot") || undefined}>{children}</div>
    {full && <div className="cinema-overlay" role="dialog" aria-modal="true" aria-label="Sagar's World cinematic introduction">
      <div className={`cinema-controls ${phase === "boot" ? "invisible" : ""}`}>
        <Button variant="ghost" onClick={toggleSound} aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Unmute" : "Mute"}><span>{muted ? <VolumeX /> : <Volume2 />}</span></Button>
        <Button variant="ghost" onClick={complete}>SKIP INTRO</Button>
      </div>
      {phase === "blocked" && <Button variant="ghost" className="cinema-enter" onClick={enter}>ENTER WITH SOUND</Button>}
      {phase === "opening" && text && <div key={text} className={`cinema-greeting ${text === FINAL_GREETING ? "cinema-final" : ""}`} dir={text === "السلام عليكم" ? "rtl" : "auto"}>{text}</div>}
      {phase === "title" && <div className="cinema-title"><p>WELCOME TO</p>{titleBeat >= 1 && <h1>SAGAR'S WORLD</h1>}{titleBeat >= 2 && <p className="cinema-subtitle">A CREATIVE MIND. AN ENTIRE UNIVERSE.</p>}</div>}
    </div>}
    {phase === "tour" && <aside className="cinema-tour" aria-label="Website tour"><span>{TOUR[step]?.label}</span><Button variant="ghost" onClick={toggleSound} aria-label={muted ? "Unmute" : "Mute"}>{muted ? <VolumeX /> : <Volume2 />}</Button><Button variant="ghost" onClick={complete}>SKIP TOUR</Button></aside>}
    {phase === "done" && <Button variant="ghost" size="icon" className="cinema-replay" aria-label="Replay intro" title="Replay intro" onClick={() => { stop(); void navigate({ to: "/" }).then(() => { window.scrollTo({ top: 0 }); setPhase("blocked"); }); }}><RotateCcw className="h-4 w-4" /></Button>}
  </>;
}