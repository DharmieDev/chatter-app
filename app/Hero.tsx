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

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#0d0c0b] text-[#f2f2f2] overflow-hidden flex flex-col justify-center items-center">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 w-[85rem] px-6 flex flex-grow ">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8">
          <p
            className={`${DMmono.className} text-xs tracking-[0.3em] text-[#c9973a] uppercase`}
          >
            ✦ Publishing Platform for Serious Writers
          </p>
          <h1
            className={`${PlayfairDisplay.className} text-6xl md:text-8xl leading-22 tracking-tighter`}
          >
            Your words <br /> deserve an <br />
            <span className="text-[#db593b] italic leading">audience.</span>
          </h1>
          <p
            className={`${DMSans.className} text-lg text-[#a3a3a3] max-w-md leading-relaxed`}
          >
            Chatter is a text-first publishing platform where{" "}
            <strong className="text-white">ideas travel further</strong> and
            readers actually finish what they start. Write, publish, and grow —
            without the noise.
          </p>
          <div className="flex items-center space-x-4">
            <button className="bg-[#db593b] hover:bg-[#bf4a30] transition-colors text-white px-6 py-3 rounded-md font-medium flex items-center">
              Start writing free <span className="ml-2">→</span>
            </button>
            <button className="border border-[#333] hover:bg-[#1a1a1a] transition-colors text-white px-6 py-3 rounded-md font-medium">
              Read stories
            </button>
          </div>
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
