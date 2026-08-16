import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "verify" | "change" | "done";

export default function ChangePasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const cameFromForcedReset = Boolean(location.state?.email);
    const [step, setStep] = useState<Step>(location.state?.email ?"change":"verify");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState(location.state?.email ?? "");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


  async function handleRequestCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/check_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Couldn't find an account with that email.");
      const data =await res.json()
      console.log(data)
      setStep("change");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      if (!res.ok) throw new Error("Invalid or expired code.");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FBFCFE]">
      {/* Blueprint grid backdrop, same motif as the login pages */}
      <div className="pointer-events-none absolute inset-0 blueprint-grid" />

      {/* Nav */}
      <nav className="relative z-10 px-6 pt-6 lg:px-20">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 rounded-md py-2 pr-3 text-xs font-medium tracking-[0.2em] text-[#4682B4] transition-colors hover:text-[#033363] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00BFFF]"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          BACK TO LOGIN
        </button>
      </nav>

      {/* Content */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl grid-cols-1 items-center gap-16 px-6 py-12 lg:grid-cols-2 lg:px-20">
        {/* Branding column */}
        <div className="flex flex-col justify-center max-md:text-center max-lg:items-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#4682B4]/30 bg-[#4682B4]/5 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] text-[#033363]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]" />
            SECURE ACCESS
          </span>

          <h1 className="mt-5 text-4xl font-bold uppercase leading-[1.05] tracking-tight text-[#033363]">
            Reset Password
          </h1>

          <div className="mt-4 flex items-center gap-2 text-[#4682B4]">
            <KeyRound size={18} />
            <span className="text-sm font-medium uppercase tracking-[0.2em]">
              Account Recovery
            </span>
          </div>

          <p className="mt-6 max-w-sm text-sm text-gray-500">
            {step === "verify" &&
              "Enter the email linked to your account and we'll send you a verification code."}
            {step === "change" &&
              "Enter the code we sent you and choose a new password."}
            {step === "done" &&
              "Your password has been updated. You can now sign in with your new password."}
          </p>

          {/* Dimension-line divider, a small nod to the blueprint theme */}
          <div className="mt-10 hidden max-w-sm items-center text-[#4682B4]/60 lg:flex">
            <span className="h-2 w-px bg-current" />
            <span className="h-px flex-1 bg-current" />
            <span className="px-3 text-[10px] tracking-[0.3em]">
              {step === "done" ? "RECOVERY.COMPLETE" : "RECOVERY.MODULE"}
            </span>
            <span className="h-px flex-1 bg-current" />
            <span className="h-2 w-px bg-current" />
          </div>
        </div>

        {/* Form column */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* corner brackets */}
            <span className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-[#00BFFF]" />
            <span className="absolute -right-2 -top-2 h-5 w-5 border-r-2 border-t-2 border-[#00BFFF]" />
            <span className="absolute -bottom-2 -left-2 h-5 w-5 border-b-2 border-l-2 border-[#00BFFF]" />
            <span className="absolute -bottom-2 -right-2 h-5 w-5 border-b-2 border-r-2 border-[#00BFFF]" />

            <div className="rounded-sm border border-[#033363]/15 bg-white/80 p-8 shadow-[0_20px_60px_-15px_rgba(3,51,99,0.25)] backdrop-blur-sm sm:p-10">
              {/* Step indicator */}
              <div className="mb-6 flex items-center gap-2">
                {(["verify", "change", "done"] as Step[]).map((s, i) => (
                  <div key={i} className="flex flex-1 items-center gap-2">
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        step === s ||
                        (step === "change" && s === "verify") ||
                        step === "done" 
                          ? "bg-[#00BFFF]"
                          : "bg-[#4682B4]/15"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {step !== "done" && (
                <div className="mb-6 flex items-center justify-between border-b border-dashed border-[#4682B4]/30 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4682B4]">
                    {step === "verify" ? "// Find Account" : "// Verify & Reset"}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF8C00]">
                    Required
                  </span>
                </div>
              )}

              {/* Step 1: request code */}
              {step === "verify" && (
                <form onSubmit={handleRequestCode} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Account Email
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <Mail size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#FF8C00] py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#e67e00] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#033363] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Searching…
                      </>
                    ) : (
                      <>
                        Search email
                        <Mail size={18}/>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: verify code + set new password */}
              {step === "change" &&(

                <form onSubmit={handleResetPassword} className="space-y-5">
                {!cameFromForcedReset &&(
                  <div>
                    <label
                      htmlFor="code"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Verification Code
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <ShieldCheck size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="code"
                        name="code"
                        type="text"
                        required
                        inputMode="numeric"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="6-digit code"
                        className="w-full bg-transparent text-sm tracking-[0.3em] text-[#033363] outline-none placeholder:tracking-normal placeholder:text-[#4682B4]/40"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">
                      Sent to {email || "your email"}.
                    </p>
                  </div>
                )}

                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      New Password
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <Lock size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="new-password"
                        name="newPassword"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Confirm New Password
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <Lock size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#FF8C00] py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#e67e00] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#033363] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Updating password…
                      </>
                    ) : (
                      <>
                        Reset Password
                        <Lock size={18} />
                      </>
                    )}
                  </button>
                    {!email && (
                  <button
                    type="button"
                    onClick={() => setStep("verify")}
                    className="w-full text-center text-xs font-medium text-[#4682B4] hover:text-[#033363] hover:underline"
                  >
                    Use a different email
                  </button>

                    )}
                </form>
              )}

              {/* Step 3: done */}
              {step === "done" && (
                <div className="flex flex-col items-center py-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 size={28} className="text-emerald-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#033363]">
                    Password updated
                  </h3>
                  <p className="mt-1.5 max-w-xs text-sm text-gray-500">
                    You can now sign in using your new password.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#FF8C00] py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#e67e00]"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .blueprint-grid {
          background-image:
            linear-gradient(to right, rgba(70, 130, 180, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(70, 130, 180, 0.07) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>
    </section>
  );
}