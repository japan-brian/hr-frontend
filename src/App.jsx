import { useState, useEffect, useRef } from "react";

const BACKEND_URL = "https://hr-backend-jcsb.onrender.com";
const HR_PATH = "/hr-dashboard";

const SECTIONS = [
  { id: "professional", title: "Your Professional Story", icon: "💼" },
  { id: "strengths", title: "How You Work", icon: "⚡" },
  { id: "personal", title: "Who You Are", icon: "🌱" },
  { id: "culture", title: "Your Ideal Environment", icon: "🏡" },
];

const QUESTIONS = {
  professional: [
    { id: "name", label: "Full Name", type: "text", placeholder: "Your name" },
    { id: "academic", label: "Academic Background", type: "textarea", placeholder: "Degrees, fields of study, institutions..." },
    { id: "experience", label: "Work Experience", type: "textarea", placeholder: "Roles you've held, industries, years of experience..." },
    { id: "skills", label: "Technical & Professional Skills", type: "textarea", placeholder: "Tools, languages, methodologies, certifications..." },
    { id: "hobbies", label: "Hobbies & Talents", type: "textarea", placeholder: "What do you do outside of work? Any hidden talents?" },
    { id: "proud", label: "What achievement are you most proud of?", type: "textarea", placeholder: "Tell us about a moment that defined you professionally..." },
  ],
  strengths: [
    { id: "stress", label: "When things get overwhelming, what do you do?", type: "textarea", placeholder: "Walk us through how you handle pressure..." },
    { id: "conflict", label: "How do you respond when you disagree with a decision made above you?", type: "textarea", placeholder: "Be honest — there's no wrong answer here..." },
    { id: "motivation", label: "What kind of work makes you lose track of time?", type: "textarea", placeholder: "Describe the flow state for you..." },
    { id: "failure", label: "Tell us about a time you failed. What did you do next?", type: "textarea", placeholder: "We're interested in the what next more than the failure itself..." },
    { id: "decision", label: "How do you make a difficult decision with incomplete information?", type: "textarea", placeholder: "Walk us through your thinking process..." },
    { id: "feedback", label: "How do you respond to critical feedback?", type: "textarea", placeholder: "Give us a real example if you can..." },
  ],
  personal: [
    { id: "energy", label: "Where do you get your energy from?", type: "choice", options: ["Deep focus & solo work", "Collaboration & conversation", "A mix of both", "From the challenge itself"] },
    { id: "values", label: "What do you value most in a workplace?", type: "multichoice", options: ["Autonomy & ownership", "Clear structure & guidance", "Strong team culture", "Fast growth & challenge", "Purpose & impact", "Recognition & visibility"] },
    { id: "superpower", label: "If your closest friend described your greatest professional strength, what would they say?", type: "textarea", placeholder: "Think about what people always come to you for..." },
    { id: "learn", label: "How do you prefer to learn something new?", type: "choice", options: ["Jump in and figure it out", "Read, research, then apply", "Watch someone do it first", "Talk it through with others"] },
    { id: "role_in_group", label: "In a group with no designated leader, you tend to...", type: "choice", options: ["Naturally step up and organize", "Contribute ideas and let others lead", "Support whoever takes charge", "Focus on the task itself"] },
  ],
  culture: [
    { id: "environment", label: "What kind of environment brings out your best work?", type: "choice", options: ["High-autonomy, figure-it-out", "Structured with clear expectations", "Collaborative & team-driven", "Fast-paced, constantly shifting"] },
    { id: "manager", label: "What does your ideal manager look like?", type: "choice", options: ["A coach who develops me", "Someone who sets goals and steps back", "A peer who collaborates with me", "A visionary I can follow"] },
    { id: "pace", label: "How do you feel about ambiguity?", type: "choice", options: ["I thrive in it", "I can handle it with guardrails", "I prefer clarity before I move", "I work best with a defined problem"] },
    { id: "about", label: "Tell us anything else about yourself that matters.", type: "textarea", placeholder: "Anything we haven't asked that you'd want us to know..." },
  ],
};

