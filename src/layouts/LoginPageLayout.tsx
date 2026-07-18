import { useState } from "react";
import { ArrowLeft, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type LoginPageProps = {
  Dashboard_direct: string;
  logo: LucideIcon;
  name: string;
  email_name: string;
};

export default function Loginlayout({
  Dashboard_direct,
  logo: Logo,
  name,
  email_name,
}: LoginPageProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLogindetails, getLogindetails] = useState({
    email:'',
    password:''
  })


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    try{
      const res = await fetch("http://localhost:3000/validation",{
        method:"POST",
        headers :{'Content-Type':'application/json'},
        body:JSON.stringify(userLogindetails)
      })

    if(!res.ok){
       throw new Error("Invalid email or password");
    }

    const data = await res.json();
    console.log(data)
    // e.g. save a token so future requests know you're logged in
    localStorage.setItem("token", data.token);
    setIsSubmitting(false)
    navigate(Dashboard_direct);

    }catch(err){
      console.log(err)
      setIsSubmitting(false)
      alert("wrong credentials")
    }



  }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        getLogindetails(prev=>({...prev,[e.target.name]: e.target.value}))
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
          className="group flex items-center gap-2 rounded-md py-2 pr-3 text-xs font-medium tracking-[0.2em] text-[#4682B4] transition-colors hover:text-[#033363] focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-[#00BFFF]"
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
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#4682B4]/30 bg-[#4682B4]/5 px-3 py-1 text-[10px] font-semibold tracking-[0.25em] text-[#033363]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00BFFF]" />
            SECURE ACCESS
          </span>

          <h1 className="mt-5 text-4xl font-bold uppercase leading-[1.05] tracking-tight text-[#033363]">
            {name}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-[#4682B4]">
            <Logo size={18} />
            <span className="text-sm font-medium uppercase tracking-[0.2em]">
              Portal Login
            </span>
          </div>

          {/* Dimension-line divider, a small nod to the blueprint theme */}
          <div className="mt-10 hidden max-w-sm items-center text-[#4682B4]/60 lg:flex">
            <span className="h-2 w-px bg-current" />
            <span className="h-px flex-1 bg-current" />
            <span className="px-3 text-[10px] tracking-[0.3em]">AUTH.MODULE</span>
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

            <form
              onSubmit={handleSubmit}
              className="rounded-sm border border-[#033363]/15 bg-white/80 p-8 shadow-[0_20px_60px_-15px_rgba(3,51,99,0.25)] backdrop-blur-sm sm:p-10"
            >
              <div className="mb-6 flex items-center justify-between border-b border-dashed border-[#4682B4]/30 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4682B4]">
                  // Credentials
                </p>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF8C00]">
                  Required
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                  
                  >
                    {email_name}
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                    <Mail size={18} className="shrink-0 text-[#4682B4]" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@gmail.com"
                      className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#033363]"
                  >
                    Password
                  </label>
                  <div className="flex items-center gap-2 rounded-md border border-[#033363]/20 bg-white px-3 py-2.5 transition-colors focus-within:border-[#00BFFF] focus-within:ring-2 focus-within:ring-[#00BFFF]/30">
                    <Lock size={18} className="shrink-0 text-[#4682B4]" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className="w-full bg-transparent text-sm text-[#033363] outline-none placeholder:text-[#4682B4]/40"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-[#FF8C00] py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#e67e00] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#033363] disabled:cursor-not-allowed disabled:opacity-60"
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