import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  IconSwords, 
  IconRobot, 
  IconCertificate, 
  IconFlame, 
  IconCpu 
} from "@tabler/icons-react";
import SectionDivider from "../components/SectionDivider.jsx";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";
import { images } from "../assets/images/index.js";
import ArenaImage from "../components/ArenaImage.jsx";

// Custom hook to trigger a count-up transition
function useCountUp(target, duration = 2000, isActive = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const numVal = parseInt(target.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numVal)) {
      setCount(target);
      return;
    }
    let startTimestamp = null;
    let animFrame = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numVal));
      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };
    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [target, duration, isActive]);

  const hasPlus = target.includes("+");
  const hasComma = target.includes(",");

  if (typeof count === "number") {
    let formatted = count.toString();
    if (hasComma) {
      formatted = count.toLocaleString();
    }
    return hasPlus ? `${formatted}+` : formatted;
  }
  return target;
}

export default function Home() {
  const navigate = useNavigate();
  
  // Stats active state observer
  const statsRef = useRef(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleCertSubmit = (e) => {
    e.preventDefault();
    const val = e.target.certCode.value?.trim();
    if (val) {
      navigate(`/verify?cert=${encodeURIComponent(val)}`);
    }
  };

  useDocumentMetadata("The Robo Battle Ground — India's Premier Combat Robotics Arena", "Enter India's ultimate combat robotics arena. Book live battle slots, apply for certified engineering internships, and verify builder credentials.");

  return (
    <PageWrapper>

      <div className="bg-forge text-text-primary min-h-screen overflow-hidden font-body">
        
        {/* Hero Section */}
        <section 
          className="relative h-screen min-h-[600px] w-full bg-[#080808] overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: `url(${images.arena.heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Layer 2: radial-gradient spotlight */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 60% 40%, rgba(255,69,0,0.08) 0%, transparent 60%)"
            }}
          />

          {/* Layer 3: scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)",
              backgroundSize: "100% 3px"
            }}
          />

          {/* Layer 4: vignette */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)"
            }}
          />

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="max-w-4xl mx-auto text-center z-10 px-4 flex flex-col items-center justify-center"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center gap-4 mb-6 w-full justify-center"
            >
              <div className="h-[1px] bg-[#FF4500] w-6 md:w-16 shrink-0" />
              <span className="text-spark font-body text-[11px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap">
                ⚡ INDIA'S PREMIER COMBAT ROBOTICS ARENA
              </span>
              <div className="h-[1px] bg-[#FF4500] w-6 md:w-16 shrink-0" />
            </motion.div>

            {/* Headline */}
            <h1 className="font-display uppercase font-black leading-none mb-6">
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="block text-text-primary text-[clamp(40px,8vw,96px)]"
              >
                ENTER THE
              </motion.span>
              <motion.span
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="block text-fire text-[clamp(40px,8vw,96px)]"
              >
                BATTLE GROUND
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-ash font-body text-[18px] max-w-xl mx-auto mb-10 leading-relaxed font-light"
            >
              Where Machines Go to War. Book your arena slot, intern with us, or verify your certificate.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-wrap justify-center items-center gap-4"
            >
              <Link 
                to="/arena"
                className="px-8 py-4 bg-fire text-forge font-display text-[18px] uppercase tracking-wider hover:bg-[#cc3700] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 select-none rounded-none shrink-0"
              >
                Explore Arena →
              </Link>
              <Link 
                to="/verify"
                className="px-8 py-4 bg-transparent border border-fire text-fire font-display text-[18px] uppercase tracking-wider hover:bg-fire/10 active:scale-[0.98] transition-all duration-200 select-none rounded-none shrink-0"
              >
                Verify Certificate
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom Marquee Ticker */}
          <div className="absolute bottom-0 left-0 w-full bg-fire/10 border-t border-fire/30 h-10 flex items-center overflow-hidden">
            <style>{`
              @keyframes trbg-scroll-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.333%); }
              }
              .animate-trbg-scroll-left {
                display: inline-block;
                animation: trbg-scroll-left 25s linear infinite;
              }
            `}</style>
            <div className="animate-trbg-scroll-left whitespace-nowrap text-spark font-body text-[12px] font-semibold uppercase tracking-[0.15em] select-none">
              {"⚡ ROBOWAR ARENA  ·  BATTLEBOT PIT  ·  COMBAT ROBOTICS  ·  INTERNSHIP PROGRAMS  ·  CERTIFICATE VERIFICATION  ·  TEAM PIRATES  ·  ".repeat(3)}
            </div>
          </div>
        </section>

        {/* SECTION 1 — STATS BAR (Ensure 2x2 grid on mobile) */}
        <section 
          ref={statsRef}
          className="bg-steel border-y border-fire/20 py-12 text-text-primary relative"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0">
              
              {/* Stat Item 1 */}
              <div className="flex flex-col items-center justify-center border-r border-plate pb-2 md:pb-0">
                <span className="font-display text-[clamp(32px,6vw,72px)] font-bold text-fire leading-none mb-2">
                  {useCountUp("500+", 2000, statsActive)}
                </span>
                <span className="font-body text-[11px] md:text-[12px] font-semibold text-ash uppercase tracking-widest text-center">
                  Teams Competed
                </span>
              </div>

              {/* Stat Item 2 */}
              <div className="flex flex-col items-center justify-center md:border-r border-plate pb-2 md:pb-0">
                <span className="font-display text-[clamp(32px,6vw,72px)] font-bold text-fire leading-none mb-2">
                  {useCountUp("3", 2000, statsActive)}
                </span>
                <span className="font-body text-[11px] md:text-[12px] font-semibold text-ash uppercase tracking-widest text-center">
                  Arena Zones
                </span>
              </div>

              {/* Stat Item 3 */}
              <div className="flex flex-col items-center justify-center border-r border-plate pt-2 md:pt-0">
                <span className="font-display text-[clamp(32px,6vw,72px)] font-bold text-fire leading-none mb-2">
                  {useCountUp("200+", 2000, statsActive)}
                </span>
                <span className="font-body text-[11px] md:text-[12px] font-semibold text-ash uppercase tracking-widest text-center">
                  Internship Alumni
                </span>
              </div>

              {/* Stat Item 4 */}
              <div className="flex flex-col items-center justify-center pt-2 md:pt-0">
                <span className="font-display text-[clamp(32px,6vw,72px)] font-bold text-fire leading-none mb-2">
                  {useCountUp("10,000+", 2000, statsActive)}
                </span>
                <span className="font-body text-[11px] md:text-[12px] font-semibold text-ash uppercase tracking-widest text-center">
                  Battles Logged
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2 — SERVICES (angled plate) */}
        <section 
          className="py-28 px-4 bg-[#0D0D0D] relative"
          style={{
            clipPath: "polygon(0 3%, 100% 0, 100% 97%, 0 100%)"
          }}
        >
          <div className="max-w-7xl mx-auto py-6">
            <div className="text-center mb-16">
              <span className="text-spark font-display text-xl uppercase tracking-widest block mb-2">WHAT WE OFFER</span>
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-text-primary">Step Into The Arena</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "RoboWar Arena",
                  icon: <IconSwords size={40} className="text-fire" />,
                  body: "Book heavy-shielded combat cage slots rigged with active spinners and high-impact flippers for live tests.",
                },
                {
                  title: "BattleBot Build Pit",
                  icon: <IconRobot size={40} className="text-fire" />,
                  body: "Access state-of-the-art diagnostic testing spaces, high-power power supplies, and customized metal machining setups.",
                },
                {
                  title: "Internship Program",
                  icon: <IconCertificate size={40} className="text-fire" />,
                  body: "Join our cadet cohorts to acquire certified qualifications in mechanical structures and speed controller tuning.",
                }
              ].map((card, i) => (
                <div 
                  key={i}
                  className="bg-[#111111] border border-[#1A1A1A] p-8 flex flex-col justify-between hover:border-fire hover:-translate-y-[6px] hover:bg-fire/[0.04] transition-all duration-300 group rounded-none"
                >
                  <div>
                    <div className="mb-6">{card.icon}</div>
                    <h3 className="font-display text-2xl uppercase tracking-wider mb-4 text-text-primary group-hover:text-fire transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-ash text-sm leading-relaxed mb-8">{card.body}</p>
                  </div>
                  <Link 
                    to={i === 2 ? "/internships" : "/arena"}
                    className="text-fire text-[13px] font-semibold tracking-wider flex items-center gap-1 hover:underline self-start uppercase"
                  >
                    LEARN MORE →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — CERTIFICATE VERIFY TEASER */}
        <section className="bg-fire text-forge py-16 px-4">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
            
            {/* Left Text */}
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-forge leading-none mb-2">
                VERIFY YOUR CERTIFICATE
              </h2>
              <p className="font-body text-[16px] text-forge/80">
                Every certificate issued by The Robo Battle Ground is verifiable in real-time. No fakes.
              </p>
            </div>

            {/* Right Input Form */}
            <form 
              onSubmit={handleCertSubmit}
              className="w-full lg:max-w-md flex flex-col sm:flex-row items-stretch gap-0"
            >
              <label htmlFor="home-cert-code" className="sr-only">Certificate Verification Code</label>
              <input 
                id="home-cert-code"
                name="certCode"
                type="text" 
                placeholder="Enter cert no. e.g. TRBG-2024-0042"
                className="flex-grow p-4 bg-white text-forge border-none outline-none font-mono uppercase tracking-wider text-sm rounded-none"
                required
              />
              <button 
                type="submit"
                className="bg-[#080808] hover:bg-black text-white font-display text-[18px] tracking-wider px-8 py-4 sm:py-0 uppercase transition-colors rounded-none shrink-0"
              >
                Verify
              </button>
            </form>

          </div>
        </section>

        {/* SECTION 4 — WHY TRBG (Stack to single col on mobile) */}
        <section className="bg-forge py-24 px-4 border-b border-plate">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-text-primary">
                Built Different.
              </h2>
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {[
                {
                  id: "01",
                  title: "Real Arena Infrastructure",
                  body: "We operate real-world, high-stress double-shielded battle cages with heavy hazard actuators. We do not just build slides; we build systems designed to hit."
                },
                {
                  id: "02",
                  title: "Verified Credentials",
                  body: "Our certificates map directly to unique cryptographic codes logged on our main ledger, making it instantly referenceable for employers and colleges."
                },
                {
                  id: "03",
                  title: "Hands-On Learning",
                  body: "Cadets dive straight into real RF telemetry tuning, SolidWorks layouts, high-torque drivetrain math, and brushless motor ESC calibration profiles."
                },
                {
                  id: "04",
                  title: "Nation-Level Competition",
                  body: "Join high-energy, heavy-impact tournament tracks where teams from top tech colleges compete under professional guidelines."
                }
              ].map((row, i) => (
                <div 
                  key={row.id}
                  className="relative py-12 border-b border-plate last:border-none flex flex-col md:flex-row justify-start md:odd:justify-start md:even:justify-end"
                >
                  <div className="max-w-xl relative p-6 w-full text-left">
                    <span className="absolute left-0 top-0 text-[120px] font-display font-black text-fire/[0.06] select-none leading-none -translate-y-4">
                      {row.id}
                    </span>
                    <div className="relative z-10 pl-8">
                      <h3 className="font-display text-3xl text-text-primary mb-2 uppercase">
                        {row.title}
                      </h3>
                      <p className="font-body text-sm text-ash leading-relaxed">
                        {row.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BATTLE GALLERY SECTION */}
        <section className="bg-forge py-24 px-6 border-b border-plate">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-fire font-display text-xl uppercase tracking-widest block mb-2">// Snapshot Logs</span>
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-text-primary">
                FROM THE PIT
              </h2>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {[
                { img: images.robots.bot1, h: "h-80" },
                { img: images.arena.zoneA, h: "h-64" },
                { img: images.robots.bot2, h: "h-96" },
                { img: images.arena.zoneB, h: "h-72" },
                { img: images.robots.bot3, h: "h-64" },
                { img: images.arena.zoneC, h: "h-80" }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="break-inside-avoid overflow-hidden cursor-pointer group border border-plate"
                >
                  <ArenaImage
                    src={item.img}
                    alt={`Battle Pit Shot ${i + 1}`}
                    className={`w-full ${item.h} transition-transform duration-300 group-hover:scale-[1.02]`}
                    overlay={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — CTA BANNER */}
        <section className="bg-steel border border-fire/20 py-20 px-4 text-center relative overflow-hidden">
          {/* Floating Sparks Styles */}
          <style>{`
            @keyframes trbg-drift-up {
              0% { transform: translateY(120px) rotate(0deg); opacity: 0; }
              10% { opacity: 0.03; }
              90% { opacity: 0.03; }
              100% { transform: translateY(-120px) rotate(360deg); opacity: 0; }
            }
            .animate-trbg-drift-slow {
              animation: trbg-drift-up 15s linear infinite;
            }
          `}</style>

          {/* Floating Spark elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <span className="absolute text-[80px] text-fire animate-trbg-drift-slow left-[15%] top-1/4 scale-150" style={{ animationDelay: "0s" }}>⚡</span>
            <span className="absolute text-[60px] text-fire animate-trbg-drift-slow right-[20%] top-1/3 scale-110" style={{ animationDelay: "4s" }}>⚡</span>
            <span className="absolute text-[100px] text-fire animate-trbg-drift-slow left-[40%] top-10 scale-[2.5]" style={{ animationDelay: "8s" }}>⚡</span>
            <span className="absolute text-[50px] text-fire animate-trbg-drift-slow right-[10%] top-[60%] scale-90" style={{ animationDelay: "2s" }}>⚡</span>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-display text-[clamp(32px,6vw,72px)] font-black uppercase text-text-primary mb-6">
              READY TO BATTLE?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                to="/arena"
                className="w-full sm:w-auto px-10 py-4 bg-fire hover:bg-[#cc3700] text-forge font-display text-2xl uppercase tracking-wider transition-colors rounded-none"
              >
                Book Arena Slot
              </Link>
              <Link 
                to="/internships"
                className="w-full sm:w-auto px-10 py-4 border border-fire text-fire hover:bg-fire/10 font-display text-2xl uppercase tracking-wider transition-colors rounded-none"
              >
                Join Internship
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
