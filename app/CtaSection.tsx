import { DM_Mono, DM_Sans, Playfair_Display } from "next/font/google";

const DMmono = DM_Mono({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

const PlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: "900",
  display: "swap",
});

const DMSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

export function CtaSection() {
  return (
    <section className="relative py-40 bg-[#0d0c0b] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#db593b]/20 rounded-[100%] blur-[120px] pointer-events-none"></div>
      <div className="relative z-10 text-center max-w-3xl px-4 flex flex-col items-center">
        <p
          className={`${DMmono.className} text-xs font-bold tracking-widest text-[#c9973a] uppercase mb-6`}
        >
          Free Forever for Writers
        </p>

        <h2
          className={`${PlayfairDisplay.className} text-5xl md:text-7xl text-white mb-6 leading-tight`}
        >
          Start writing. <br />
          <span className="text-[#db593b] italic">Find your readers.</span>
        </h2>

        <p
          className={`${DMSans.className} text-[#a3a3a3] mb-10 max-w-lg mx-auto`}
        >
          No paywalls. No algorithm fighting you. No posts that disappear after
          24 hours. Just your writing, and the readers who deserve to find it.
        </p>

        <form className="flex w-full max-w-md bg-[#111] gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            required
            className={`${DMSans.className} flex-grow bg-transparent text-white px-5 py-3 outline-none placeholder-[#666] border border-[#333] rounded-xl p-1`}
          />
          <button
            type="submit"
            className={`${DMSans.className} bg-[#db593b] hover:bg-[#bf4a30] transition-colors text-white px-5 py-3 text-[14px] rounded-xl font-bold`}
          >
            Create account →
          </button>
        </form>

        <p className="text-xs text-[#666] mt-6">
          Free to join • No credit card • Publish in minutes
        </p>
      </div>
    </section>
  );
}