const ROLES = [
  { id: "ops", title: "Operations Lead", emoji: "⚙️", desc: "Turns chaos into systems. Owns execution and keeps organizations running smoothly." },
  { id: "pm", title: "Product Manager", emoji: "🗺️", desc: "Bridges strategy and delivery. Translates vision into roadmaps and drives cross-functional teams." },
  { id: "creative", title: "Creative Strategist", emoji: "🎨", desc: "Finds the unexpected angle. Combines creative thinking with strategic clarity." },
  { id: "data", title: "Data Analyst", emoji: "📊", desc: "Finds signal in noise. Uses data to tell stories that drive decisions." },
  { id: "people", title: "People & Culture Lead", emoji: "🤝", desc: "Builds the environment where others thrive. Expert in human dynamics and organizational health." },
  { id: "engineer", title: "Software Engineer", emoji: "💻", desc: "Solves hard problems through code. Turns abstract requirements into working systems." },
  { id: "bd", title: "Business Development", emoji: "🚀", desc: "Opens doors and builds partnerships. Thrives at the intersection of relationships and opportunity." },
  { id: "coach", title: "Team Lead / Manager", emoji: "🧭", desc: "Unlocks the potential of others. Leads through trust, clarity, and genuine investment in people." },
  { id: "researcher", title: "Research & Insights", emoji: "🔬", desc: "Digs deep to understand the why. Turns curiosity into structured, actionable knowledge." },
  { id: "founder", title: "Entrepreneur / Intrapreneur", emoji: "💡", desc: "Builds from zero. Comfortable with risk, ambiguity, and wearing every hat." },
];

const STRENGTH_PROFILES = {
  "Executing": { color: "#E8FF5A", textColor: "#0a0a0a", desc: "You are the person who makes things happen. While others are still talking, you're already three steps into the plan.", traits: ["Follow-through machine", "Disciplined under pressure", "Detail-oriented", "Reliable"] },
  "Influencing": { color: "#FF6B35", textColor: "#fff", desc: "You are a force multiplier. You don't just have ideas — you make others believe in them.", traits: ["Persuasive communicator", "Natural presence", "Champion of ideas", "Energizes others"] },
  "Strategic Thinking": { color: "#7B61FF", textColor: "#fff", desc: "You live in the future. While others manage the present, you're already three moves ahead.", traits: ["Systems thinker", "Pattern recognition", "Comfortable with ambiguity", "Long-horizon vision"] },
  "Relationship Building": { color: "#00C9A7", textColor: "#0a0a0a", desc: "You are the connective tissue of any organization. People trust you, open up to you, and follow you.", traits: ["Deeply empathetic", "Creates psychological safety", "Builds trust quickly", "Long-term focus"] },
};

function QuestionField({ q, value, onChange }) {
  const base = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "14px 18px", color: "#fff", fontSize: "15px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical" };
  if (q.type === "choice") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {q.options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{ padding: "14px 16px", borderRadius: "12px", border: `1px solid ${value === opt ? "#7B61FF" : "rgba(255,255,255,0.12)"}`, background: value === opt ? "rgba(123,97,255,0.2)" : "rgba(255,255,255,0.04)", color: value === opt ? "#c4b5fd" : "#aaa", cursor: "pointer", fontSize: "14px", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}>{opt}</button>
      ))}
    </div>
  );
  if (q.type === "multichoice") {
    const selected = value ? value.split(",") : [];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {q.options.map(opt => {
          const active = selected.includes(opt);
          return <button key={opt} onClick={() => { const next = active ? selected.filter(s => s !== opt) : [...selected, opt]; onChange(next.join(",")); }} style={{ padding: "10px 16px", borderRadius: "999px", border: `1px solid ${active ? "#E8FF5A" : "rgba(255,255,255,0.12)"}`, background: active ? "rgba(232,255,90,0.15)" : "rgba(255,255,255,0.04)", color: active ? "#E8FF5A" : "#aaa", cursor: "pointer", fontSize: "14px", transition: "all 0.2s", fontFamily: "inherit" }}>{opt}</button>;
        })}
      </div>
    );
  }
  if (q.type === "textarea") return <textarea rows={3} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={q.placeholder} style={{ ...base, lineHeight: "1.6" }} />;
  return <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={q.placeholder} style={base} />;
}

function ThankYouScreen({ name }) {
  return (
    <div style={{ textAlign: "center", padding: "6rem 2rem", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ fontSize: "64px", marginBottom: "1.5rem" }}>🎉</div>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "1rem", background: "linear-gradient(135deg, #fff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Thank you, {name?.split(" ")[0] || "there"}!</h1>
      <p style={{ fontSize: "18px", color: "#888", lineHeight: 1.8, marginBottom: "2rem" }}>Your responses have been received. Our HR team will review your profile and be in touch with you shortly.</p>
      <div style={{ padding: "1.5rem 2rem", background: "rgba(123,97,255,0.1)", border: "1px solid rgba(123,97,255,0.3)", borderRadius: "16px" }}>
        <p style={{ color: "#a78bfa", margin: 0, fontSize: "15px" }}>✨ We loved getting to know you. Expect to hear from us soon.</p>
      </div>
    </div>
  );
}

function HRLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/hr/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(password);
      } else {
        setError("Wrong password. Try again.");
      }
    } catch {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "3rem 2.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🔐</div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "0.5rem" }}>HR Dashboard</h2>
        <p style={{ color: "#666", marginBottom: "2rem", fontSize: "14px" }}>Enter your HR password to view candidates</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Enter password" style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "#fff", fontSize: "15px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }} />
        {error && <p style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "1rem" }}>{error}</p>}
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7B61FF, #5a45cc)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
          {loading ? "Checking..." : "Enter Dashboard"}
        </button>
      </div>
    </div>
  );
}

