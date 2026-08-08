import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  Loader2,
  Handshake,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/hooks/UseLogin";
import toast from "react-hot-toast";
type Mode = "login" | "register";

type LoginForm = {
  email: string;
  password: string;
  role:string
};

type RegisterForm = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;

};

const initialLoginForm: LoginForm = { email: "", password: "", role:"client" };
const initialRegisterForm: RegisterForm = {
  full_name: "",
  email: "",
  password: "",
  confirm_password: "",
};

export default function ClientAuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);
  const [registerForm, setRegisterForm] = useState<RegisterForm>(initialRegisterForm);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleRegisterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  }

 async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    try{
      const user =  await useLogin(loginForm)
      if(user){
        setIsSubmitting(false)
        navigate('/Dashboard/client');
      }
    }catch(err){
      console.log(err)
      alert(err)
    }finally{
      setIsSubmitting(false)
    }
 }

  async function handleRegisterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (registerForm.password !== registerForm.confirm_password) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/registerClient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: registerForm.full_name,
          email: registerForm.email,
          password: registerForm.password,
        }),
      });
      if (!res.ok) throw new Error("Could not create account.");
      const data = await res.json();
      localStorage.setItem("token", data.token);
      toast.success("Account Successfully Created")
      setMode("login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FBFCFE]">
      {/* Blueprint grid backdrop, echoes the landing page background */}
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
          PORTAL SELECT
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
            Client
          </h1>

          <div className="mt-4 flex items-center gap-2 text-[#4682B4]">
            <Handshake size={18} />
            <span className="text-sm font-medium uppercase tracking-[0.2em]">
              Portal Access
            </span>
          </div>

          <p className="mt-6 max-w-sm text-sm text-gray-500">
            Track your project's progress, review updates from your team, and
            stay connected every step of the way.
          </p>

          {/* Dimension-line divider, a small nod to the blueprint theme */}
          <div className="mt-10 hidden max-w-sm items-center text-[#4682B4]/60 lg:flex">
            <span className="h-2 w-px bg-current" />
            <span className="h-px flex-1 bg-current" />
            <span className="px-3 text-[10px] tracking-[0.3em]">
              {mode === "login" ? "AUTH.MODULE" : "REGISTRY.MODULE"}
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
              {/* Mode toggle */}
              <div className="mb-6 grid grid-cols-2 rounded-md border border-[#033363]/15 bg-[#4682B4]/5 p-1 text-xs font-semibold uppercase tracking-[0.15em]">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`rounded-[5px] py-2 transition-colors ${
                    mode === "login"
                      ? "bg-[#033363] text-white"
                      : "text-[#4682B4] hover:text-[#033363]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={`rounded-[5px] py-2 transition-colors ${
                    mode === "register"
                      ? "bg-[#033363] text-white"
                      : "text-[#4682B4] hover:text-[#033363]"
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="mb-6 flex items-center justify-between border-b border-dashed border-[#4682B4]/30 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4682B4]">
                  {mode === "login" ? "// Credentials" : "// New Account"}
                </p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF8C00]">
                  Required
                </span>
              </div>

              {mode === "login" ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Client Email
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <Mail size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        placeholder="you@gmail.com"
                        className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Password
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <Lock size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="login-password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
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
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign In
                        <LogIn size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="full_name"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <User size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        value={registerForm.full_name}
                        onChange={handleRegisterChange}
                        placeholder="Juan Dela Cruz"
                        className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-email"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Email
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <Mail size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        placeholder="you@gmail.com"
                        className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Password
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <Lock size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="register-password"
                        name="password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm_password"
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                    >
                      Confirm Password
                    </label>
                    <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                      <Lock size={18} className="shrink-0 text-[#4682B4]" />
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={registerForm.confirm_password}
                        onChange={handleRegisterChange}
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
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create Account
                        <UserPlus size={18} />
                      </>
                    )}
                  </button>
                </form>
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