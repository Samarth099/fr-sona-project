import { useState } from "react";

const PLATFORMS = [
  {
    id: "twitter",
    name: "X / Twitter",
    icon: "𝕏",
    desc: "Punchy, real-time takes",
    defaults: { formality: 15, brevity: 85, warmth: 40, boldness: 80 },
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "in",
    desc: "Professional narrative",
    defaults: { formality: 80, brevity: 35, warmth: 60, boldness: 55 },
  },
  {
    id: "email",
    name: "Email",
    icon: "✉",
    desc: "Structured, purposeful",
    defaults: { formality: 70, brevity: 45, warmth: 55, boldness: 40 },
  },
  {
    id: "discord",
    name: "Discord",
    icon: "◈",
    desc: "Community, casual",
    defaults: { formality: 10, brevity: 70, warmth: 80, boldness: 50 },
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "◎",
    desc: "Visual, aspirational",
    defaults: { formality: 25, brevity: 60, warmth: 85, boldness: 65 },
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: "◉",
    desc: "Informative, direct",
    defaults: { formality: 30, brevity: 50, warmth: 35, boldness: 60 },
  },
];

const AXES = [
  { id: "formality", label: "Formality", low: "Casual", high: "Formal" },
  { id: "brevity", label: "Brevity", low: "Verbose", high: "Terse" },
  { id: "warmth", label: "Warmth", low: "Authoritative", high: "Warm" },
  { id: "boldness", label: "Boldness", low: "Reserved", high: "Bold" },
];

const TONES = ["Direct", "Empathetic", "Witty", "Educational", "Inspiring", "Provocative", "Collaborative"];
const TOPICS = ["Tech", "Business", "Design", "Culture", "Finance", "Health", "Politics", "Science", "Arts"];

