import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Minus, X, Plus, Trash2, Volume2, VolumeX, Square, Settings, Send, ArrowUpRight } from "lucide-react";
import avatar from "@/assets/maya-avatar.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Tool, ToolHeader, ToolContent, ToolInput } from "@/components/ai-elements/tool";
import { destinations, initialMessages, whatsappMessage } from "@/lib/maya/config";
import { streamSpeech } from "@/lib/maya/stream-speech";

type Thread = { id: string; title: string; messages: UIMessage[] };
type Draft = { name: string; contact: string; message: string };

function Enquiry({ draft }: { draft: Draft }) {
  const [values, setValues] = useState(draft);
  const [editing, setEditing] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState("");
  if (cancelled) return <p className="text-sm text-muted-foreground">Enquiry cancelled. Nothing was sent.</p>;
  return <div className="space-y-3 rounded-md border p-3">
    <h3 className="text-sm">Your message to Sagar</h3>
    {editing ? <><Input aria-label="Your name" value={values.name} onChange={e => setValues(v => ({ ...v, name: e.target.value }))} maxLength={100} /><Input aria-label="Reply contact" value={values.contact} onChange={e => setValues(v => ({ ...v, contact: e.target.value }))} maxLength={200} /><Textarea aria-label="Enquiry message" value={values.message} onChange={e => setValues(v => ({ ...v, message: e.target.value }))} maxLength={3000} /><Button size="sm" onClick={() => setEditing(false)}>Review message</Button></> : <><dl className="space-y-2 text-sm"><div><dt className="text-muted-foreground">Name</dt><dd>{values.name}</dd></div><div><dt className="text-muted-foreground">Contact</dt><dd className="break-words">{values.contact}</dd></div><div><dt className="text-muted-foreground">Message</dt><dd className="whitespace-pre-wrap break-words">{values.message}</dd></div></dl><p className="text-xs text-muted-foreground">In-app email is not available yet. WhatsApp opens your draft for you to send.</p><div className="flex flex-wrap gap-2"><Button size="sm" onClick={async () => { const response = await fetch("/api/public/maya/contact", { method: "POST" }); const body = await response.json(); setError(body.message); }}>Send Message</Button><Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit Message</Button><Button size="sm" variant="ghost" onClick={() => setCancelled(true)}>Cancel</Button><Button size="sm" asChild><a href={whatsappMessage(values.name, values.contact, values.message)} target="_blank" rel="noopener noreferrer">Send via WhatsApp <ArrowUpRight /></a></Button></div></>}
    {error && <p role="alert" className="text-xs text-primary">{error}</p>}
  </div>;
}

