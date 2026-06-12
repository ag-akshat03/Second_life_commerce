import { Globe, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const groups = [
  {
    title: "Get to know us",
    links: ["About Amazon", "Careers", "Press releases", "Amazon Science"]
  },
  {
    title: "Connect with us",
    links: ["Facebook", "Twitter", "Instagram", "LinkedIn"]
  },
  {
    title: "Make money with us",
    links: ["Sell on Amazon", "Fulfilment by Amazon", "Advertise products", "Amazon Pay"]
  },
  {
    title: "Let us help you",
    links: ["Your account", "Returns centre", "100% purchase protection", "Help"]
  }
];

const lowerInformationalLinks = [
  { title: "AbeBooks", desc: "Books, art\n& collectibles" },
  { title: "Amazon Web Services", desc: "Scalable Cloud\nComputing Services" },
  { title: "Audible", desc: "Download\nAudio Books" },
  { title: "DPReview", desc: "Digital\nPhotography" },
  { title: "IMDb", desc: "Movies, TV\n& Celebrities" },
  { title: "Shopbop", desc: "Designer\nFashion Brands" },
  { title: "Amazon Business", desc: "Everything For\nYour Business" },
  { title: "Prime Now", desc: "2-Hour Delivery\non Everyday Items" },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-b from-[#232F3E] to-[#1a232f] text-white border-t-4 border-[#febd69] shadow-2xl">
      {/* Back to top - Layer 1 */}
      <Link 
        href="#" 
        className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#37475a] via-[#485769] to-[#37475a] py-4 text-center text-[14px] font-bold tracking-wider hover:brightness-125 transition-all duration-300"
      >
        <ChevronUp className="h-5 w-5 text-[#febd69] group-hover:-translate-y-1 transition-transform" />
        BACK TO TOP
      </Link>
      
      {/* Main Links - Layer 2 */}
      <div className="mx-auto flex max-w-7xl justify-center px-6 py-14">
        <div className="grid w-full max-w-6xl gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-0 md:divide-x md:divide-gray-600/50">
          {groups.map((group) => (
            <div key={group.title} className="flex flex-col items-start md:items-center px-4">
              <div className="w-full max-w-[200px]">
                <h3 className="mb-5 text-[17px] font-extrabold tracking-wider text-white flex items-center gap-2">
                  {group.title}
                </h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link 
                        href="#" 
                        className="group flex items-center text-[14px] text-gray-300 transition-all duration-300 hover:text-[#febd69] hover:translate-x-1"
                      >
                        <span className="h-px w-0 bg-[#febd69] transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Preferences / Settings - Layer 3 */}
      <div className="border-t border-gray-700/50 bg-[#1e2835] shadow-inner">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-12 md:flex-row md:justify-center md:gap-16">
          <Link href="/" className="group flex items-center justify-center text-4xl font-black tracking-tighter transition-transform hover:scale-105 duration-300 drop-shadow-[0_0_15px_rgba(254,189,105,0.2)]">
            amazon<span className="text-[#febd69] drop-shadow-[0_0_10px_rgba(254,189,105,0.6)]">.in</span>
          </Link>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-gray-500/50 bg-white/5 px-6 py-2.5 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#febd69] hover:bg-white/10 hover:shadow-[0_5px_15px_rgba(254,189,105,0.2)]">
              <Globe className="h-[18px] w-[18px] text-[#febd69]" />
              <span className="text-white">English</span>
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <button className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-gray-500/50 bg-white/5 px-6 py-2.5 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#febd69] hover:bg-white/10 hover:shadow-[0_5px_15px_rgba(254,189,105,0.2)]">
              <span className="text-[#febd69] font-bold">₹</span>
              <span className="text-white">INR - Indian Rupee</span>
            </button>
            <button className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-gray-500/50 bg-white/5 px-6 py-2.5 text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#febd69] hover:bg-white/10 hover:shadow-[0_5px_15px_rgba(254,189,105,0.2)]">
              <MapPin className="h-[18px] w-[18px] text-[#febd69]" />
              <span className="text-white">India</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lower Footer (Subsidiaries) - Layer 4 */}
      <div className="bg-[#0f141a] px-6 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4">
          {lowerInformationalLinks.map((item) => (
            <Link key={item.title} href="#" className="group flex flex-col text-[12px] leading-relaxed transition-transform hover:-translate-y-1 duration-300 p-3 rounded-lg hover:bg-white/5">
              <span className="font-bold text-gray-200 group-hover:text-[#febd69] transition-colors">{item.title}</span>
              <span className="whitespace-pre-line text-gray-500 group-hover:text-gray-300 transition-colors mt-1">{item.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Legal & Copyright - Layer 5 */}
      <div className="bg-[#0a0d11] pb-10 pt-6 text-center text-[13px] text-gray-400">
        <div className="mb-4 flex flex-wrap justify-center gap-8">
          <Link href="#" className="hover:text-[#febd69] transition-colors">Conditions of Use & Sale</Link>
          <Link href="#" className="hover:text-[#febd69] transition-colors">Privacy Notice</Link>
          <Link href="#" className="hover:text-[#febd69] transition-colors">Interest-Based Ads</Link>
        </div>
        <p className="tracking-widest opacity-70">© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates</p>
      </div>
    </footer>
  );
}
