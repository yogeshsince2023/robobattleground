import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconSwords, 
  IconRobot, 
  IconCertificate, 
  IconClipboardText, 
  IconMail, 
  IconFlame, 
  IconChevronDown, 
  IconCheck 
} from "@tabler/icons-react";
import SectionDivider from "../components/SectionDivider.jsx";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";
import { images } from "../assets/images/index.js";
import ArenaImage from "../components/ArenaImage.jsx";
import { submitArenaEnquiry } from "../lib/db.js";

const rulesData = [
  { title: "1. No projectile weapons above 10 joules energy", body: "All active tethered or untethered projectiles must undergo kinematic safety review. Air pressure canisters and spring systems must fit within structural energy specifications." },
  { title: "2. All bots must have a visible power cutoff switch", body: "A manual main link or switch must be easily accessible from the exterior of the chassis to shut down all telemetry and weapon motors immediately." },
  { title: "3. Team members must wear safety goggles in pit area", body: "Eye protection is mandatory inside the testing pits. No activation of spin-weapons or high-torque drive tests are allowed without pit supervisor authorization." },
  { title: "4. Bot must pass safety inspection before each match", body: "Weight validation, radio fail-safe tests, and sharp edge shielding checks will be conducted by the lead marshal 15 minutes before battle schedule." },
  { title: "5. Fire-based weapons require prior written approval", body: "Flame-thrower modules using liquid gas fuel must operate under strict duration caps and carry dedicated safety feedback cutoff valves." },
  { title: "6. The arena marshal's decision is final and binding", body: "Match parameters, safety violations, disqualifications, and countdowns are completely under the authority of the lead safety marshal in charge." }
];

