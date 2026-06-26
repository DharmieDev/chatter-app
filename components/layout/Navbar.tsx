"use client";

import Navlinks from "./Navlinks";
import { Playfair_Display } from "next/font/google";
import { useAuth } from "@/app/providers/providers";
import Loading from "../Loading";
import UserView from "../UserView";
import GuestView from "../GuestView";
import SearchBar from "./Searchbar";
import NotificationBell from "./NotificationBell";
import Link from "next/link";

const playfairDisplayItalic = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  style: "italic",
  display: "swap",
});

interface NavbarProps {
  username: string | null;
}

export default function Navbar({ username }: NavbarProps) {
  const user = useAuth((store) => store.user);
  const isLoading = useAuth((store) => store.isLoading);

  return (
    <div className="sticky top-0 z-50 flex w-full h-[60px] items-center bg-[#0f0e0c] justify-around">
      <div>
        <span
          className={`${playfairDisplayItalic.className} text-[22px] text-orange-500`}
        >
          Ch
        </span>
        <span className={`${playfairDisplayItalic.className} text-[22px]`}>
          atter
        </span>
      </div>
      <Navlinks />
      {isLoading ? (
        <Loading />
      ) : user ? (
        <div className="flex items-center gap-4">
          <SearchBar />
          <NotificationBell />
          <Link
            href="/main/write"
            className="flex items-center gap-2 px-4 py-2 bg-[#E55B2B] hover:bg-[#D44A1A] text-white text-sm font-medium rounded-md transition-colors"
          >
            <span>✦</span> Write
          </Link>
          <UserView username={username} />
        </div>
      ) : (
        <GuestView />
      )}
    </div>
  );
}