function Slider({ value, onChange, low, high, label }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#666", fontFamily: "monospace", letterSpacing: "0.05em" }}>{low}</span>
        <span style={{ fontSize: "0.75rem", color: "#c8ff00", fontFamily: "monospace" }}>{label} — {value}</span>
        <span style={{ fontSize: "0.7rem", color: "#666", fontFamily: "monospace", letterSpacing: "0.05em" }}>{high}</span>
      </div>
      <div style={{ position: "relative", height: "4px", background: "#1e1e1e", borderRadius: "2px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${value}%`, background: "linear-gradient(90deg, #3a3a3a, #c8ff00)", borderRadius: "2px", transition: "width 0.1s" }} />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            width: "100%",
            opacity: 0,
            cursor: "pointer",
            height: "20px",
            margin: 0,
          }}
        />
        <div style={{
          position: "absolute",
          top: "50%",
          left: `${value}%`,
          transform: "translate(-50%, -50%)",
          width: "12px",
          height: "12px",
          background: "#c8ff00",
          borderRadius: "50%",
          boxShadow: "0 0 8px #c8ff0088",
          transition: "left 0.1s",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

function Tag({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        padding: "0.35rem 0.75rem",
        borderRadius: "2px",
        border: selected ? "1px solid #c8ff00" : "1px solid #2a2a2a",
        background: selected ? "#c8ff0015" : "transparent",
        color: selected ? "#c8ff00" : "#555",
        fontSize: "0.75rem",
        fontFamily: "monospace",
        cursor: "pointer",
        transition: "all 0.15s",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </button>
  );
}

const STEPS = ["Identity", "Voice", "Platforms", "Export"];

export default function PersonaBuilder() {
  const [step, setStep] = useState(0);
  const [identity, setIdentity] = useState({ name: "", role: "", bio: "", avoid: "" });
  const [voice, setVoice] = useState({ tones: [], topics: [], nogo: "" });
  const [platforms, setPlatforms] = useState(() => {
    const init = {};
    PLATFORMS.forEach((p) => { init[p.id] = { enabled: false, ...p.defaults }; });
    return init;
  });
  const [activePlatform, setActivePlatform] = useState("twitter");
  const [copied, setCopied] = useState(false);

  const toggleTone = (t) => setVoice((v) => ({ ...v, tones: v.tones.includes(t) ? v.tones.filter((x) => x !== t) : [...v.tones, t] }));
  const toggleTopic = (t) => setVoice((v) => ({ ...v, topics: v.topics.includes(t) ? v.topics.filter((x) => x !== t) : [...v.topics, t] }));
  const togglePlatform = (id) => setPlatforms((p) => ({ ...p, [id]: { ...p[id], enabled: !p[id].enabled } }));
  const setAxis = (pid, axis, val) => setPlatforms((p) => ({ ...p, [pid]: { ...p[pid], [axis]: val } }));
  const resetPlatform = (pid) => {
    const def = PLATFORMS.find((p) => p.id === pid).defaults;
    setPlatforms((p) => ({ ...p, [pid]: { ...p[pid], ...def } }));
  };

  const generateMd = () => {
    const enabledPlatforms = PLATFORMS.filter((p) => platforms[p.id].enabled);
    const axisDesc = (val, low, high) => val < 30 ? low : val > 70 ? high : `balanced ${low.toLowerCase()}/${high.toLowerCase()}`;

    let md = `# personality.md — Fr-sona
> Your real persona, portable. Use this as a system prompt prefix for any LLM agent.
> Built with Fr-sona · ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

---

## Identity

**Name:** ${identity.name || "Not specified"}
**Role:** ${identity.role || "Not specified"}
**Bio:** ${identity.bio || "Not specified"}
${identity.avoid ? `**Never represent me as:** ${identity.avoid}` : ""}

---

## Core Voice

**Tonal qualities:** ${voice.tones.length ? voice.tones.join(", ") : "Not specified"}
**Subject matter expertise:** ${voice.topics.length ? voice.topics.join(", ") : "Not specified"}
${voice.nogo ? `**Hard no-go zones:** ${voice.nogo}` : ""}

---

## Platform Personas
${enabledPlatforms.length === 0 ? "\nNo platforms configured." : ""}
`;

    enabledPlatforms.forEach((p) => {
      const cfg = platforms[p.id];
      md += `
### ${p.name}

- **Formality:** ${axisDesc(cfg.formality, "Casual", "Formal")} (${cfg.formality}/100)
- **Brevity:** ${axisDesc(cfg.brevity, "Verbose", "Terse")} (${cfg.brevity}/100)
- **Warmth:** ${axisDesc(cfg.warmth, "Authoritative", "Warm")} (${cfg.warmth}/100)
- **Boldness:** ${axisDesc(cfg.boldness, "Reserved", "Bold")} (${cfg.boldness}/100)

**Behavioral instruction:** When drafting ${p.name} content, write in a ${axisDesc(cfg.formality, "casual", "formal")}, ${axisDesc(cfg.brevity, "expansive", "concise")} style. Lead with ${cfg.boldness > 60 ? "a strong opinion or hook" : "context and nuance"}. ${cfg.warmth > 60 ? "Prioritize connection and relatability." : "Prioritize clarity and credibility."}
`;
    });

    md += `
---

## Agent Instructions

You are acting as a communication proxy for ${identity.name || "the user"}. Your job is to draft messages, replies, comments, and content that authentically represent their voice.

**Always:**
- Match the platform-specific persona defined above
- Preserve their subject matter perspective on: ${voice.topics.length ? voice.topics.join(", ") : "their areas of expertise"}
- Default to their core tonal qualities when no platform context is given

**Never:**
- Invent opinions they haven't expressed
- Use language that contradicts their formality/warmth calibration
- Cross their stated no-go zones${voice.nogo ? `: ${voice.nogo}` : ""}
- Sound generic — every output should be unmistakably theirs

---
*Generated with Fr-sona · personality.md v1.0 · fr, this is you.*
`;
    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMd());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generateMd()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "personality.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const inp = {
    width: "100%",
    background: "#0d0d0d",
    border: "1px solid #222",
    color: "#e0e0e0",
    padding: "0.65rem 0.8rem",
    fontFamily: "monospace",
    fontSize: "0.82rem",
    borderRadius: "2px",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  };

  const label = { display: "block", fontSize: "0.7rem", color: "#555", fontFamily: "monospace", letterSpacing: "0.08em", marginBottom: "0.4rem", textTransform: "uppercase" };

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#e0e0e0", fontFamily: "'Georgia', serif" }}>
      {/* Grain overlay */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem", position: "relative", zIndex: 1 }}>
        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", paddingBottom: "1rem", borderBottom: "1px solid #111" }}>
          <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: "#2a2a2a", letterSpacing: "0.2em" }}>FR-SONA · YOUR REAL PERSONA</span>
          <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: "#2a2a2a", letterSpacing: "0.1em" }}>portable · agent-ready · fr</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-0.04em", fontFamily: "monospace" }}>
              <span style={{ color: "#c8ff00" }}>Fr</span><span style={{ color: "#e0e0e0" }}>-sona</span>
            </h1>
            <span style={{ fontSize: "0.6rem", fontFamily: "monospace", color: "#333", letterSpacing: "0.15em", paddingBottom: "0.5rem" }}>v1.0</span>
          </div>
          <p style={{ fontSize: "0.68rem", fontFamily: "monospace", color: "#444", letterSpacing: "0.15em", margin: "0 0 1rem 0", textTransform: "uppercase" }}>
            For Real · Your Persona · Every Platform
          </p>
          <p style={{ color: "#555", fontSize: "0.88rem", marginTop: "0", fontFamily: "monospace", lineHeight: 1.7, maxWidth: "480px" }}>
            You don't have time to code-switch for every platform.<br />
            Fr-sona builds a <span style={{ color: "#c8ff00" }}>personality.md</span> your agents use so you sound like <em>you</em> — fr.
          </p>
        </div>

        {/* Step nav */}
        <div style={{ display: "flex", gap: "0", marginBottom: "2.5rem", borderBottom: "1px solid #1a1a1a" }}>
          {STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(i)}
              style={{
                padding: "0.6rem 1.2rem",
                background: "none",
                border: "none",
                borderBottom: step === i ? "2px solid #c8ff00" : "2px solid transparent",
                color: step === i ? "#c8ff00" : i < step ? "#555" : "#333",
                fontFamily: "monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                textTransform: "uppercase",
                marginBottom: "-1px",
              }}
            >
              {String(i + 1).padStart(2, "0")} {s}
            </button>
          ))}
        </div>

        {/* Step 1: Identity */}
        {step === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#333", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                This is the real you. Not your elevator pitch. Not your LinkedIn summary. Just — who you actually are.
              </div>
            </div>
            <div>
              <label style={label}>Name / Handle</label>
              <input style={inp} value={identity.name} onChange={(e) => setIdentity({ ...identity, name: e.target.value })} placeholder="e.g. Alex Rivera · @alexbuilds" />
            </div>
            <div>
              <label style={label}>What you actually do</label>
              <input style={inp} value={identity.role} onChange={(e) => setIdentity({ ...identity, role: e.target.value })} placeholder="e.g. Indie founder. Design systems nerd. Chronic overthinker." />
            </div>
            <div>
              <label style={label}>Your bio — in your own words, fr</label>
              <textarea style={{ ...inp, minHeight: "90px" }} value={identity.bio} onChange={(e) => setIdentity({ ...identity, bio: e.target.value })} placeholder="Say it like you'd say it to a friend, not a recruiter..." />
            </div>
            <div>
              <label style={label}>Never represent me as...</label>
              <input style={inp} value={identity.avoid} onChange={(e) => setIdentity({ ...identity, avoid: e.target.value })} placeholder="e.g. corporate, salesy, a hype beast, politically aligned" />
            </div>
          </div>
        )}

        {/* Step 2: Voice */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#333", lineHeight: 1.6 }}>
              How do you actually come across when you're being yourself? Pick what fits, skip what doesn't.
            </div>
            <div>
              <label style={label}>Tonal qualities (pick all that fit)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                {TONES.map((t) => <Tag key={t} label={t} selected={voice.tones.includes(t)} onClick={() => toggleTone(t)} />)}
              </div>
            </div>
            <div>
              <label style={label}>Subject matter (your domains)</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                {TOPICS.map((t) => <Tag key={t} label={t} selected={voice.topics.includes(t)} onClick={() => toggleTopic(t)} />)}
              </div>
            </div>
            <div>
              <label style={label}>Hard no-go zones (topics / language / positions)</label>
              <textarea style={{ ...inp, minHeight: "80px" }} value={voice.nogo} onChange={(e) => setVoice({ ...voice, nogo: e.target.value })} placeholder="e.g. Crypto hype, partisan politics, health claims, dunking on competitors..." />
            </div>
          </div>
        )}

        {/* Step 3: Platforms */}
        {step === 2 && (
          <div>
            {/* Platform toggles */}
            <label style={{ ...label, marginBottom: "1rem" }}>Where do you show up? Enable your platforms.</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "2rem" }}>
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { togglePlatform(p.id); setActivePlatform(p.id); }}
                  style={{
                    padding: "0.75rem",
                    background: platforms[p.id].enabled ? "#c8ff0010" : "#0d0d0d",
                    border: platforms[p.id].enabled ? "1px solid #c8ff00" : "1px solid #1e1e1e",
                    borderRadius: "2px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: "1rem", marginBottom: "0.2rem", color: platforms[p.id].enabled ? "#c8ff00" : "#333" }}>{p.icon}</div>
                  <div style={{ fontSize: "0.72rem", fontFamily: "monospace", color: platforms[p.id].enabled ? "#e0e0e0" : "#444" }}>{p.name}</div>
                  <div style={{ fontSize: "0.62rem", fontFamily: "monospace", color: "#333", marginTop: "0.15rem" }}>{p.desc}</div>
                </button>
              ))}
            </div>

            {/* Active platform sliders */}
            {platforms[activePlatform]?.enabled && (
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "2px", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#555", letterSpacing: "0.1em" }}>CALIBRATING</div>
                    <div style={{ fontSize: "1rem", color: "#c8ff00", fontFamily: "monospace" }}>{PLATFORMS.find((p) => p.id === activePlatform)?.name}</div>
                  </div>
                  <button type="button" onClick={() => resetPlatform(activePlatform)} style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "#444", background: "none", border: "1px solid #222", padding: "0.3rem 0.6rem", cursor: "pointer", borderRadius: "2px" }}>
                    ↺ Reset defaults
                  </button>
                </div>
                {AXES.map((ax) => (
                  <Slider
                    key={ax.id}
                    label={ax.label}
                    low={ax.low}
                    high={ax.high}
                    value={platforms[activePlatform][ax.id]}
                    onChange={(v) => setAxis(activePlatform, ax.id, v)}
                  />
                ))}
              </div>
            )}

            {!platforms[activePlatform]?.enabled && (
              <div style={{ color: "#333", fontFamily: "monospace", fontSize: "0.8rem", padding: "1rem", border: "1px dashed #1a1a1a", borderRadius: "2px", textAlign: "center" }}>
                Enable a platform above to calibrate its settings
              </div>
            )}

            {/* Platform switcher if multiple enabled */}
            {PLATFORMS.filter((p) => platforms[p.id].enabled).length > 1 && (
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                {PLATFORMS.filter((p) => platforms[p.id].enabled).map((p) => (
                  <button key={p.id} type="button" onClick={() => setActivePlatform(p.id)} style={{ padding: "0.3rem 0.7rem", fontFamily: "monospace", fontSize: "0.68rem", background: "none", border: activePlatform === p.id ? "1px solid #c8ff00" : "1px solid #222", color: activePlatform === p.id ? "#c8ff00" : "#555", cursor: "pointer", borderRadius: "2px", letterSpacing: "0.05em" }}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Export */}
        {step === 3 && (
          <div>
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "2px", padding: "1.25rem", marginBottom: "1.5rem", maxHeight: "420px", overflowY: "auto" }}>
              <pre style={{ margin: 0, fontSize: "0.72rem", fontFamily: "monospace", color: "#888", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {generateMd()}
              </pre>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={handleDownload}
                style={{ flex: 1, padding: "0.85rem", background: "#c8ff00", color: "#080808", border: "none", fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", borderRadius: "2px", textTransform: "uppercase" }}
              >
                ↓ Download my fr-sona
              </button>
              <button
                type="button"
                onClick={handleCopy}
                style={{ padding: "0.85rem 1.25rem", background: "none", border: "1px solid #2a2a2a", color: copied ? "#c8ff00" : "#555", fontFamily: "monospace", fontSize: "0.8rem", cursor: "pointer", borderRadius: "2px" }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <p style={{ fontSize: "0.68rem", fontFamily: "monospace", color: "#333", marginTop: "1rem", lineHeight: 1.7 }}>
              Drop this into any agent as a system prompt prefix. Works with Claude, GPT, Gemini, local models, n8n, Make, Zapier — anything that takes a system prompt. That's your <span style={{ color: "#c8ff00" }}>fr-sona</span>, fr.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid #111" }}>
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            style={{ padding: "0.65rem 1.25rem", background: "none", border: "1px solid #1e1e1e", color: "#444", fontFamily: "monospace", fontSize: "0.75rem", cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.3 : 1, borderRadius: "2px" }}
            disabled={step === 0}
          >
            ← Back
          </button>
          {step < 3 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              style={{ padding: "0.65rem 1.5rem", background: "#c8ff00", border: "none", color: "#080808", fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", borderRadius: "2px", letterSpacing: "0.08em" }}
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
