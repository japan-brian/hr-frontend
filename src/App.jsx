import { useState, useEffect, useRef } from "react";

const BACKEND_URL = "https://hr-backend-jcsb.onrender.com";

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

const STRENGTH_COLORS = {
  "Executing": { bg: "#E8FF5A", text: "#0a0a0a", glow: "rgba(232,255,90,0.3)" },
  "Influencing": { bg: "#FF6B35", text: "#fff", glow: "rgba(255,107,53,0.3)" },
  "Strategic Thinking": { bg: "#7B61FF", text: "#fff", glow: "rgba(123,97,255,0.3)" },
  "Relationship Building": { bg: "#00C9A7", text: "#0a0a0a", glow: "rgba(0,201,167,0.3)" },
};

const QUESTIONS = [
  { id: "name", label: "Let's start with your name.", sublabel: "What should we call you?", type: "text", placeholder: "Your full name", section: "About You" },
  { id: "email", label: "What's your email address?", sublabel: "We'll use this to get back to you.", type: "email", placeholder: "you@example.com", section: "About You" },
  { id: "role_applying", label: "What role are you applying for?", sublabel: "Select the position that brought you here.", type: "choice", options: ["Software Engineer", "Product Manager", "Data Analyst", "Business Development", "Operations", "Creative / Design", "People & Culture", "Research & Insights", "Leadership / Management", "Other"], section: "About You" },
  { id: "academic", label: "Tell us about your academic background.", sublabel: "Degrees, fields of study, institutions — whatever shaped your thinking.", type: "textarea", placeholder: "e.g. BSc Computer Science, University of Nairobi. I also completed a data science bootcamp in 2022...", section: "Your Story" },
  { id: "experience", label: "Walk us through your work experience.", sublabel: "Roles, industries, and what you actually did.", type: "textarea", placeholder: "e.g. 3 years as a software developer at a fintech startup, then moved into product...", section: "Your Story" },
  { id: "skills", label: "What are your strongest skills?", sublabel: "Technical tools, soft skills, methodologies — anything you're genuinely good at.", type: "textarea", placeholder: "e.g. Python, stakeholder management, systems thinking, public speaking...", section: "Your Story" },
  { id: "proud", label: "What achievement are you most proud of?", sublabel: "Professional or personal — tell us about a moment that defined you.", type: "textarea", placeholder: "e.g. I led a team that reduced customer churn by 40% in 6 months. What made it special was...", section: "Your Story" },
  { id: "hobbies", label: "What do you do when you're not working?", sublabel: "Hobbies, passions, side projects — what lights you up outside of work?", type: "textarea", placeholder: "e.g. I coach youth football on weekends, I'm learning Arabic, and I build mechanical keyboards...", section: "Your Story" },
  { id: "stress", label: "When things get overwhelming, what do you do?", sublabel: "There's no right answer — we want to understand how you actually operate.", type: "choice", options: ["Make a list and tackle things one by one", "Step back and look at the big picture first", "Talk it through with someone I trust", "Push through independently until it's done", "Take a short break then come back with fresh eyes"], section: "How You Work" },
  { id: "conflict", label: "How do you respond when you disagree with a decision made above you?", sublabel: "Be honest — what do you actually do?", type: "choice", options: ["I voice my concern clearly and explain my reasoning", "I ask questions to understand the reasoning first", "I go along with it but note my disagreement", "I find a way to influence the outcome indirectly", "It depends — I read the situation"], section: "How You Work" },
  { id: "motivation", label: "What kind of work makes you completely lose track of time?", sublabel: "Think about the last time you were truly in flow.", type: "textarea", placeholder: "e.g. I lose track of time when I'm deep in a complex data problem, especially when I can see a pattern forming...", section: "How You Work" },
  { id: "failure", label: "Tell us about a time you failed. What did you do next?", sublabel: "We're more interested in the 'what next' than the failure itself.", type: "textarea", placeholder: "e.g. I missed a major product deadline because I underestimated dependencies. I called the stakeholders immediately, owned it...", section: "How You Work" },
  { id: "decision", label: "How do you make a difficult decision with incomplete information?", sublabel: "Walk us through your actual thinking process.", type: "choice", options: ["I gather as much data as I can before deciding", "I trust my gut and move fast", "I consult the people most affected", "I identify the worst-case scenario and work backwards", "I make a reversible decision and adjust as I go"], section: "How You Work" },
  { id: "feedback", label: "How do you respond to critical feedback?", sublabel: "Give us a real example if you can.", type: "textarea", placeholder: "e.g. My manager once told me I was too direct in client meetings. Initially I was defensive, but then I...", section: "How You Work" },
  { id: "energy", label: "Where do you get your energy from?", sublabel: "What fills your tank versus drains it?", type: "choice", options: ["Deep focus and solo work", "Collaboration and conversation", "A mix of both depending on the day", "From the challenge and problem itself"], section: "Who You Are" },
  { id: "superpower", label: "If your closest friend described your greatest professional strength, what would they say?", sublabel: "Think about what people always come to you for.", type: "textarea", placeholder: "e.g. They'd say I'm the person who always finds a way. No matter how stuck the situation is, I figure it out...", section: "Who You Are" },
  { id: "values", label: "What do you value most in a workplace?", sublabel: "Pick everything that genuinely matters to you.", type: "multichoice", options: ["Autonomy & ownership", "Clear structure & guidance", "Strong team culture", "Fast growth & challenge", "Purpose & impact", "Recognition & visibility"], section: "Who You Are" },
  { id: "environment", label: "What kind of environment brings out your best work?", sublabel: "Be honest about what you actually need to thrive.", type: "choice", options: ["High-autonomy, figure-it-out culture", "Structured with clear expectations", "Collaborative and team-driven", "Fast-paced and constantly shifting"], section: "Your Ideal Fit" },
  { id: "manager", label: "What does your ideal manager look like?", sublabel: "The kind of leadership that actually helps you grow.", type: "choice", options: ["A coach who develops me", "Someone who sets goals and steps back", "A peer who collaborates with me", "A visionary I can learn from and follow"], section: "Your Ideal Fit" },
  { id: "about", label: "Is there anything else about you that matters?", sublabel: "Anything we haven't asked that you'd want us to know — don't hold back.", type: "textarea", placeholder: "e.g. I'm fluent in 3 languages, I've lived in 4 countries, and I work best when given a big problem and space to solve it...", section: "Your Ideal Fit" },
];