function ChatWindow({ thread, update, sound, close }: { thread: Thread; update: (messages: UIMessage[]) => void; sound: boolean; close: () => void }) {
  const input = useRef<HTMLTextAreaElement>(null);
  const speech = useRef<AbortController | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState<Draft>({ name: "", contact: "", message: "" });
  const [settings, setSettings] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [speed, setSpeed] = useState(1);
  const soundRef = useRef(sound);
  const settingsRef = useRef({ volume, speed });
  useEffect(() => { soundRef.current = sound; if (!sound) { speech.current?.abort(); setSpeaking(false); } }, [sound]);
  useEffect(() => { settingsRef.current = { volume, speed }; }, [volume, speed]);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/public/maya/chat", body: { conversationId: thread.id } }), [thread.id]);
  const play = async (text: string) => {
    speech.current?.abort();
    const controller = new AbortController(); speech.current = controller;
    setSpeaking(true); setVoiceError("");
    try { await streamSpeech("/api/public/maya/speech", text.replace(/[*#`]/g, ""), controller.signal, settingsRef.current); }
    catch { if (!controller.signal.aborted) setVoiceError("Maya's voice is unavailable. You can continue chatting."); }
    finally { if (speech.current === controller) { setSpeaking(false); speech.current = null; } }
  };
  const { messages, sendMessage, status, error, stop, setMessages, clearError } = useChat({ id: thread.id, messages: thread.messages, transport,
    onFinish: ({ message, isAbort, isError }) => {
      input.current?.focus();
      const text = message.parts.filter(p => p.type === "text").map(p => p.text).join("\n");
      if (soundRef.current && text && !isAbort && !isError) void play(text);
    },
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => { update(messages); }, [messages, update]);
  useEffect(() => { input.current?.focus(); return () => { speech.current?.abort(); }; }, []);
  const submit = (text: string) => {
    if (!text.trim() || busy) return;
    speech.current?.abort(); clearError(); void sendMessage({ text: text.trim() }); input.current?.focus();
  };
  return <>
    <div className="flex items-center justify-between border-b px-4 py-2">
      <p className="text-xs text-muted-foreground">Temporary conversation</p>
      <div className="flex gap-1"><Button variant="ghost" size="icon-sm" aria-label="Voice settings" title="Voice settings" onClick={() => setSettings(v => !v)}><Settings /></Button><Button variant="ghost" size="icon-sm" aria-label="Clear conversation" title="Clear conversation" onClick={() => { stop(); speech.current?.abort(); setMessages(initialMessages()); }}><Trash2 /></Button></div>
    </div>
    {settings && <div className="grid grid-cols-2 gap-3 border-b px-4 py-3 text-xs"><label>Volume<input aria-label="Voice volume" className="w-full accent-primary" type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(Number(e.target.value))} /></label><label>Speaking speed<input aria-label="Speaking speed" className="w-full accent-primary" type="range" min="0.8" max="1.2" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} /></label></div>}
    <Conversation className="min-h-0 flex-1"><ConversationContent className="gap-5 p-4">
      {messages.map(message => <Message key={message.id} from={message.role} className="max-w-full"><MessageContent className="maya-message">
        {message.parts.map((part, i) => {
          if (part.type === "text") return <MessageResponse key={i}>{part.text}</MessageResponse>;
          if (part.type === "reasoning") return <details key={i} className="text-xs text-muted-foreground"><summary>Thinking</summary><MessageResponse>{part.text}</MessageResponse></details>;
          if (!isToolUIPart(part)) return null;
          const output = part.state === "output-available" ? part.output as Record<string, unknown> : null;
          const name = part.type === "dynamic-tool" ? part.toolName : part.type.slice(5);
          return <div key={i}><Tool defaultOpen={false}><ToolHeader title={name === "offerNavigation" ? "Website destination" : "Enquiry preview"} type={part.type} state={part.state} {...(part.type === "dynamic-tool" ? { toolName: part.toolName } : {})} /><ToolContent><ToolInput input={part.input} />{part.state === "output-error" && <p role="alert">{part.errorText}</p>}</ToolContent></Tool>
            {output && name === "offerNavigation" && typeof output.page === "string" && output.page in destinations && <Button variant="secondary" size="sm" asChild><Link to={destinations[output.page as keyof typeof destinations]} onClick={() => { speech.current?.abort(); close(); }}>Open {output.page}<ArrowUpRight /></Link></Button>}
            {output && name === "prepareEnquiry" && typeof output.name === "string" && typeof output.contact === "string" && typeof output.message === "string" && <Enquiry draft={{ name: output.name, contact: output.contact, message: output.message }} />}
          </div>;
        })}
      </MessageContent>{message.role === "assistant" && message.id !== "maya-greeting" && message.parts.some(p => p.type === "text") && !busy && <Button variant="ghost" size="icon-sm" aria-label="Play Maya reply" title="Play Maya reply" onClick={() => void play(message.parts.filter(p => p.type === "text").map(p => p.text).join("\n"))}><Volume2 /></Button>}</Message>)}
      {status === "submitted" && <Shimmer className="text-sm">Maya is thinking...</Shimmer>}
      {messages.length === 1 && <div className="flex flex-wrap gap-2">{[{ label: "Explore Portfolio", text: "Show me the portfolio" }, { label: "About Sagar", text: "Tell me about Sagar" }, { label: "Creative Work", text: "What creative work does Sagar do?" }].map(a => <Button key={a.label} variant="secondary" size="sm" onClick={() => submit(a.text)}>{a.label}</Button>)}<Button variant="secondary" size="sm" onClick={() => { setDrafting(true); submit("I want to discuss a project with Sagar"); }}>Discuss a Project</Button><Button variant="secondary" size="sm" onClick={() => setDrafting(true)}>Contact Sagar</Button></div>}
      {drafting && <div className="space-y-2 rounded-md border p-3"><h3 className="text-sm">Contact Sagar</h3><Input aria-label="Your name" placeholder="Your name" value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} maxLength={100} /><Input aria-label="Reply contact" placeholder="Email or phone for a reply" value={draft.contact} onChange={e => setDraft(d => ({ ...d, contact: e.target.value }))} maxLength={200} /><Textarea aria-label="Enquiry message" placeholder="What would you like to discuss?" value={draft.message} onChange={e => setDraft(d => ({ ...d, message: e.target.value }))} maxLength={3000} />{draft.name.trim() && draft.contact.trim() && draft.message.trim() && <Enquiry key={JSON.stringify(draft)} draft={draft} />}<Button variant="ghost" size="sm" onClick={() => setDrafting(false)}>Cancel</Button></div>}
    </ConversationContent><ConversationScrollButton /></Conversation>
    <div className="shrink-0 border-t p-3">
      {error && <p role="alert" className="mb-2 break-words text-xs text-primary">{error.message}</p>}
      {voiceError && <p role="status" className="mb-2 text-xs text-muted-foreground">{voiceError}</p>}
      {speaking && <div className="mb-2 flex items-center justify-between text-xs"><span>Maya is speaking</span><Button size="icon-sm" variant="ghost" aria-label="Stop speaking" title="Stop speaking" onClick={() => { speech.current?.abort(); setSpeaking(false); }}><Square /></Button></div>}
      <PromptInput onSubmit={({ text }) => submit(text)}><PromptInputTextarea ref={input} aria-label="Message Maya" placeholder="Ask Maya anything about Sagar..." maxLength={6000} /><PromptInputFooter className="justify-end"><PromptInputSubmit status={status} disabled={!busy && status === "error"} onStop={() => { stop(); input.current?.focus(); }}><Send /></PromptInputSubmit></PromptInputFooter></PromptInput>
    </div>
  </>;
}

export default function MayaChat() {
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState("");
  const newThread = () => { const id = crypto.randomUUID(); setThreads(t => [...t, { id, title: `Chat ${t.length + 1}`, messages: initialMessages() }]); setActive(id); };
  const launch = () => { if (!threads.length) newThread(); setOpen(true); };
  const update = useMemo(() => (messages: UIMessage[]) => setThreads(t => t.map(item => item.id === active ? { ...item, messages } : item)), [active]);
  const current = threads.find(t => t.id === active);
  useEffect(() => { if (!open) return; const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; window.addEventListener("keydown", escape); return () => window.removeEventListener("keydown", escape); }, [open]);
  return <div className="maya-theme">
    {!open && <Button className="maya-launcher" aria-label="Chat with Maya" title="Chat with Maya" onClick={launch}><img src={avatar} width={48} height={48} alt="Maya" loading="lazy" /><MessageCircle className="maya-launcher-icon" /></Button>}
    {open && current && <section role="dialog" aria-label="Maya AI assistant" className="maya-panel">
      <header className="flex shrink-0 items-center gap-3 border-b p-4"><img src={avatar} alt="Maya" width={40} height={40} className="h-10 w-10 rounded-full object-cover" /><div className="min-w-0 flex-1"><h2 className="text-base">Maya</h2><p className="text-xs text-muted-foreground">Here to help ✨ · AI assistant</p></div><Button variant="ghost" size="icon-sm" aria-label={sound ? "Mute Maya" : "Enable Maya voice"} title={sound ? "Mute Maya" : "Enable Maya voice"} onClick={() => setSound(v => !v)}>{sound ? <Volume2 /> : <VolumeX />}</Button><Button variant="ghost" size="icon-sm" aria-label="Minimize Maya" title="Minimize Maya" onClick={() => setOpen(false)}><Minus /></Button><Button variant="ghost" size="icon-sm" aria-label="Close Maya" title="Close Maya" onClick={() => { setOpen(false); setThreads([]); setActive(""); }}><X /></Button></header>
      <nav aria-label="Temporary conversations" className="flex shrink-0 items-center gap-1 overflow-x-auto border-b px-3 py-2">{threads.map(t => <Button size="sm" variant={active === t.id ? "default" : "ghost"} key={t.id} onClick={() => setActive(t.id)}>{t.title}</Button>)}<Button size="icon-sm" variant="ghost" aria-label="New conversation" title="New conversation" onClick={newThread}><Plus /></Button></nav>
      <ChatWindow key={current.id} thread={current} update={update} sound={sound} close={() => setOpen(false)} />
    </section>}
  </div>;
}