function HRDashboard({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/hr/candidates`, { headers: { "x-hr-token": token } })
      .then(r => r.json())
      .then(data => { setCandidates(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>Loading candidates...</div>;

  if (selected) {
    const profile = STRENGTH_PROFILES[selected.primary_strength] || STRENGTH_PROFILES["Strategic Thinking"];
    const role = ROLES.find(r => r.id === selected.role_id) || ROLES[0];
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#aaa", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem" }}>← Back to all candidates</button>
        <div style={{ background: profile.color, borderRadius: "24px", padding: "2.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "3px", color: profile.textColor, opacity: 0.6, marginBottom: "0.5rem", textTransform: "uppercase" }}>Candidate Profile</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "900", color: profile.textColor }}>{selected.name}</div>
          <div style={{ fontSize: "1.3rem", fontWeight: "700", color: profile.textColor, opacity: 0.8 }}>{selected.primary_strength}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#666", textTransform: "uppercase", marginBottom: "0.5rem" }}>Best Fit Role</div>
            <div style={{ fontSize: "20px", marginBottom: "0.3rem" }}>{role.emoji} {role.title}</div>
            <div style={{ fontSize: "13px", color: "#888", lineHeight: 1.5 }}>{role.desc}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#666", textTransform: "uppercase", marginBottom: "0.5rem" }}>Also Strong In</div>
            <div style={{ fontSize: "20px", color: STRENGTH_PROFILES[selected.secondary_strength]?.color || "#fff" }}>{selected.secondary_strength}</div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#666", textTransform: "uppercase", marginTop: "1rem", marginBottom: "0.5rem" }}>Match Confidence</div>
            <div style={{ fontSize: "28px", fontWeight: "800" }}>{selected.confidence}%</div>
          </div>
        </div>
        <div style={{ background: "rgba(232,255,90,0.05)", border: "1px solid rgba(232,255,90,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#E8FF5A", textTransform: "uppercase", marginBottom: "0.8rem" }}>Hiring Manager Note</div>
          <div style={{ fontSize: "15px", color: "#ccc", lineHeight: 1.7 }}>{selected.hiring_note}</div>
        </div>
        <div style={{ background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#a78bfa", textTransform: "uppercase", marginBottom: "0.8rem" }}>Where They Thrive</div>
          <div style={{ fontSize: "15px", color: "#ccc", lineHeight: 1.7 }}>{selected.environment}</div>
        </div>
        <div style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#00C9A7", textTransform: "uppercase", marginBottom: "0.8rem" }}>Full AI Assessment</div>
          <div style={{ fontSize: "15px", color: "#ccc", lineHeight: 1.7 }}>{selected.full_assessment}</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#666", textTransform: "uppercase", marginBottom: "1rem" }}>All Responses</div>
          {selected.answers && Object.entries(selected.answers).map(([key, val]) => (
            <div key={key} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "12px", color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.3rem" }}>{key}</div>
              <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.6 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: "12px", color: "#555", marginTop: "1rem", textAlign: "right" }}>Submitted: {new Date(selected.created_at).toLocaleString()}</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "900", margin: "0 0 0.5rem" }}>HR Dashboard</h1>
        <p style={{ color: "#666", margin: 0 }}>{candidates.length} candidate{candidates.length !== 1 ? "s" : ""} submitted</p>
      </div>
      {candidates.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#555" }}>No candidates yet. Share the assessment link to get started!</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {candidates.map(c => {
            const profile = STRENGTH_PROFILES[c.primary_strength] || STRENGTH_PROFILES["Strategic Thinking"];
            const role = ROLES.find(r => r.id === c.role_id) || ROLES[0];
            return (
              <div key={c.id} onClick={() => setSelected(c)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem 2rem", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(123,97,255,0.4)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: profile.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "17px", fontWeight: "700" }}>{c.name}</div>
                    <div style={{ fontSize: "13px", color: "#666" }}>{c.primary_strength} · {role.title}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: profile.color }}>{c.confidence}%</div>
                    <div style={{ fontSize: "11px", color: "#555" }}>match</div>
                  </div>
                  <div style={{ color: "#555", fontSize: "20px" }}>→</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("intro");
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [hrToken, setHrToken] = useState(null);
  const topRef = useRef();

  useEffect(() => {
    if (window.location.pathname === HR_PATH) setPage("hr-login");
  }, []);

  const currentSection = SECTIONS[sectionIdx];
  const currentQuestions = QUESTIONS[currentSection?.id] || [];
  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });
  const handleAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]: val }));

  const sectionComplete = currentQuestions.every(q => {
    if (q.type === "textarea" || q.type === "text") return answers[q.id]?.trim().length > 0;
    return answers[q.id];
  });

  const submitForm = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers })
      });
      await res.json();
      setPage("thankyou");
    } catch {
      setPage("thankyou");
    }
    setLoading(false);
  };

  const containerStyle = { minHeight: "100vh", background: "#070711", color: "#fff", fontFamily: "'Sora', system-ui, sans-serif" };

  if (page === "hr-login") return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {hrToken ? <HRDashboard token={hrToken} /> : <HRLogin onLogin={token => { setHrToken(token); setPage("hr-dashboard"); }} />}
    </div>
  );

  if (page === "hr-dashboard") return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <HRDashboard token={hrToken} />
    </div>
  );

  if (page === "thankyou") return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <ThankYouScreen name={answers.name} />
    </div>
  );

  if (page === "intro") return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "6px 16px", background: "rgba(123,97,255,0.15)", border: "1px solid rgba(123,97,255,0.3)", borderRadius: "999px", fontSize: "13px", color: "#a78bfa", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "2rem" }}>We're Hiring</div>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "900", lineHeight: 1.1, margin: "0 0 1.5rem", background: "linear-gradient(135deg, #fff 0%, #a78bfa 60%, #00C9A7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>We'd Love to Get to Know You</h1>
        <p style={{ fontSize: "18px", color: "#888", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 1.5rem" }}>This isn't a typical application. We want to understand who you are, how you work, and where you'll thrive — not just your CV.</p>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 3rem" }}>Take your time, be honest, and know that there are no wrong answers. Our team reviews every submission personally.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "3rem", flexWrap: "wrap" }}>
          {[["~15 min", "to complete"], ["4 sections", "of questions"], ["reviewed by", "our team"]].map(([big, small]) => (
            <div key={big} style={{ textAlign: "center" }}><div style={{ fontSize: "22px", fontWeight: "800" }}>{big}</div><div style={{ fontSize: "13px", color: "#666" }}>{small}</div></div>
          ))}
        </div>
        <button onClick={() => setPage("form")} style={{ padding: "18px 48px", background: "linear-gradient(135deg, #7B61FF, #5a45cc)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "17px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
          Start My Application →
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ ...containerStyle, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #7B61FF", animation: "spin 1s linear infinite" }} />
      <div style={{ color: "#888", fontSize: "18px" }}>Analyzing your profile...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={containerStyle} ref={topRef}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
        <div style={{ width: "100%", height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", marginBottom: "2rem" }}>
          <div style={{ height: "100%", width: `${(sectionIdx / SECTIONS.length) * 100}%`, background: "linear-gradient(90deg, #7B61FF, #E8FF5A)", borderRadius: "2px", transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "2.5rem", flexWrap: "wrap" }}>
          {SECTIONS.map((s, i) => (
            <div key={s.id} style={{ padding: "6px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "600", background: i === sectionIdx ? "rgba(123,97,255,0.2)" : "transparent", border: `1px solid ${i === sectionIdx ? "rgba(123,97,255,0.5)" : "rgba(255,255,255,0.08)"}`, color: i === sectionIdx ? "#a78bfa" : "#444" }}>
              {s.icon} {s.title}
            </div>
          ))}
        </div>
        <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: "800", margin: "0 0 0.5rem" }}>{currentSection.title}</h2>
        <p style={{ color: "#666", fontSize: "15px", margin: "0 0 2.5rem" }}>Section {sectionIdx + 1} of {SECTIONS.length}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {currentQuestions.map(q => (
            <div key={q.id}>
              <label style={{ display: "block", fontSize: "15px", fontWeight: "600", color: "#e2e8f0", marginBottom: "10px", lineHeight: 1.5 }}>{q.label}</label>
              <QuestionField q={q} value={answers[q.id]} onChange={v => handleAnswer(q.id, v)} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {sectionIdx > 0 ? (
            <button onClick={() => { setSectionIdx(s => s - 1); scrollTop(); }} style={{ padding: "14px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", color: "#888", fontSize: "15px", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
          ) : <div />}
          <button onClick={() => { if (sectionIdx < SECTIONS.length - 1) { setSectionIdx(s => s + 1); scrollTop(); } else { submitForm(); } }} disabled={!sectionComplete}
            style={{ padding: "16px 40px", background: sectionComplete ? "linear-gradient(135deg, #7B61FF, #5a45cc)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "12px", color: sectionComplete ? "#fff" : "#444", fontSize: "16px", fontWeight: "700", cursor: sectionComplete ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
            {sectionIdx === SECTIONS.length - 1 ? "Submit →" : "Next Section →"}
          </button>
        </div>
      </div>
    </div>
  );
}