const SECTIONS = ["About You", "Your Story", "How You Work", "Who You Are", "Your Ideal Fit"];

function NavBar({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 2rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(7,7,17,0.9)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none", transition: "all 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "20px" }}>🍯</span>
        <span style={{ fontWeight: "800", fontSize: "16px", background: "linear-gradient(135deg, #E8FF5A, #00C9A7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HoneypotAdvisory</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <a href="#features" style={{ color: "#888", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#888"}>Features</a>
        <a href="#how" style={{ color: "#888", fontSize: "14px", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#888"}>How It Works</a>
        <button onClick={onStart} style={{ padding: "8px 20px", background: "linear-gradient(135deg, #7B61FF, #5a45cc)", border: "none", borderRadius: "8px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 20px rgba(123,97,255,0.4)"; }} onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}>Apply Now</button>
      </div>
    </nav>
  );
}

function LandingPage({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "#070711" }}>
      <NavBar onStart={onStart} />
      {/* Hero */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8rem 2rem 4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(123,97,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "20%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", background: "rgba(123,97,255,0.15)", border: "1px solid rgba(123,97,255,0.3)", borderRadius: "999px", fontSize: "13px", color: "#a78bfa", letterSpacing: "1px", marginBottom: "2rem" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C9A7", display: "inline-block", animation: "pulse 2s infinite" }} />
          AI-Powered Talent Intelligence
        </div>
        <h1 style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", fontWeight: "900", lineHeight: 1.05, margin: "0 0 1.5rem", maxWidth: "800px", background: "linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #00C9A7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          We Don't Just Want Your CV. We Want to Know You.
        </h1>
        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#888", lineHeight: 1.7, maxWidth: "580px", margin: "0 auto 1rem" }}>
          This isn't a typical application. We use AI to understand who you are, how you think, and where you'll genuinely thrive — not just what's on paper.
        </p>
        <p style={{ fontSize: "15px", color: "#555", marginBottom: "3rem" }}>Takes about 10 minutes. No wrong answers.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" }}>
          <button onClick={onStart} style={{ padding: "18px 48px", background: "linear-gradient(135deg, #7B61FF, #5a45cc)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "17px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", boxShadow: "0 4px 30px rgba(123,97,255,0.3)" }} onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 40px rgba(123,97,255,0.5)"; }} onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 30px rgba(123,97,255,0.3)"; }}>
            Start My Application →
          </button>
        </div>
        <div style={{ display: "flex", gap: "3rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[["20", "thoughtful questions"], ["~10 min", "to complete"], ["AI-powered", "analysis"]].map(([big, small]) => (
            <div key={big} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>{big}</div>
              <div style={{ fontSize: "13px", color: "#555" }}>{small}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ padding: "6rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontSize: "13px", letterSpacing: "3px", color: "#7B61FF", textTransform: "uppercase", marginBottom: "1rem" }}>Why HoneypotAdvisory</div>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", margin: 0 }}>Hiring intelligence that goes deeper.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            { icon: "🧠", title: "Clifton Strength Profiling", desc: "Identifies your specific Clifton theme — not just a category, but the precise talent that defines how you operate." },
            { icon: "📊", title: "Rubric-Based Scoring", desc: "Evaluates depth, consistency, self-awareness, and clarity across all answers. Every score means something." },
            { icon: "⚡", title: "Behavioral Intelligence", desc: "Detects ownership mindset, team orientation, and behavioral patterns that CVs never reveal." },
            { icon: "🎯", title: "Role Match Engine", desc: "Matches candidates to the exact role and environment where they'll do their best work." },
            { icon: "🛡️", title: "Bias-Controlled Analysis", desc: "AI focuses purely on content and patterns — ignoring grammar, writing style, and cultural differences." },
            { icon: "🔐", title: "Private HR Dashboard", desc: "Full candidate profiles, analytics, and insights visible only to your HR team." },
          ].map(f => (
            <div key={f.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "2rem", transition: "all 0.2s", cursor: "default" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(123,97,255,0.08)"; e.currentTarget.style.borderColor = "rgba(123,97,255,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: "32px", marginBottom: "1rem" }}>{f.icon}</div>
              <div style={{ fontSize: "17px", fontWeight: "700", marginBottom: "0.5rem" }}>{f.title}</div>
              <div style={{ fontSize: "14px", color: "#666", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div id="how" style={{ padding: "6rem 2rem", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "13px", letterSpacing: "3px", color: "#00C9A7", textTransform: "uppercase", marginBottom: "1rem" }}>The Process</div>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", margin: "0 0 4rem" }}>Simple, fast, insightful.</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[
            { num: "01", title: "Answer Thoughtfully", desc: "20 carefully crafted questions about who you are, how you work, and what you value. No trick questions." },
            { num: "02", title: "AI Analyzes Your Profile", desc: "Our AI evaluates your answers across 4 dimensions and maps your specific Clifton strength theme." },
            { num: "03", title: "HR Reviews Your Intelligence Report", desc: "Your hiring manager receives a detailed profile — strengths, behavioral signals, role fit, and a hiring recommendation." },
          ].map(s => (
            <div key={s.num} style={{ display: "flex", gap: "2rem", alignItems: "flex-start", textAlign: "left", padding: "2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px" }}>
              <div style={{ fontSize: "3rem", fontWeight: "900", color: "rgba(123,97,255,0.3)", flexShrink: 0, lineHeight: 1 }}>{s.num}</div>
              <div>
                <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "0.5rem" }}>{s.title}</div>
                <div style={{ fontSize: "15px", color: "#666", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onStart} style={{ marginTop: "3rem", padding: "18px 48px", background: "linear-gradient(135deg, #7B61FF, #5a45cc)", border: "none", borderRadius: "14px", color: "#fff", fontSize: "17px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
          Begin My Application →
        </button>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "3rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.8rem" }}>
              <span style={{ fontSize: "20px" }}>🍯</span>
              <span style={{ fontWeight: "800", background: "linear-gradient(135deg, #E8FF5A, #00C9A7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HoneypotAdvisory</span>
            </div>
            <p style={{ color: "#555", fontSize: "14px", maxWidth: "260px", lineHeight: 1.6, margin: 0 }}>AI-powered talent intelligence for companies that take hiring seriously.</p>
          </div>
          <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#444", textTransform: "uppercase", marginBottom: "1rem" }}>Product</div>
              {["Features", "How It Works", "Apply Now"].map(l => <div key={l} style={{ color: "#666", fontSize: "14px", marginBottom: "0.5rem", cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#666"}>{l}</div>)}
            </div>
            <div>
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#444", textTransform: "uppercase", marginBottom: "1rem" }}>Company</div>
              {["About", "Contact", "Privacy"].map(l => <div key={l} style={{ color: "#666", fontSize: "14px", marginBottom: "0.5rem", cursor: "pointer" }} onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#666"}>{l}</div>)}
            </div>
            <div>
              <div style={{ fontSize: "12px", letterSpacing: "2px", color: "#444", textTransform: "uppercase", marginBottom: "1rem" }}>Contact</div>
              <div style={{ color: "#666", fontSize: "14px" }}>info@honeypotadvisory.com</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "0.8rem" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C9A7" }} />
                <span style={{ color: "#00C9A7", fontSize: "13px" }}>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ color: "#444", fontSize: "13px" }}>© 2026 HoneypotAdvisory. All rights reserved.</span>
          <span style={{ color: "#444", fontSize: "13px" }}>Built with AI. Designed for humans.</span>
        </div>
      </footer>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

function QuestionScreen({ question, value, onChange, onNext, onBack, current, total, sectionName }) {
  const isValid = () => {
    if (question.type === "text" || question.type === "email" || question.type === "textarea") return value && value.trim().length > 2;
    if (question.type === "multichoice") return value && value.split(",").filter(Boolean).length > 0;
    return !!value;
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Enter" && question.type !== "textarea" && isValid()) onNext(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [value]);

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "14px", padding: "16px 20px", color: "#fff", fontSize: "17px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" };

  return (
    <div style={{ minHeight: "100vh", background: "#070711", display: "flex", flexDirection: "column" }}>
      {/* Progress */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <div style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}>
          <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: "linear-gradient(90deg, #7B61FF, #00C9A7)", transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: "1.5rem 2rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>🍯</span>
          <span style={{ fontWeight: "800", fontSize: "14px", background: "linear-gradient(135deg, #E8FF5A, #00C9A7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HoneypotAdvisory</span>
        </div>
        <div style={{ fontSize: "13px", color: "#555" }}>
          <span style={{ color: "#a78bfa", fontWeight: "700" }}>{current}</span> / {total}
        </div>
      </div>

      {/* Question */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "640px" }}>
          <div style={{ fontSize: "12px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: "1.5rem" }}>{sectionName}</div>
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: "800", lineHeight: 1.2, margin: "0 0 0.6rem", color: "#fff" }}>{question.label}</h2>
          {question.sublabel && <p style={{ fontSize: "15px", color: "#666", margin: "0 0 2rem", lineHeight: 1.5 }}>{question.sublabel}</p>}

          {(question.type === "text" || question.type === "email") && (
            <input type={question.type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={question.placeholder} style={inputStyle}
              onFocus={e => { e.target.style.borderColor = "rgba(123,97,255,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(123,97,255,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }} autoFocus />
          )}

          {question.type === "textarea" && (
            <textarea rows={4} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={question.placeholder} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => { e.target.style.borderColor = "rgba(123,97,255,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(123,97,255,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.boxShadow = "none"; }} autoFocus />
          )}

          {question.type === "choice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {question.options.map((opt, i) => (
                <button key={opt} onClick={() => { onChange(opt); setTimeout(onNext, 300); }}
                  style={{ padding: "16px 20px", borderRadius: "14px", border: `1px solid ${value === opt ? "rgba(123,97,255,0.6)" : "rgba(255,255,255,0.08)"}`, background: value === opt ? "rgba(123,97,255,0.15)" : "rgba(255,255,255,0.03)", color: value === opt ? "#c4b5fd" : "#aaa", cursor: "pointer", fontSize: "15px", textAlign: "left", transition: "all 0.15s", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "12px" }}
                  onMouseEnter={e => { if (value !== opt) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                  onMouseLeave={e => { if (value !== opt) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "#aaa"; } }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "50%", border: `1px solid ${value === opt ? "#7B61FF" : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: value === opt ? "#7B61FF" : "#555", flexShrink: 0 }}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.type === "multichoice" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {question.options.map(opt => {
                const selected = value ? value.split(",").includes(opt) : false;
                return (
                  <button key={opt} onClick={() => { const arr = value ? value.split(",").filter(Boolean) : []; const next = selected ? arr.filter(s => s !== opt) : [...arr, opt]; onChange(next.join(",")); }}
                    style={{ padding: "12px 18px", borderRadius: "999px", border: `1px solid ${selected ? "#E8FF5A" : "rgba(255,255,255,0.1)"}`, background: selected ? "rgba(232,255,90,0.12)" : "rgba(255,255,255,0.03)", color: selected ? "#E8FF5A" : "#888", cursor: "pointer", fontSize: "14px", transition: "all 0.15s", fontFamily: "inherit" }}>
                    {selected ? "✓ " : ""}{opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Next button */}
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {current > 1 ? (
              <button onClick={onBack} style={{ padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#666", fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
            ) : <div />}
            {(question.type === "textarea" || question.type === "text" || question.type === "email" || question.type === "multichoice") && (
              <button onClick={onNext} disabled={!isValid()}
                style={{ padding: "14px 32px", background: isValid() ? "linear-gradient(135deg, #7B61FF, #5a45cc)" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "12px", color: isValid() ? "#fff" : "#444", fontSize: "15px", fontWeight: "700", cursor: isValid() ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.2s" }}>
                {current === total ? "Submit Application →" : "Next →"}
              </button>
            )}
          </div>
          {question.type !== "textarea" && question.type !== "multichoice" && (
            <p style={{ color: "#444", fontSize: "13px", marginTop: "1rem" }}>Press Enter ↵ to continue</p>
          )}
        </div>
      </div>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
}

function LoadingScreen() {
  const messages = [
    "Reading between the lines...",
    "Mapping your Clifton theme...",
    "Evaluating depth and consistency...",
    "Detecting behavioral signals...",
    "Building your intelligence report...",
    "Almost there — this one's worth waiting for..."
  ];
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const msgTimer = setInterval(() => setMsgIdx(i => (i + 1) % messages.length), 2500);
    const progTimer = setInterval(() => setProgress(p => Math.min(p + 1, 90)), 300);
    return () => { clearInterval(msgTimer); clearInterval(progTimer); };
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#070711", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem", padding: "2rem" }}>
      <div style={{ fontSize: "48px", animation: "spin 3s linear infinite" }}>🍯</div>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0 0 0.5rem", background: "linear-gradient(135deg, #fff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Analyzing your profile</h2>
        <p style={{ color: "#666", fontSize: "16px", margin: 0, minHeight: "24px", transition: "opacity 0.3s" }}>{messages[msgIdx]}</p>
      </div>
      <div style={{ width: "300px", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7B61FF, #00C9A7)", borderRadius: "2px", transition: "width 0.3s ease" }} />
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ThankYouScreen({ name }) {
  return (
    <div style={{ minHeight: "100vh", background: "#070711", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center", maxWidth: "560px" }}>
        <div style={{ fontSize: "72px", marginBottom: "1.5rem" }}>🎉</div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", margin: "0 0 1rem", background: "linear-gradient(135deg, #fff, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Thank you, {name?.split(" ")[0] || "there"}!
        </h1>
        <p style={{ fontSize: "18px", color: "#888", lineHeight: 1.8, marginBottom: "2rem" }}>Your application has been received. Our team will review your profile and reach out to you via email shortly.</p>
        <div style={{ padding: "1.5rem 2rem", background: "rgba(123,97,255,0.08)", border: "1px solid rgba(123,97,255,0.2)", borderRadius: "16px" }}>
          <p style={{ color: "#a78bfa", margin: 0, fontSize: "15px", lineHeight: 1.6 }}>✨ We loved getting to know you. Every answer you gave helps us find the right fit — for you and for us.</p>
        </div>
        <p style={{ color: "#444", fontSize: "13px", marginTop: "2rem" }}>© 2026 HoneypotAdvisory · info@honeypotadvisory.com</p>
      </div>
    </div>
  );
}

function HRLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/hr/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.success) onLogin(password);
      else setError("Wrong password. Try again.");
    } catch { setError("Could not connect to server."); }
    setLoading(false);
  };
  return (
    <div style={{ minHeight: "100vh", background: "#070711", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "3rem 2.5rem", textAlign: "center", backdropFilter: "blur(20px)" }}>
        <div style={{ fontSize: "48px", marginBottom: "1rem" }}>🔐</div>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800", margin: "0 0 0.5rem" }}>HR Dashboard</h2>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "2rem" }}>HoneypotAdvisory · Talent Intelligence</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Enter HR password" style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "15px", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }} />
        {error && <p style={{ color: "#ff6b6b", fontSize: "14px", marginBottom: "1rem" }}>{error}</p>}
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7B61FF, #5a45cc)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
          {loading ? "Verifying..." : "Enter Dashboard →"}
        </button>
      </div>
    </div>
  );
}

function HRDashboard({ token }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("overview");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStrength, setFilterStrength] = useState("All");
  const [filterRec, setFilterRec] = useState("All");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchCandidates = () => {
    fetch(`${BACKEND_URL}/hr/candidates`, { headers: { "x-hr-token": token } })
      .then(r => r.json()).then(data => { setCandidates(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCandidates(); }, []);

  const toggleShortlist = async (id, current) => {
    await fetch(`${BACKEND_URL}/hr/candidates/${id}/shortlist`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-hr-token": token }, body: JSON.stringify({ shortlisted: !current }) });
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, shortlisted: !current } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, shortlisted: !current }));
    showToast(!current ? "⭐ Added to shortlist" : "Removed from shortlist");
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm("Delete this candidate? This cannot be undone.")) return;
    await fetch(`${BACKEND_URL}/hr/candidates/${id}`, { method: "DELETE", headers: { "x-hr-token": token } });
    setCandidates(prev => prev.filter(c => c.id !== id));
    setSelected(null); setPage("candidates");
    showToast("🗑️ Candidate deleted");
  };

  const filtered = candidates.filter(c => {
    const matchSearch = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase());
    const matchStrength = filterStrength === "All" || c.primary_strength === filterStrength;
    const matchRec = filterRec === "All" || c.hire_recommendation === filterRec;
    return matchSearch && matchStrength && matchRec;
  });

  const sidebarItems = [
    { id: "overview", icon: "🏠", label: "Overview" },
    { id: "candidates", icon: "👥", label: "All Candidates" },
    { id: "shortlisted", icon: "⭐", label: "Shortlisted" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const strengthCounts = candidates.reduce((acc, c) => { acc[c.primary_strength] = (acc[c.primary_strength] || 0) + 1; return acc; }, {});
  const roleCounts = candidates.reduce((acc, c) => { const r = ROLES.find(r => r.id === c.role_id); if (r) acc[r.title] = (acc[r.title] || 0) + 1; return acc; }, {});
  const topRole = Object.entries(roleCounts).sort((a, b) => b[1] - a[1])[0];
  const avgConfidence = candidates.length ? Math.round(candidates.reduce((a, c) => a + (c.confidence || 0), 0) / candidates.length) : 0;
  const strongYes = candidates.filter(c => c.hire_recommendation === "Strong Yes").length;

  const containerStyle = { minHeight: "100vh", background: "#070711", color: "#fff", fontFamily: "'Sora', system-ui, sans-serif", display: "flex" };
  const sidebarStyle = { width: "240px", flexShrink: 0, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "2rem 1rem", display: "flex", flexDirection: "column", gap: "4px", backdropFilter: "blur(20px)" };

  if (selected) {
    const colors = STRENGTH_COLORS[selected.primary_strength] || STRENGTH_COLORS["Strategic Thinking"];
    const role = ROLES.find(r => r.id === selected.role_id) || ROLES[0];
    const recColor = { "Strong Yes": "#00C9A7", "Yes": "#E8FF5A", "Maybe": "#FF6B35" }[selected.hire_recommendation] || "#888";
    return (
      <div style={containerStyle}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <div style={sidebarStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem", padding: "0 0.5rem" }}>
            <span>🍯</span>
            <span style={{ fontWeight: "800", fontSize: "14px", background: "linear-gradient(135deg, #E8FF5A, #00C9A7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HoneypotAdvisory</span>
          </div>
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setSelected(null); }}
              style={{ padding: "10px 14px", borderRadius: "10px", border: "none", background: "transparent", color: "#666", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "10px", textAlign: "left", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#666"; }}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
          <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#888", padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", marginBottom: "2rem", fontSize: "14px" }}>← Back</button>

          {/* Clifton Dramatic Reveal */}
          <div style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}cc)`, borderRadius: "24px", padding: "3rem", marginBottom: "1.5rem", position: "relative", overflow: "hidden", boxShadow: `0 20px 60px ${colors.glow}` }}>
            <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", background: "rgba(255,255,255,0.08)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: "-20px", left: "40%", width: "120px", height: "120px", background: "rgba(255,255,255,0.05)", borderRadius: "50%" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "4px", color: colors.text, opacity: 0.6, textTransform: "uppercase", marginBottom: "0.5rem" }}>Clifton StrengthsFinder</div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: colors.text, opacity: 0.7, marginBottom: "0.3rem" }}>YOUR CLIFTON STRENGTH IS</div>
              <div style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "900", color: colors.text, lineHeight: 1, marginBottom: "0.3rem" }}>{selected.clifton_theme || selected.primary_strength}</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: colors.text, opacity: 0.7, marginBottom: "1rem" }}>{selected.primary_strength} Domain</div>
              <div style={{ fontSize: "15px", color: colors.text, opacity: 0.85, lineHeight: 1.6, maxWidth: "600px" }}>{selected.full_assessment}</div>
            </div>
          </div>

          {/* Hire Recommendation */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: `${recColor}18`, border: `1px solid ${recColor}44`, borderRadius: "999px", marginBottom: "1.5rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: recColor }} />
            <span style={{ color: recColor, fontWeight: "700", fontSize: "15px" }}>Hire Recommendation: {selected.hire_recommendation}</span>
          </div>

          {/* Rubric Bars */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "2rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: "1.5rem" }}>Assessment Breakdown</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {[
                { label: "Depth", value: selected.rubric_depth, color: "#7B61FF" },
                { label: "Consistency", value: selected.rubric_consistency, color: "#00C9A7" },
                { label: "Self-Awareness", value: selected.rubric_self_awareness, color: "#E8FF5A" },
                { label: "Clarity", value: selected.rubric_clarity, color: "#FF6B35" },
              ].map(r => (
                <div key={r.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", color: "#888" }}>{r.label}</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: r.color }}>{r.value || 0}/25</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px" }}>
                    <div style={{ height: "100%", width: `${((r.value || 0) / 25) * 100}%`, background: r.color, borderRadius: "3px", transition: "width 0.8s ease" }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#666", fontSize: "14px" }}>Overall Match Score</span>
              <span style={{ fontSize: "2rem", fontWeight: "900", color: "#fff" }}>{selected.confidence}%</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            {/* Green Flags */}
            <div style={{ background: "rgba(0,201,167,0.05)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: "16px", padding: "1.5rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#00C9A7", textTransform: "uppercase", marginBottom: "1rem" }}>✨ Green Flags</div>
              {(Array.isArray(selected.green_flags) ? selected.green_flags : []).map((f, i) => (
                <div key={i} style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.5, marginBottom: "0.5rem", paddingLeft: "0.5rem", borderLeft: "2px solid #00C9A7" }}>{f}</div>
              ))}
            </div>
            {/* Growth Edge */}
            <div style={{ background: "rgba(232,255,90,0.04)", border: "1px solid rgba(232,255,90,0.15)", borderRadius: "16px", padding: "1.5rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#E8FF5A", textTransform: "uppercase", marginBottom: "1rem" }}>🌱 Growth Edge</div>
              <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.6 }}>{selected.growth_edge}</div>
              <div style={{ marginTop: "1.5rem" }}>
                <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "0.5rem" }}>Behavioral Signals</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ padding: "4px 12px", borderRadius: "999px", background: "rgba(123,97,255,0.15)", border: "1px solid rgba(123,97,255,0.3)", fontSize: "12px", color: "#a78bfa" }}>{selected.locus_of_control} Locus</span>
                  <span style={{ padding: "4px 12px", borderRadius: "999px", background: "rgba(0,201,167,0.1)", border: "1px solid rgba(0,201,167,0.3)", fontSize: "12px", color: "#00C9A7" }}>{selected.team_orientation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role + Environment */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#666", textTransform: "uppercase", marginBottom: "0.8rem" }}>Best Fit Role</div>
              <div style={{ fontSize: "22px", marginBottom: "0.3rem" }}>{role.emoji} {role.title}</div>
              <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.5 }}>{role.desc}</div>
            </div>
            <div style={{ background: "rgba(123,97,255,0.05)", border: "1px solid rgba(123,97,255,0.15)", borderRadius: "16px", padding: "1.5rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#a78bfa", textTransform: "uppercase", marginBottom: "0.8rem" }}>Where They Thrive</div>
              <div style={{ fontSize: "14px", color: "#ccc", lineHeight: 1.6 }}>{selected.environment}</div>
            </div>
          </div>

          {/* Hiring Note */}
          <div style={{ background: "rgba(232,255,90,0.04)", border: "1px solid rgba(232,255,90,0.15)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#E8FF5A", textTransform: "uppercase", marginBottom: "0.8rem" }}>🔒 Hiring Manager Note</div>
            <div style={{ fontSize: "15px", color: "#ccc", lineHeight: 1.7 }}>{selected.hiring_note}</div>
          </div>

          {/* Contact + Actions */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#555", textTransform: "uppercase", marginBottom: "0.4rem" }}>Contact</div>
              <a href={`mailto:${selected.email}`} style={{ color: "#a78bfa", fontSize: "15px", textDecoration: "none" }}>{selected.email || "No email provided"}</a>
            </div>
            <div style={{ display: "flex", gap: "0.8rem" }}>
              <button onClick={() => toggleShortlist(selected.id, selected.shortlisted)}
                style={{ padding: "10px 20px", background: selected.shortlisted ? "rgba(232,255,90,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${selected.shortlisted ? "rgba(232,255,90,0.4)" : "rgba(255,255,255,0.1)"}`, borderRadius: "10px", color: selected.shortlisted ? "#E8FF5A" : "#888", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>
                {selected.shortlisted ? "⭐ Shortlisted" : "☆ Shortlist"}
              </button>
              <button onClick={() => deleteCandidate(selected.id)}
                style={{ padding: "10px 20px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: "10px", color: "#ff6b6b", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* All Responses */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.5rem" }}>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: "1.2rem" }}>All Responses</div>
            {selected.answers && Object.entries(selected.answers).map(([key, val]) => (
              <div key={key} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.3rem" }}>{key}</div>
                <div style={{ fontSize: "14px", color: "#bbb", lineHeight: 1.6 }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: "#444", marginTop: "1rem", textAlign: "right" }}>Submitted: {new Date(selected.created_at).toLocaleString()}</div>
        </div>
        {toast && <div style={{ position: "fixed", bottom: "2rem", right: "2rem", padding: "12px 20px", background: "rgba(30,30,50,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "14px", backdropFilter: "blur(20px)", zIndex: 999 }}>{toast}</div>}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={sidebarStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem", padding: "0 0.5rem" }}>
          <span>🍯</span>
          <span style={{ fontWeight: "800", fontSize: "14px", background: "linear-gradient(135deg, #E8FF5A, #00C9A7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HoneypotAdvisory</span>
        </div>
        {sidebarItems.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            style={{ padding: "10px 14px", borderRadius: "10px", border: "none", background: page === item.id ? "rgba(123,97,255,0.15)" : "transparent", color: page === item.id ? "#a78bfa" : "#666", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "10px", textAlign: "left", transition: "all 0.15s", borderLeft: page === item.id ? "2px solid #7B61FF" : "2px solid transparent" }}>
            {item.icon} {item.label}
            {item.id === "shortlisted" && candidates.filter(c => c.shortlisted).length > 0 && (
              <span style={{ marginLeft: "auto", background: "#E8FF5A", color: "#0a0a0a", borderRadius: "999px", padding: "1px 8px", fontSize: "11px", fontWeight: "700" }}>{candidates.filter(c => c.shortlisted).length}</span>
            )}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "0.5rem", fontSize: "12px", color: "#333" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00C9A7" }} />
            All systems operational
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "2.5rem" }}>
        {/* OVERVIEW */}
        {page === "overview" && (
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "900", margin: "0 0 0.3rem" }}>Overview</h1>
            <p style={{ color: "#555", margin: "0 0 2.5rem", fontSize: "14px" }}>Welcome back. Here's your talent pipeline at a glance.</p>

            {/* Bento Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { label: "Total Candidates", value: candidates.length, color: "#7B61FF", icon: "👥" },
                { label: "Avg Match Score", value: `${avgConfidence}%`, color: "#00C9A7", icon: "📊" },
                { label: "Strong Yes", value: strongYes, color: "#E8FF5A", icon: "⭐" },
                { label: "Shortlisted", value: candidates.filter(c => c.shortlisted).length, color: "#FF6B35", icon: "🎯" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.5rem" }}>
                  <div style={{ fontSize: "20px", marginBottom: "0.5rem" }}>{s.icon}</div>
                  <div style={{ fontSize: "2rem", fontWeight: "900", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "12px", color: "#555", marginTop: "0.3rem" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Strength Distribution */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "2rem" }}>
                <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: "1.5rem" }}>Strength Distribution</div>
                {candidates.length === 0 ? <div style={{ color: "#444", fontSize: "14px", textAlign: "center", padding: "2rem 0" }}>☕ No candidates yet.<br />Share your application link!</div> :
                  Object.entries(STRENGTH_COLORS).map(([s, c]) => (
                    <div key={s} style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", color: "#888" }}>{s}</span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: c.bg }}>{strengthCounts[s] || 0}</span>
                      </div>
                      <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                        <div style={{ height: "100%", width: candidates.length ? `${((strengthCounts[s] || 0) / candidates.length) * 100}%` : "0%", background: c.bg, borderRadius: "3px" }} />
                      </div>
                    </div>
                  ))
                }
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "2rem" }}>
                <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: "1.5rem" }}>Hire Recommendations</div>
                {candidates.length === 0 ? <div style={{ color: "#444", fontSize: "14px", textAlign: "center", padding: "2rem 0" }}>No data yet</div> :
                  [["Strong Yes", "#00C9A7"], ["Yes", "#E8FF5A"], ["Maybe", "#FF6B35"]].map(([r, color]) => {
                    const count = candidates.filter(c => c.hire_recommendation === r).length;
                    return (
                      <div key={r} style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", color: "#888" }}>{r}</span>
                          <span style={{ fontSize: "13px", fontWeight: "700", color }}>{count}</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px" }}>
                          <div style={{ height: "100%", width: candidates.length ? `${(count / candidates.length) * 100}%` : "0%", background: color, borderRadius: "3px" }} />
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>

            {/* Recent */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "2rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: "1.5rem" }}>Recent Submissions</div>
              {candidates.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#444" }}>
                  <div style={{ fontSize: "48px", marginBottom: "1rem" }}>☕</div>
                  <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "0.5rem" }}>The waiting room is empty.</div>
                  <div style={{ fontSize: "14px" }}>Share your application link to get started!</div>
                </div>
              ) : candidates.slice(0, 5).map(c => {
                const colors = STRENGTH_COLORS[c.primary_strength] || STRENGTH_COLORS["Strategic Thinking"];
                const role = ROLES.find(r => r.id === c.role_id);
                return (
                  <div key={c.id} onClick={() => { setSelected(c); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", borderRadius: "12px", cursor: "pointer", transition: "background 0.15s", marginBottom: "4px" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors.bg, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: "600" }}>{c.name}</div>
                        <div style={{ fontSize: "12px", color: "#555" }}>{c.clifton_theme || c.primary_strength} · {role?.title || c.role_id}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: colors.bg }}>{c.confidence}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ALL CANDIDATES */}
        {(page === "candidates" || page === "shortlisted") && (
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "900", margin: "0 0 0.3rem" }}>{page === "shortlisted" ? "⭐ Shortlisted" : "All Candidates"}</h1>
            <p style={{ color: "#555", margin: "0 0 2rem", fontSize: "14px" }}>{page === "shortlisted" ? `${candidates.filter(c => c.shortlisted).length} candidates shortlisted` : `${candidates.length} total submissions`}</p>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name or email..." style={{ flex: 1, minWidth: "200px", padding: "10px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none" }} />
              <select value={filterStrength} onChange={e => setFilterStrength(e.target.value)} style={{ padding: "10px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none" }}>
                <option value="All">All Strengths</option>
                {Object.keys(STRENGTH_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filterRec} onChange={e => setFilterRec(e.target.value)} style={{ padding: "10px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none" }}>
                <option value="All">All Recommendations</option>
                <option value="Strong Yes">Strong Yes</option>
                <option value="Yes">Yes</option>
                <option value="Maybe">Maybe</option>
              </select>
            </div>

            {(page === "shortlisted" ? candidates.filter(c => c.shortlisted) : filtered).length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#444" }}>
                <div style={{ fontSize: "48px", marginBottom: "1rem" }}>{page === "shortlisted" ? "⭐" : "🔍"}</div>
                <div style={{ fontSize: "16px" }}>{page === "shortlisted" ? "No shortlisted candidates yet." : "No candidates match your search."}</div>
              </div>
            ) : (page === "shortlisted" ? candidates.filter(c => c.shortlisted) : filtered).map(c => {
              const colors = STRENGTH_COLORS[c.primary_strength] || STRENGTH_COLORS["Strategic Thinking"];
              const role = ROLES.find(r => r.id === c.role_id);
              const recColor = { "Strong Yes": "#00C9A7", "Yes": "#E8FF5A", "Maybe": "#FF6B35" }[c.hire_recommendation] || "#888";
              return (
                <div key={c.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.5rem 2rem", marginBottom: "0.8rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", cursor: "pointer", transition: "all 0.15s" }}
                  onClick={() => setSelected(c)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(123,97,255,0.3)"; e.currentTarget.style.background = "rgba(123,97,255,0.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: colors.bg, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "2px" }}>{c.name}</div>
                      <div style={{ fontSize: "13px", color: "#555" }}>{c.clifton_theme || c.primary_strength} · {role?.title || c.role_id} · {c.email}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "999px", background: `${recColor}18`, border: `1px solid ${recColor}44`, fontSize: "12px", color: recColor, fontWeight: "600" }}>{c.hire_recommendation}</span>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "20px", fontWeight: "800", color: colors.bg }}>{c.confidence}%</div>
                      <div style={{ fontSize: "11px", color: "#555" }}>match</div>
                    </div>
                    <button onClick={e => { e.stopPropagation(); toggleShortlist(c.id, c.shortlisted); }} style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", opacity: c.shortlisted ? 1 : 0.3, transition: "opacity 0.15s" }}>⭐</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SETTINGS */}
        {page === "settings" && (
          <div style={{ maxWidth: "600px" }}>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "900", margin: "0 0 0.3rem" }}>Settings</h1>
            <p style={{ color: "#555", margin: "0 0 2.5rem", fontSize: "14px" }}>System information and configuration.</p>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "2rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: "1.5rem" }}>About HoneypotAdvisory</div>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.7, margin: "0 0 1rem" }}>HoneypotAdvisory is an AI-powered talent intelligence platform that uses Clifton StrengthsFinder methodology and rubric-based behavioral analysis to help organizations make smarter, fairer hiring decisions.</p>
              <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>Contact: info@honeypotadvisory.com</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "2rem" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#555", textTransform: "uppercase", marginBottom: "1.5rem" }}>System Status</div>
              {[["AI Engine", "Groq LLaMA 3.3 70B", "#00C9A7"], ["Database", "Supabase PostgreSQL", "#00C9A7"], ["Backend", "Render (Node.js)", "#00C9A7"], ["Frontend", "Vercel (React)", "#00C9A7"]].map(([k, v, c]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: "14px", color: "#888" }}>{k}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c }} />
                    <span style={{ fontSize: "13px", color: "#666" }}>{v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {toast && <div style={{ position: "fixed", bottom: "2rem", right: "2rem", padding: "12px 20px", background: "rgba(30,30,50,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "14px", backdropFilter: "blur(20px)", zIndex: 999 }}>{toast}</div>}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [hrToken, setHrToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.location.pathname === "/hr-dashboard") {
      setPage("hr-login");
    }
  }, []);

  const currentQuestion = QUESTIONS[questionIdx];

  const handleNext = async () => {
    if (questionIdx < QUESTIONS.length - 1) {
      setQuestionIdx(i => i + 1);
    } else {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND_URL}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers })
        });
        const data = await res.json();
        if (res.status === 400 && data.error === "validation_failed") {
          setError(data.message);
          setLoading(false);
          return;
        }
        setPage("thankyou");
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  const containerStyle = { minHeight: "100vh", background: "#070711", color: "#fff", fontFamily: "'Sora', system-ui, sans-serif" };

  if (page === "hr-login") return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {hrToken ? <HRDashboard token={hrToken} /> : <HRLogin onLogin={t => { setHrToken(t); setPage("hr-dashboard"); }} />}
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

  if (loading) return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <LoadingScreen />
    </div>
  );

  if (page === "form") {
    if (error) return (
      <div style={{ ...containerStyle, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.5rem", padding: "2rem", textAlign: "center" }}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <div style={{ fontSize: "48px" }}>⚠️</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", margin: 0 }}>Please provide genuine answers</h2>
        <p style={{ color: "#888", maxWidth: "400px", lineHeight: 1.6 }}>{error}</p>
        <button onClick={() => { setError(null); setQuestionIdx(0); setAnswers({}); setPage("landing"); }}
          style={{ padding: "14px 32px", background: "linear-gradient(135deg, #7B61FF, #5a45cc)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit" }}>
          Start Over
        </button>
      </div>
    );
    return (
      <div style={containerStyle}>
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <QuestionScreen
          question={currentQuestion}
          value={answers[currentQuestion.id]}
          onChange={val => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }))}
          onNext={handleNext}
          onBack={() => setQuestionIdx(i => Math.max(0, i - 1))}
          current={questionIdx + 1}
          total={QUESTIONS.length}
          sectionName={currentQuestion.section}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <LandingPage onStart={() => { setPage("form"); setQuestionIdx(0); setAnswers({}); }} />
    </div>
  );
}