export default function Arena() {
  // Accordion state
  const [openRuleIndex, setOpenRuleIndex] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    teamName: "",
    weightClass: "",
    preferredDate: "",
    botDesc: "",
    referral: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const formSectionRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.teamName.trim()) newErrors.teamName = "Team/Institution name is required.";
    if (!formData.weightClass) newErrors.weightClass = "Please select a weight class.";
    if (!formData.preferredDate) newErrors.preferredDate = "Please choose a preferred date.";
    if (!formData.botDesc.trim()) newErrors.botDesc = "Bot description is required.";
    if (!formData.referral) newErrors.referral = "Please select an answer.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const insertData = {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          team_name: formData.teamName,
          weight_class: formData.weightClass,
          preferred_date: formData.preferredDate,
          bot_description: formData.botDesc,
          heard_from: formData.referral
        };
        const { error: submitErr } = await submitArenaEnquiry(insertData);
        if (submitErr) throw submitErr;
        setSuccess(true);
      } catch (err) {
        alert("Enquiry transmission failed. Please try again.");
      }
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      teamName: "",
      weightClass: "",
      preferredDate: "",
      botDesc: "",
      referral: ""
    });
    setSuccess(false);
  };

  const scrollFormToView = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useDocumentMetadata("Arena & Services — The Robo Battle Ground", "Explore details for India's premier combat robotics cages. Register heavy weights, check active pit hazards, and submit reservation specs.");

  return (
    <PageWrapper>

      <div className="bg-forge text-text-primary min-h-screen font-body overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative min-h-[60vh] w-full bg-[#080808] overflow-hidden flex flex-col justify-center items-center text-center px-4">
          {/* Spotlight */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at 60% 40%, rgba(255,69,0,0.08) 0%, transparent 60%)"
            }}
          />

          {/* Scanlines */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)",
              backgroundSize: "100% 3px"
            }}
          />

          {/* Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)"
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="text-spark font-body text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-4">
              ZONE ALPHA · ZONE BETA · ZONE GAMMA
            </span>
            <h1 className="font-display text-[clamp(40px,8vw,96px)] font-black uppercase text-text-primary leading-none mb-4">
              THE ARENA
            </h1>
            <p className="max-w-xl text-ash text-base md:text-lg font-light leading-relaxed mb-8">
              Step inside. Your bot enters. Only one leaves.
            </p>
          </div>

          {/* Animated Chevron Down */}
          <div className="absolute bottom-6 flex items-center justify-center animate-bounce text-fire pointer-events-none select-none">
            <IconChevronDown size={32} />
          </div>
        </section>

        {/* SECTION 1 — ARENA ZONES */}
        <section className="bg-[#0D0D0D] py-24 px-4 border-b border-plate">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-fire font-display text-xl uppercase tracking-widest block mb-2">// Combat Zones</span>
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-text-primary">Spec Modules</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  zone: "ZONE A",
                  name: "COMBAT ARENA",
                  desc: "Full enclosure. Polycarbonate walls. 3m x 3m battle floor. Max bot weight: 60kg.",
                  status: "AVAILABLE",
                  photo: images.arena.zoneA,
                  specs: [
                    { k: "Max Weight", v: "60kg" },
                    { k: "Floor", v: "Steel Plate" },
                    { k: "Enclosure", v: "15mm Polycarbonate" },
                    { k: "Lighting", v: "Arena flood" }
                  ],
                  icon: <IconSwords size={40} className="text-fire" />
                },
                {
                  zone: "ZONE B",
                  name: "SUMO RING",
                  desc: "Circular fight platform. Wood composites. High-friction mat surface. Weight classes: 3kg and 10kg.",
                  status: "AVAILABLE",
                  photo: images.arena.zoneB,
                  specs: [
                    { k: "Classes", v: "3kg & 10kg" },
                    { k: "Platform", v: "Circular 1.2m dia" },
                    { k: "Surface", v: "High-friction mat" },
                    { k: "Tolerances", v: "Wood composites" },
                    { k: "Sensors", v: "IR border edges" }
                  ],
                  icon: <IconRobot size={40} className="text-fire" />
                },
                {
                  zone: "ZONE C",
                  name: "AUTONOMOUS TRACK",
                  desc: "Micromouse maze modules, high-contrast line follower loops, and white-vinyl tracks.",
                  status: "AVAILABLE",
                  photo: images.arena.zoneC,
                  specs: [
                    { k: "Formats", v: "Line/Maze/Micromouse" },
                    { k: "Track Length", v: "8m loop" },
                    { k: "Surface", v: "White vinyl" },
                    { k: "Width", v: "15cm trace paths" },
                    { k: "Isolation", v: "RF Shielded grid" }
                  ],
                  icon: <IconCertificate size={40} className="text-fire" />
                }
              ].map((card, idx) => (
                <article 
                  key={idx}
                  className="bg-[#111111] border border-plate hover:border-fire transition-colors duration-300 flex flex-col justify-between group rounded-none overflow-hidden"
                >
                  <div>
                    <ArenaImage
                      src={card.photo}
                      alt={card.name}
                      className="w-full h-[200px]"
                      overlay={true}
                    />

                    <div className="p-8 pb-0">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <span className="text-spark font-display text-sm tracking-wider uppercase block">{card.zone}</span>
                          <h3 className="font-display text-3xl uppercase tracking-wider text-text-primary group-hover:text-fire transition-colors">{card.name}</h3>
                        </div>
                        <span className="bg-green-500/10 border border-green-500/30 text-green-500 font-body text-[10px] px-2.5 py-1 uppercase tracking-widest font-bold">
                          {card.status}
                        </span>
                      </div>

                      <p className="text-ash text-sm leading-relaxed mb-6">
                        {card.desc}
                      </p>

                      <ul className="space-y-3 mb-8 border-t border-plate pt-6 text-xs">
                        {card.specs.map((spec) => (
                          <li key={spec.k} className="flex justify-between text-ash">
                            <span>{spec.k}:</span>
                            <strong className="text-text-primary font-medium">{spec.v}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-8 pb-8">
                    <button 
                      onClick={scrollFormToView}
                      className="w-full py-4 border border-plate group-hover:border-fire text-text-primary font-display text-lg uppercase tracking-wider transition-colors inline-flex justify-center items-center gap-2 rounded-none"
                    >
                      ENQUIRE TO BOOK →
                    </button>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 2 — HOW TO BOOK */}
        <section className="bg-forge py-24 px-4 border-b border-plate">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-20">
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-text-primary">
                FROM ENQUIRY TO BATTLE IN 3 STEPS
              </h2>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center max-w-sm flex-1">
                <div className="p-5 bg-plate border border-plate text-fire mb-6">
                  <IconClipboardText size={32} />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wider text-text-primary mb-2">Step 1 — Submit Enquiry</h3>
                <p className="text-ash text-sm leading-relaxed">
                  Fill our booking form with your team details, weight class, and preferred date.
                </p>
              </div>

              {/* Connector */}
              <div className="hidden md:flex text-fire text-4xl pt-8 leading-none select-none">
                →
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center max-w-sm flex-1">
                <div className="p-5 bg-plate border border-plate text-fire mb-6">
                  <IconMail size={32} />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wider text-text-primary mb-2">Step 2 — Get Confirmed</h3>
                <p className="text-ash text-sm leading-relaxed">
                  We review and confirm within 48 hours with slot details and payment info.
                </p>
              </div>

              {/* Connector */}
              <div className="hidden md:flex text-fire text-4xl pt-8 leading-none select-none">
                →
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center max-w-sm flex-1">
                <div className="p-5 bg-plate border border-plate text-fire mb-6">
                  <IconFlame size={32} />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wider text-text-primary mb-2">Step 3 — Enter The Arena</h3>
                <p className="text-ash text-sm leading-relaxed">
                  Show up. Set up. Fight.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 3 — RULES & SAFETY */}
        <section 
          className="bg-steel py-24 px-4 relative overflow-hidden"
          style={{
            clipPath: "polygon(0 2%, 100% 0, 100% 98%, 0 100%)"
          }}
        >
          <div className="max-w-4xl mx-auto py-6">
            <div className="text-center mb-12">
              <span className="text-fire font-display text-xl uppercase tracking-widest block mb-2">// Directives</span>
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-text-primary">ARENA RULES</h2>
            </div>

            <div className="border-t border-plate mt-8">
              {rulesData.map((rule, idx) => (
                <div key={idx} className="border-b border-[#1A1A1A] py-4">
                  <button
                    type="button"
                    onClick={() => setOpenRuleIndex(openRuleIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-display text-2xl text-text-primary hover:text-fire transition-colors py-2 outline-none uppercase"
                  >
                    <span>{rule.title}</span>
                    <span className="text-fire font-bold text-xl">
                      {openRuleIndex === idx ? "−" : "+"}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {openRuleIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="font-body text-ash text-sm leading-relaxed mt-2 pb-2">
                          {rule.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 4 — BOOKING ENQUIRY FORM */}
        <section ref={formSectionRef} className="bg-[#0D0D0D] py-24 px-4 relative">
          <div className="max-w-4xl mx-auto">
            
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-12">
                    <span className="text-spark font-display text-xl uppercase tracking-widest block mb-2">// Slot Booking</span>
                    <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-fire">
                      BOOK YOUR BATTLE SLOT
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 bg-steel border border-plate p-8 md:p-12 rounded-none">
                    
                    {/* Form splits 1 col mobile, 2 col md breakpoint */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="arena-fullName" className="text-xs uppercase text-ash">Full Name</label>
                        <input 
                          id="arena-fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Priya Sharma"
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.fullName ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.fullName && <span className="text-red-500 text-xs font-semibold uppercase">{errors.fullName}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="arena-email" className="text-xs uppercase text-ash">Email Address</label>
                        <input 
                          id="arena-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="email@example.com"
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.email ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.email && <span className="text-red-500 text-xs font-semibold uppercase">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="arena-phone" className="text-xs uppercase text-ash">Phone Number</label>
                        <input 
                          id="arena-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit number"
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.phone ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.phone && <span className="text-red-500 text-xs font-semibold uppercase">{errors.phone}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="arena-teamName" className="text-xs uppercase text-ash">Team / Institution Name</label>
                        <input 
                          id="arena-teamName"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          placeholder="e.g. Team Falcon IIT Delhi"
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.teamName ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.teamName && <span className="text-red-500 text-xs font-semibold uppercase">{errors.teamName}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="arena-weightClass" className="text-xs uppercase text-ash">Bot Weight Class</label>
                        <select 
                          id="arena-weightClass"
                          name="weightClass"
                          value={formData.weightClass}
                          onChange={handleChange}
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.weightClass ? "border-red-500" : "border-plate"
                          }`}
                        >
                          <option value="">Select Weight Class</option>
                          <option value="1kg">1kg (Antweight)</option>
                          <option value="3kg">3kg (Beetleweight)</option>
                          <option value="10kg">10kg (Sumo/Autonomous)</option>
                          <option value="30kg">30kg (Featherweight)</option>
                          <option value="60kg">60kg (Lightweight)</option>
                        </select>
                        {errors.weightClass && <span className="text-red-500 text-xs font-semibold uppercase">{errors.weightClass}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="arena-preferredDate" className="text-xs uppercase text-ash">Preferred Date</label>
                        <input 
                          id="arena-preferredDate"
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.preferredDate ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.preferredDate && <span className="text-red-500 text-xs font-semibold uppercase">{errors.preferredDate}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="arena-botDesc" className="text-xs uppercase text-ash">Bot Specifications & Description</label>
                      <textarea 
                        id="arena-botDesc"
                        name="botDesc"
                        value={formData.botDesc}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Detail weapon types, torque ratings, chassis dimensions, or active telemetry locks..."
                        className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                          errors.botDesc ? "border-red-500" : "border-plate"
                        }`}
                      />
                      {errors.botDesc && <span className="text-red-500 text-xs font-semibold uppercase">{errors.botDesc}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="arena-referral" className="text-xs uppercase text-ash">How did you hear about us?</label>
                      <select 
                        id="arena-referral"
                        name="referral"
                        value={formData.referral}
                        onChange={handleChange}
                        className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                          errors.referral ? "border-red-500" : "border-plate"
                        }`}
                      >
                        <option value="">Select Option</option>
                        <option value="social">Social Media Platforms</option>
                        <option value="college">College Tech Festival Bulletin</option>
                        <option value="search">Search Engine Recommendations</option>
                        <option value="friend">Peer Recommendations / Word of Mouth</option>
                      </select>
                      {errors.referral && <span className="text-red-500 text-xs font-semibold uppercase">{errors.referral}</span>}
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-5 bg-fire hover:bg-[#cc3700] text-forge font-display text-2xl uppercase tracking-wider transition-colors rounded-none"
                    >
                      Submit Booking Request
                    </button>

                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-steel border border-green-500/30 p-12 text-center flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto rounded-none shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500">
                    <IconCheck size={36} />
                  </div>
                  
                  <h3 className="font-display text-4xl md:text-5xl font-black text-text-primary uppercase leading-none">
                    BATTLE REQUEST RECEIVED
                  </h3>
                  
                  <p className="font-body text-ash text-base max-w-md">
                    We'll contact you within 48 hours. Prepare your bot.
                  </p>

                  <button 
                    onClick={handleResetForm}
                    className="text-fire font-semibold hover:underline uppercase text-sm tracking-wider"
                  >
                    SUBMIT ANOTHER
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
