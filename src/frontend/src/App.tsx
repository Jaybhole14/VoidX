import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Home,
  User,
  Shield,
  Phone,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import { useGuardianContact, useSaveGuardianContact, useLogPanicActivation } from "./hooks/useQueries";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type TabId = "home" | "guardian" | "verify" | "call";

function speakText(text: string) {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.lang = "en-IN";
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

interface HomeScreenProps {
  onNavigate: (tab: TabId) => void;
  onDemoMode: () => void;
}

function HomeScreen({ onNavigate, onDemoMode }: HomeScreenProps) {
  const [panicActive, setPanicActive] = useState(false);
  const [showPanicOverlay, setShowPanicOverlay] = useState(false);
  const { data: guardian } = useGuardianContact();
  const logPanic = useLogPanicActivation();

  const handlePanic = useCallback(async () => {
    if (panicActive) return;
    setPanicActive(true);
    setShowPanicOverlay(true);

    try {
      await logPanic.mutateAsync();
    } catch {
      // Non-blocking: log best-effort
    }

    const guardianName = guardian?.name || "your Guardian";
    speakText(
      "Police will NEVER arrest you over a video call. This is a scam! Stay calm. Help is coming."
    );

    toast.success(`Alert sent to ${guardianName}! Mock SMS triggered.`, {
      duration: 6000,
      style: { fontSize: "20px" },
    });

    setTimeout(() => {
      setPanicActive(false);
      setShowPanicOverlay(false);
    }, 8000);
  }, [panicActive, guardian, logPanic]);

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-container">
      {/* Header */}
      <header
        className="flex items-center gap-3 px-5 pt-6 pb-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.1 265), oklch(0.18 0.12 265))",
        }}
      >
        <img
          src="/assets/generated/trust-seal-transparent.dim_120x120.png"
          alt="Trust Seal — Govt Verified"
          style={{
            height: "48px",
            width: "48px",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
        <div>
          <h1
            className="font-display font-extrabold text-sahayak-white leading-tight"
            style={{ fontSize: "2.2rem" }}
          >
            Sahayak
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "oklch(0.88 0.18 95)",
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            Aapka Digital Suraksha Kavach
          </p>
        </div>
      </header>

      {/* Panic Button Section */}
      <div className="flex-1 flex flex-col px-4 pt-4 gap-4">
        {/* PANIC BUTTON */}
        <button
          type="button"
          onClick={handlePanic}
          disabled={panicActive}
          className={`relative w-full rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 select-none ${
            panicActive ? "panic-btn-active" : "panic-btn"
          }`}
          style={{
            background: panicActive
              ? "linear-gradient(135deg, oklch(0.4 0.2 25), oklch(0.5 0.22 25))"
              : "linear-gradient(135deg, oklch(0.52 0.22 25), oklch(0.45 0.2 25))",
            minHeight: "38vh",
            boxShadow: panicActive
              ? "0 0 60px oklch(0.52 0.22 25 / 0.8), 0 8px 32px rgba(0,0,0,0.5)"
              : "0 0 40px oklch(0.52 0.22 25 / 0.5), 0 8px 32px rgba(0,0,0,0.4)",
            border: "4px solid oklch(0.65 0.2 25 / 0.6)",
          }}
          aria-label="Panic button — send emergency alert to guardian"
        >
          {panicActive && (
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.7 0.15 25 / 0.15), transparent)",
              }}
            />
          )}
          <AlertTriangle
            size={64}
            color="white"
            strokeWidth={2.5}
            className={panicActive ? "warning-flash" : ""}
          />
          <span
            className="font-display font-extrabold text-white text-center leading-tight px-4"
            style={{ fontSize: "2rem", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            {panicActive ? "ALERT SENT!" : "DANGER! Press for Help"}
          </span>
          <span
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
            }}
          >
            {panicActive ? "Voice alert playing..." : "Sends alert to your Guardian"}
          </span>
        </button>

        {/* Panic overlay confirmation */}
        {showPanicOverlay && (
          <div
            className="slide-in rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "oklch(0.22 0.08 265)",
              border: "2px solid oklch(0.52 0.22 25 / 0.5)",
            }}
          >
            <CheckCircle size={28} color="oklch(0.7 0.17 150)" />
            <p style={{ fontSize: "1.15rem", color: "white", fontWeight: 600 }}>
              Emergency alert activated! Mock SMS sent to{" "}
              {guardian?.name || "your Guardian"}.
            </p>
          </div>
        )}

        {/* Demo Mode Button */}
        <button
          type="button"
          onClick={onDemoMode}
          className="w-full rounded-2xl flex items-center justify-center gap-3 font-display font-bold transition-all duration-200 active:scale-98"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.88 0.18 95), oklch(0.78 0.17 90))",
            color: "oklch(0.12 0.05 265)",
            fontSize: "1.4rem",
            height: "72px",
            boxShadow: "0 8px 24px oklch(0.88 0.18 95 / 0.3)",
          }}
          aria-label="Demo Mode: Simulate scam call"
        >
          <Phone size={28} />
          Demo Mode: Simulate Scam Call
        </button>

        {/* Quick Nav Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate("verify")}
            className="rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 active:scale-98"
            style={{
              background: "oklch(0.28 0.1 265)",
              border: "2px solid oklch(0.35 0.06 265)",
              height: "80px",
              fontSize: "1.1rem",
              color: "white",
              fontWeight: 700,
            }}
            aria-label="Check Your Rights"
          >
            <Shield size={28} color="oklch(0.88 0.18 95)" />
            Check Your Rights
          </button>
          <button
            type="button"
            onClick={() => onNavigate("guardian")}
            className="rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 active:scale-98"
            style={{
              background: "oklch(0.28 0.1 265)",
              border: "2px solid oklch(0.35 0.06 265)",
              height: "80px",
              fontSize: "1.1rem",
              color: "white",
              fontWeight: 700,
            }}
            aria-label="My Guardian"
          >
            <User size={28} color="oklch(0.88 0.18 95)" />
            My Guardian
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Guardian Screen ───────────────────────────────────────────────────────────

function GuardianScreen() {
  const { data: guardian, isLoading } = useGuardianContact();
  const saveContact = useSaveGuardianContact();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const hasGuardian = guardian && guardian.name && guardian.phoneNumber;

  function handleEdit() {
    setName(guardian?.name || "");
    setPhone(guardian?.phoneNumber || "");
    setIsEditing(true);
    setSaved(false);
  }

  async function handleSave() {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter both name and phone number", { duration: 3000 });
      return;
    }
    try {
      await saveContact.mutateAsync({
        name: name.trim(),
        phoneNumber: phone.trim(),
      });
      setSaved(true);
      setIsEditing(false);
      toast.success("Guardian contact saved successfully!", {
        duration: 4000,
        style: { fontSize: "18px" },
      });
    } catch {
      toast.error("Could not save contact. Please try again.", { duration: 4000 });
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-container">
      {/* Header */}
      <div
        className="px-5 pt-6 pb-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.1 265), oklch(0.18 0.12 265))",
        }}
      >
        <h2
          className="font-display font-extrabold text-white"
          style={{ fontSize: "2rem" }}
        >
          My Emergency Contact
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "oklch(0.88 0.18 95)",
            marginTop: "4px",
          }}
        >
          Guardian-Link Setup
        </p>
      </div>

      <div className="flex flex-col px-4 pt-5 gap-5">
        {/* Info note */}
        <div
          className="rounded-2xl p-4 flex gap-3 items-start"
          style={{
            background: "oklch(0.22 0.08 265)",
            border: "2px solid oklch(0.88 0.18 95 / 0.3)",
          }}
        >
          <AlertTriangle
            size={24}
            color="oklch(0.88 0.18 95)"
            style={{ flexShrink: 0, marginTop: "2px" }}
          />
          <p style={{ fontSize: "1.1rem", color: "white", lineHeight: 1.6 }}>
            This person will be{" "}
            <strong style={{ color: "oklch(0.88 0.18 95)" }}>
              alerted immediately
            </strong>{" "}
            if you press the Panic Button
          </p>
        </div>

        {/* Saved Guardian Card */}
        {!isLoading && hasGuardian && !isEditing && (
          <div
            className="fade-in-up rounded-2xl p-5"
            style={{
              background: "oklch(0.25 0.09 265)",
              border: "2px solid oklch(0.6 0.17 150 / 0.4)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle size={32} color="oklch(0.6 0.17 150)" />
              <span
                className="font-bold text-white"
                style={{ fontSize: "1.3rem" }}
              >
                Guardian Saved
              </span>
            </div>
            <div className="mb-2">
              <p style={{ fontSize: "1rem", color: "oklch(0.7 0.04 265)" }}>
                Name
              </p>
              <p className="font-bold text-white" style={{ fontSize: "1.6rem" }}>
                {guardian.name}
              </p>
            </div>
            <div className="mb-4">
              <p style={{ fontSize: "1rem", color: "oklch(0.7 0.04 265)" }}>
                Phone
              </p>
              <p
                className="font-bold"
                style={{
                  fontSize: "1.6rem",
                  color: "oklch(0.88 0.18 95)",
                }}
              >
                {guardian.phoneNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={handleEdit}
              className="w-full rounded-xl font-bold transition-all active:scale-98"
              style={{
                background: "oklch(0.28 0.1 265)",
                border: "2px solid oklch(0.88 0.18 95 / 0.5)",
                color: "oklch(0.88 0.18 95)",
                fontSize: "1.25rem",
                height: "56px",
              }}
            >
              Edit Contact
            </button>
          </div>
        )}

        {/* Form */}
        {(!hasGuardian || isEditing) && (
          <div className="fade-in-up flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="guardian-name"
                className="font-bold text-white"
                style={{ fontSize: "1.25rem" }}
              >
                {"Guardian's Name"}
              </label>
              <input
                id="guardian-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul (Son)"
                className="rounded-xl px-4 w-full transition-all outline-none"
                style={{
                  background: "oklch(0.25 0.08 265)",
                  border: "2px solid oklch(0.35 0.06 265)",
                  color: "white",
                  fontSize: "1.4rem",
                  height: "64px",
                  caretColor: "oklch(0.88 0.18 95)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "oklch(0.88 0.18 95)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "oklch(0.35 0.06 265)";
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="guardian-phone"
                className="font-bold text-white"
                style={{ fontSize: "1.25rem" }}
              >
                Phone Number
              </label>
              <input
                id="guardian-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="rounded-xl px-4 w-full transition-all outline-none"
                style={{
                  background: "oklch(0.25 0.08 265)",
                  border: "2px solid oklch(0.35 0.06 265)",
                  color: "white",
                  fontSize: "1.4rem",
                  height: "64px",
                  caretColor: "oklch(0.88 0.18 95)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "oklch(0.88 0.18 95)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "oklch(0.35 0.06 265)";
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveContact.isPending}
              className="w-full rounded-2xl font-display font-extrabold text-white transition-all active:scale-98 disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.28 0.1 265), oklch(0.22 0.12 265))",
                border: "2px solid oklch(0.88 0.18 95 / 0.4)",
                fontSize: "1.5rem",
                height: "72px",
              }}
            >
              {saveContact.isPending ? "Saving..." : "Save Guardian Contact"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full rounded-2xl font-bold transition-all active:scale-98"
                style={{
                  background: "transparent",
                  border: "2px solid oklch(0.35 0.06 265)",
                  color: "oklch(0.7 0.04 265)",
                  fontSize: "1.2rem",
                  height: "56px",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {saved && (
          <div
            className="slide-in rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "oklch(0.25 0.09 265)",
              border: "2px solid oklch(0.6 0.17 150 / 0.5)",
            }}
          >
            <CheckCircle size={28} color="oklch(0.6 0.17 150)" />
            <p style={{ fontSize: "1.2rem", color: "white", fontWeight: 600 }}>
              Contact saved! Your Guardian will be alerted in emergencies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Verification Hub ─────────────────────────────────────────────────────────

interface InfoCardProps {
  icon: string;
  title: string;
  subtitle: string;
  items: string[];
  gradient: string;
  borderColor: string;
}

function InfoCard({
  icon,
  title,
  subtitle,
  items,
  gradient,
  borderColor,
}: InfoCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded((e) => !e)}
      className="w-full text-left rounded-2xl transition-all duration-300"
      style={{
        background: gradient,
        border: `2px solid ${borderColor}`,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      }}
      aria-expanded={expanded}
    >
      {/* Collapsed header */}
      <div className="flex items-center gap-4 px-5 py-5">
        <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{icon}</span>
        <div className="flex-1 text-left">
          <p
            className="font-display font-extrabold text-white"
            style={{ fontSize: "1.5rem" }}
          >
            {title}
          </p>
          {!expanded && (
            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.75)",
                marginTop: "2px",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className="shrink-0">
          {expanded ? (
            <ChevronUp size={28} color="rgba(255,255,255,0.8)" />
          ) : (
            <ChevronDown size={28} color="rgba(255,255,255,0.8)" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/20">
          <ul className="flex flex-col gap-3 mt-4">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  style={{
                    color: "oklch(0.88 0.18 95)",
                    fontSize: "1.4rem",
                    lineHeight: 1.4,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: "white",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </button>
  );
}

function VerifyScreen() {
  return (
    <div className="flex flex-col h-full overflow-y-auto scroll-container">
      <div
        className="px-5 pt-6 pb-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.1 265), oklch(0.18 0.12 265))",
        }}
      >
        <h2
          className="font-display font-extrabold text-white"
          style={{ fontSize: "2rem" }}
        >
          Verification Hub
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "oklch(0.88 0.18 95)",
            marginTop: "4px",
          }}
        >
          Know your rights. Stay protected.
        </p>
      </div>

      <div className="flex flex-col px-4 pt-5 gap-4">
        <InfoCard
          icon="🚔"
          title="Police Rights"
          subtitle="Know your rights against fake police"
          gradient="linear-gradient(135deg, oklch(0.22 0.12 265), oklch(0.28 0.1 265))"
          borderColor="oklch(0.5 0.18 265 / 0.5)"
          items={[
            "Real police NEVER arrest over video call",
            "Real police NEVER ask for money online",
            "Real police NEVER ask for your bank OTP",
            "If in doubt, hang up and call 100",
          ]}
        />
        <InfoCard
          icon="🏦"
          title="Bank Safety"
          subtitle="Protect your money from scammers"
          gradient="linear-gradient(135deg, oklch(0.2 0.1 150), oklch(0.25 0.08 150))"
          borderColor="oklch(0.45 0.15 150 / 0.5)"
          items={[
            "Your bank NEVER asks for OTP on calls",
            "Never share your ATM PIN with anyone",
            "Freeze your account: call your bank helpline",
            "Report fraud: 1930 (Cyber Crime Helpline)",
          ]}
        />
        <InfoCard
          icon="🚨"
          title="Report a Scam"
          subtitle="Reached here in time? Report now!"
          gradient="linear-gradient(135deg, oklch(0.25 0.1 25), oklch(0.3 0.08 25))"
          borderColor="oklch(0.52 0.22 25 / 0.4)"
          items={[
            "National Cyber Crime: cybercrime.gov.in",
            "Helpline: 1930",
            "WhatsApp Scams: report in app",
            "Tell your family immediately",
          ]}
        />

        {/* Emergency numbers */}
        <div
          className="rounded-2xl p-4 mt-2 mb-6"
          style={{
            background: "oklch(0.22 0.08 265)",
            border: "2px solid oklch(0.88 0.18 95 / 0.3)",
          }}
        >
          <p
            className="font-bold text-white mb-3"
            style={{ fontSize: "1.25rem" }}
          >
            ☎ Emergency Numbers
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["Police", "100"],
                ["Cyber Crime", "1930"],
                ["Women Safety", "1091"],
                ["Ambulance", "108"],
              ] as [string, string][]
            ).map(([label, num]) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center"
                style={{ background: "oklch(0.28 0.1 265)" }}
              >
                <p style={{ fontSize: "1rem", color: "oklch(0.7 0.04 265)" }}>
                  {label}
                </p>
                <p
                  className="font-display font-extrabold"
                  style={{
                    fontSize: "1.5rem",
                    color: "oklch(0.88 0.18 95)",
                  }}
                >
                  {num}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Call/Intervener Screen ───────────────────────────────────────────────────

type CallState = "idle" | "incoming" | "active" | "warning";

function CallScreen() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = useCallback(() => {
    setCallState("active");
    setTimeLeft(10 * 60);
  }, []);

  const declineCall = useCallback(() => {
    setCallState("idle");
  }, []);

  const triggerWarning = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCallState("warning");
    speakText(
      "Warning! You have been on this call for ten minutes. Scammers use long calls to confuse you. Hang up now! Real officials do NOT call like this."
    );
  }, []);

  const resetCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCallState("idle");
    setTimeLeft(10 * 60);
    window.speechSynthesis?.cancel();
  }, []);

  // Start timer when active
  useEffect(() => {
    if (callState !== "active") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Trigger warning when timer hits zero
  useEffect(() => {
    if (callState === "active" && timeLeft === 0) {
      triggerWarning();
    }
  }, [callState, timeLeft, triggerWarning]);

  // Simulate incoming call on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallState((prev) => (prev === "idle" ? "incoming" : prev));
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{ background: "oklch(0.08 0.03 265)" }}
    >
      {/* Idle / Incoming state */}
      {(callState === "idle" || callState === "incoming") && (
        <div className="flex flex-col items-center justify-between h-full py-10 px-6">
          <div className="flex flex-col items-center gap-4 mt-8">
            {/* Fake caller avatar */}
            <div className="relative">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "120px",
                  height: "120px",
                  background:
                    "linear-gradient(135deg, oklch(0.3 0.08 265), oklch(0.2 0.05 265))",
                  border: "4px solid oklch(0.35 0.06 265)",
                }}
              >
                <User size={64} color="oklch(0.5 0.04 265)" />
              </div>
              {callState === "incoming" && (
                <div
                  className="absolute -inset-2 rounded-full border-2 animate-ping"
                  style={{ borderColor: "oklch(0.6 0.17 150 / 0.5)" }}
                />
              )}
            </div>
            <h3
              className="font-display font-extrabold text-white"
              style={{ fontSize: "1.8rem" }}
            >
              Unknown Number
            </h3>
            {callState === "incoming" && (
              <p
                className="warning-flash font-bold"
                style={{ fontSize: "1.2rem", color: "oklch(0.6 0.17 150)" }}
              >
                📱 Incoming Video Call...
              </p>
            )}
          </div>

          {callState === "incoming" && (
            <div className="flex gap-6 w-full px-4">
              <button
                type="button"
                onClick={declineCall}
                className="flex-1 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-white transition-all active:scale-95"
                style={{
                  background: "oklch(0.52 0.22 25)",
                  height: "88px",
                  fontSize: "1.2rem",
                  boxShadow: "0 8px 24px oklch(0.52 0.22 25 / 0.4)",
                }}
              >
                <Phone size={32} style={{ transform: "rotate(135deg)" }} />
                Decline
              </button>
              <button
                type="button"
                onClick={startCall}
                className="flex-1 rounded-2xl flex flex-col items-center justify-center gap-2 font-bold text-white transition-all active:scale-95"
                style={{
                  background: "oklch(0.55 0.18 150)",
                  height: "88px",
                  fontSize: "1.2rem",
                  boxShadow: "0 8px 24px oklch(0.55 0.18 150 / 0.4)",
                }}
              >
                <Phone size={32} />
                Answer
              </button>
            </div>
          )}

          {callState === "idle" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "oklch(0.6 0.04 265)",
                  textAlign: "center",
                }}
              >
                Tap below to simulate an incoming scam call
              </p>
              <button
                type="button"
                onClick={() => setCallState("incoming")}
                className="w-full rounded-2xl font-bold transition-all active:scale-98"
                style={{
                  background: "oklch(0.55 0.18 150)",
                  color: "white",
                  fontSize: "1.3rem",
                  height: "72px",
                }}
              >
                📞 Simulate Incoming Call
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active call state with timer */}
      {callState === "active" && (
        <div className="flex flex-col h-full">
          {/* Call header */}
          <div
            className="flex flex-col items-center pt-8 pb-4 gap-3"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.1 0.04 265), transparent)",
            }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "80px",
                height: "80px",
                background: "oklch(0.3 0.08 265)",
                border: "3px solid oklch(0.35 0.06 265)",
              }}
            >
              <User size={44} color="oklch(0.5 0.04 265)" />
            </div>
            <p className="font-bold text-white" style={{ fontSize: "1.4rem" }}>
              Unknown Number
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p style={{ fontSize: "1rem", color: "oklch(0.6 0.17 150)" }}>
                Call in progress
              </p>
            </div>
          </div>

          {/* Timer display */}
          <div className="flex flex-col items-center gap-3 mt-6 px-6">
            <div
              className="rounded-2xl p-5 w-full text-center timer-pulse"
              style={{
                background:
                  timeLeft < 120
                    ? "linear-gradient(135deg, oklch(0.3 0.12 25), oklch(0.25 0.1 25))"
                    : "oklch(0.22 0.08 265)",
                border: `2px solid ${
                  timeLeft < 120
                    ? "oklch(0.52 0.22 25 / 0.6)"
                    : "oklch(0.35 0.06 265)"
                }`,
              }}
            >
              <p
                style={{
                  fontSize: "1rem",
                  color: "oklch(0.7 0.04 265)",
                  marginBottom: "4px",
                }}
              >
                Call Duration
              </p>
              <p
                className="font-display font-extrabold"
                style={{
                  fontSize: "3.5rem",
                  color:
                    timeLeft < 120
                      ? "oklch(0.88 0.2 25)"
                      : "oklch(0.88 0.18 95)",
                  letterSpacing: "0.05em",
                }}
              >
                {formatTime(10 * 60 - timeLeft)}
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "oklch(0.7 0.04 265)",
                  marginTop: "4px",
                }}
              >
                Intervener: {formatTime(timeLeft)} remaining
              </p>
            </div>

            {/* Warning during active call */}
            <div
              className="rounded-2xl p-4 w-full"
              style={{
                background: "oklch(0.22 0.08 265)",
                border: "2px solid oklch(0.88 0.18 95 / 0.3)",
              }}
            >
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "oklch(0.88 0.18 95)",
                  fontWeight: 600,
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                👁 Sahayak is watching. If this is a scam call, press the Panic
                Button.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 px-6 mt-auto mb-4">
            <button
              type="button"
              onClick={triggerWarning}
              className="w-full rounded-2xl font-bold transition-all active:scale-98"
              style={{
                background: "oklch(0.28 0.1 265)",
                border: "2px solid oklch(0.35 0.06 265)",
                color: "oklch(0.88 0.18 95)",
                fontSize: "1.1rem",
                height: "60px",
              }}
            >
              ⏩ Fast Forward (Demo) — Trigger Warning
            </button>
            <button
              type="button"
              onClick={resetCall}
              className="w-full rounded-2xl font-bold transition-all active:scale-98"
              style={{
                background: "oklch(0.52 0.22 25)",
                color: "white",
                fontSize: "1.2rem",
                height: "64px",
              }}
            >
              🔴 End Call
            </button>
          </div>
        </div>
      )}

      {/* Warning overlay */}
      {callState === "warning" && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-start pt-8 px-5 overflow-y-auto"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.35 0.15 25) 0%, oklch(0.25 0.12 25) 100%)",
            zIndex: 60,
          }}
        >
          <div className="w-full max-w-md flex flex-col items-center gap-5">
            <span
              style={{ fontSize: "5rem", lineHeight: 1 }}
              className="warning-flash"
            >
              ⚠️
            </span>

            <h2
              className="font-display font-extrabold text-white text-center"
              style={{ fontSize: "2rem" }}
            >
              WARNING!
            </h2>
            <p
              className="font-bold text-center"
              style={{ fontSize: "1.4rem", color: "white", lineHeight: 1.5 }}
            >
              You have been on this call for 10 minutes.
            </p>
            <p
              className="text-center"
              style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.5,
              }}
            >
              Scammers use long calls to confuse you!
            </p>
            <div
              className="rounded-2xl p-5 w-full"
              style={{
                background: "rgba(0,0,0,0.3)",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              <p
                className="font-extrabold text-center"
                style={{ fontSize: "1.5rem", color: "white", lineHeight: 1.5 }}
              >
                HANG UP NOW.
              </p>
              <p
                className="text-center mt-2"
                style={{
                  fontSize: "1.15rem",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Real officials do NOT call like this.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full mt-2 pb-6">
              <button
                type="button"
                onClick={resetCall}
                className="w-full rounded-2xl font-display font-extrabold text-white transition-all active:scale-98"
                style={{
                  background: "oklch(0.15 0.05 265)",
                  border: "3px solid white",
                  fontSize: "1.5rem",
                  height: "72px",
                }}
              >
                📵 HANG UP NOW
              </button>
              <button
                type="button"
                onClick={() => setCallState("idle")}
                className="w-full rounded-2xl font-bold transition-all active:scale-98"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  color: "white",
                  fontSize: "1.2rem",
                  height: "60px",
                }}
              >
                {"I'm Safe (Dismiss Warning)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Demo Mode Overlay ────────────────────────────────────────────────────────

interface DemoOverlayProps {
  onClose: () => void;
}

type DemoStage = "incoming" | "intervention";

function DemoOverlay({ onClose }: DemoOverlayProps) {
  const [stage, setStage] = useState<DemoStage>("incoming");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { data: guardian } = useGuardianContact();

  function handleDecline() {
    toast.success("Good choice! Stay safe.", {
      duration: 3000,
      style: { fontSize: "18px" },
    });
    onClose();
  }

  function handleAccept() {
    setIsTransitioning(true);
    setTimeout(() => {
      setStage("intervention");
      setIsTransitioning(false);
      speakText(
        "Warning! This is a scam. The CBI does not arrest people over video calls. Please hang up immediately."
      );
    }, 3000);
  }

  function handleHangUpSafe() {
    window.speechSynthesis?.cancel();
    onClose();
    toast.success("Good choice! Sahayak kept you safe.", {
      duration: 4000,
      style: { fontSize: "18px" },
    });
  }

  function handleCallGuardian() {
    window.speechSynthesis?.cancel();
    const guardianName = guardian?.name || "your Guardian";
    toast.success(
      `Mock SMS sent to ${guardianName}: "I need help, possible scam call!"`,
      {
        duration: 5000,
        style: { fontSize: "18px" },
      }
    );
    onClose();
  }

  return (
    <div
      className="fixed inset-0 flex flex-col demo-slide-in"
      style={{ zIndex: 100 }}
    >
      {/* WhatsApp-style incoming call */}
      {stage === "incoming" && (
        <div
          className="flex flex-col h-full"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.35 0.15 150) 0%, oklch(0.1 0.05 265) 40%)",
          }}
        >
          {/* WhatsApp header */}
          <div className="flex items-center gap-2 px-5 pt-8 pb-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "oklch(0.7 0.2 150)" }}
            />
            <span style={{ fontSize: "1rem", color: "white", fontWeight: 600 }}>
              WhatsApp
            </span>
          </div>

          {/* Caller info */}
          <div className="flex flex-col items-center gap-4 mt-8 px-6">
            {/* Profile photo placeholder */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "120px",
                height: "120px",
                background:
                  "linear-gradient(135deg, oklch(0.3 0.08 30), oklch(0.2 0.06 30))",
                border: "4px solid rgba(255,255,255,0.3)",
              }}
            >
              <User size={60} color="rgba(255,255,255,0.6)" />
            </div>

            <div className="text-center">
              <h3
                className="font-display font-extrabold text-white"
                style={{ fontSize: "1.8rem" }}
              >
                CBI Officer - Rajesh Kumar
              </h3>
              <p
                className="warning-flash mt-2"
                style={{
                  fontSize: "1.2rem",
                  color: "oklch(0.8 0.18 150)",
                  fontWeight: 600,
                }}
              >
                📹 Incoming WhatsApp Video Call...
              </p>
            </div>

            {/* Scam warning hint */}
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "center",
                }}
              >
                🔴 Demo Mode: This simulates a real scam call pattern
              </p>
            </div>
          </div>

          {/* Loading indicator during transition */}
          {isTransitioning && (
            <div className="flex flex-col items-center gap-3 mt-8 px-6">
              <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin" />
              <p style={{ fontSize: "1.2rem", color: "white" }}>
                Connecting call... Sahayak analyzing...
              </p>
            </div>
          )}

          {/* Buttons */}
          {!isTransitioning && (
            <div className="flex gap-6 px-8 mt-auto mb-12">
              <button
                type="button"
                onClick={handleDecline}
                className="flex-1 rounded-full flex flex-col items-center justify-center gap-2 font-bold text-white transition-all active:scale-95"
                style={{
                  background: "oklch(0.52 0.22 25)",
                  height: "88px",
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 24px oklch(0.52 0.22 25 / 0.5)",
                }}
              >
                <Phone
                  size={32}
                  style={{ transform: "rotate(135deg)" }}
                />
                Decline
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 rounded-full flex flex-col items-center justify-center gap-2 font-bold text-white transition-all active:scale-95"
                style={{
                  background: "oklch(0.55 0.18 150)",
                  height: "88px",
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 24px oklch(0.55 0.18 150 / 0.5)",
                }}
              >
                <Phone size={32} />
                Accept
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sahayak Intervention overlay */}
      {stage === "intervention" && (
        <div
          className="flex flex-col h-full px-5 pt-8 pb-6 overflow-y-auto"
          style={{
            background:
              "linear-gradient(160deg, oklch(0.14 0.12 265) 0%, oklch(0.1 0.08 265) 100%)",
          }}
        >
          {/* Logo and header */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/assets/generated/trust-seal-transparent.dim_120x120.png"
              alt="Sahayak Trust Seal"
              style={{ height: "48px", width: "48px" }}
            />
            <span
              className="font-display font-extrabold text-white"
              style={{ fontSize: "1.8rem" }}
            >
              Sahayak
            </span>
          </div>

          {/* Main warning */}
          <div className="flex flex-col items-center gap-4 flex-1">
            <span
              style={{ fontSize: "5rem", lineHeight: 1 }}
              className="warning-flash"
            >
              ⚠️
            </span>

            <h2
              className="font-display font-extrabold text-center"
              style={{ fontSize: "2rem", color: "oklch(0.88 0.2 25)" }}
            >
              SCAM ALERT DETECTED!
            </h2>
            <p
              className="text-center font-bold"
              style={{
                fontSize: "1.2rem",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.5,
              }}
            >
              This call matches known Digital Arrest scam patterns
            </p>

            <div
              className="w-full rounded-2xl p-5"
              style={{
                background: "oklch(0.2 0.08 265)",
                border: "2px solid oklch(0.52 0.22 25 / 0.4)",
              }}
            >
              <ul className="flex flex-col gap-3">
                {[
                  "CBI does NOT make video calls",
                  "This is a common fraud tactic",
                  "You are NOT under arrest",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      style={{
                        color: "oklch(0.88 0.18 95)",
                        fontSize: "1.4rem",
                        lineHeight: 1.4,
                      }}
                    >
                      ✗
                    </span>
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "white",
                        fontWeight: 600,
                        lineHeight: 1.5,
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="button"
              onClick={handleHangUpSafe}
              className="w-full rounded-2xl font-display font-extrabold text-white transition-all active:scale-98"
              style={{
                background: "oklch(0.52 0.22 25)",
                fontSize: "1.4rem",
                height: "72px",
                boxShadow: "0 8px 24px oklch(0.52 0.22 25 / 0.5)",
              }}
            >
              📵 HANG UP & STAY SAFE
            </button>
            <button
              type="button"
              onClick={handleCallGuardian}
              className="w-full rounded-2xl font-display font-extrabold transition-all active:scale-98"
              style={{
                background: "oklch(0.88 0.18 95)",
                color: "oklch(0.12 0.05 265)",
                fontSize: "1.3rem",
                height: "72px",
                boxShadow: "0 8px 24px oklch(0.88 0.18 95 / 0.3)",
              }}
            >
              📞 Call My Guardian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bottom Tab Bar ────────────────────────────────────────────────────────────

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

interface TabDef {
  id: TabId;
  label: string;
  Icon: (props: { size: number; strokeWidth: number }) => ReactNode;
}

const TABS: TabDef[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "guardian", label: "Guardian", Icon: User },
  { id: "verify", label: "Verify", Icon: Shield },
  { id: "call", label: "Call", Icon: Phone },
];

function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="shrink-0 flex items-stretch"
      style={{
        background: "oklch(0.12 0.1 265)",
        borderTop: "2px solid oklch(0.25 0.08 265)",
        height: "72px",
        boxShadow: "0 -8px 24px rgba(0,0,0,0.3)",
      }}
      aria-label="Bottom navigation"
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200"
            style={{
              color: isActive
                ? "oklch(0.88 0.18 95)"
                : "oklch(0.55 0.04 265)",
              background: isActive ? "oklch(0.18 0.1 265)" : "transparent",
              borderTop: isActive
                ? "3px solid oklch(0.88 0.18 95)"
                : "3px solid transparent",
            }}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={isActive ? 28 : 24} strokeWidth={isActive ? 2.5 : 1.5} />
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "0.02em",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div
      className="flex flex-col"
      style={{
        height: "100dvh",
        maxWidth: "480px",
        margin: "0 auto",
        background: "oklch(0.18 0.1 265)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Main content area */}
      <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {activeTab === "home" && (
          <HomeScreen
            onNavigate={setActiveTab}
            onDemoMode={() => setShowDemo(true)}
          />
        )}
        {activeTab === "guardian" && <GuardianScreen />}
        {activeTab === "verify" && <VerifyScreen />}
        {activeTab === "call" && <CallScreen />}
      </main>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Demo Mode Overlay */}
      {showDemo && <DemoOverlay onClose={() => setShowDemo(false)} />}

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.22 0.08 265)",
            color: "white",
            border: "2px solid oklch(0.35 0.06 265)",
            fontSize: "18px",
            fontWeight: 600,
            padding: "16px 20px",
          },
        }}
      />

      {/* Footer */}
      <div
        className="shrink-0 text-center py-1"
        style={{
          background: "oklch(0.12 0.1 265)",
          fontSize: "0.75rem",
          color: "oklch(0.4 0.04 265)",
        }}
      >
        © 2026.{" "}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "oklch(0.88 0.18 95)", textDecoration: "none" }}
        >
          Built with ❤️ using caffeine.ai
        </a>
      </div>
    </div>
  );
}
