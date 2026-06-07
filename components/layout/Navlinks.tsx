import { DM_Sans } from "next/font/google"


const links = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/main/explore' },
  { name: 'Bookmarks', href: '/main/bookmarks' },
  { name: 'Analytics', href: '/main/analytics' },
]

const DMSans = DM_Sans({
  subsets: ['latin'],
  weight: ['500']
})

export default function Navlinks() {
  return (
    <div className="flex justify-around w-[20rem] items-center">
      {links.map((link) => {
        return <a key={link.name} href={link.href} className={`${DMSans.className} text-[14px] text-[#8a8278] hover:text-white`}>{link.name}</a>
      })}
    </div>
  )
}
