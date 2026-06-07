import { LogIn } from "lucide-react";
import { DM_Sans } from "next/font/google";
import Link from "next/link";

const DMsans = DM_Sans({
  subsets: ['latin'],
  display: 'swap'
})

export default function GuestView() {
  return (
    <div className={`${DMsans.className} flex gap-2 text-[14px]`}>
      <button className="bg-[#c8502a] flex items-center gap-1 py-1.5 px-2.5 rounded-md">
        <Link href="/auth/login">Sign in</Link>
        <LogIn className="w-4 h-4" />
      </button>
      <button className="border py-1.5 px-2.5 rounded-md">
        <Link href="/auth/sign-up">Sign up</Link>
      </button>
    </div>
  );
}
