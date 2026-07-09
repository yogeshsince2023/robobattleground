import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconChevronRight, 
  IconTools, 
  IconCpu, 
  IconTrophy, 
  IconCheck, 
  IconExternalLink 
} from "@tabler/icons-react";
import SectionDivider from "../components/SectionDivider.jsx";
import PageWrapper from "../components/PageWrapper.jsx";
import { images } from "../assets/images/index.js";
import ArenaImage from "../components/ArenaImage.jsx";
import { submitInternshipApplication } from "../lib/db.js";

const tracksData = [
  {
    id: "combat_bot",
    title: "Combat Bot Design",
    icon: <IconTools size={40} className="text-fire" />,
    eligibility: "B.Tech/Diploma in Mech or Aero",
    durations: "8 Weeks / 3 Months",
    skills: ["SolidWorks", "FEA Analysis", "AR500 Steel Weldment", "Pneumatics", "Kinematics"]
  },
  {
    id: "embedded_control",
    title: "Embedded Systems & Control",
    icon: <IconCpu size={40} className="text-fire" />,
    eligibility: "B.Tech/Diploma in ECE or CSE",
    durations: "4 Weeks / 8 Weeks",
    skills: ["ESP32 Firmware", "Brushless ESC Programming", "RF Telemetry", "Sensor Feedback", "C++"]
  },
  {
    id: "arena_ops",
    title: "Arena Operations & Event Management",
    icon: <IconTrophy size={40} className="text-fire" />,
    eligibility: "Any Degree with robotics interest",
    durations: "8 Weeks / 3 Months",
    skills: ["Pneumatic Launch Rigging", "Saw Hazard Control", "Match Logging", "Stream Production", "Safety Auditing"]
  }
];

const testimonialsData = [
  {
    quote: "I tuned the telemetry feedback loop for a 45kg pneumatic flipper using ESP32. Writing real-time interrupt handlers for ESC speed controllers under 3ms latency limitations changed how I look at firmware.",
    name: "Arjun Sharma",
    role: "B.Tech ECE, NIT Jaipur",
    track: "Embedded Systems"
  },
  {
    quote: "I worked on structural load analysis for the active vertical spinner chassis. We ran FEA profiles to simulate carbon-plate stress boundaries under a 120km/h shock impact parameter. Absolutely incredible.",
    name: "Priya Meena",
    role: "B.Tech Mech, VIT Vellore",
    track: "Combat Bot Design"
  },
  {
    quote: "Coordinated the match rigging and automated saw safety logic arrays. Calibrating the optical proximity sensors to shut down hazards on breach was a masterclass in safety design.",
    name: "Karan Joshi",
    role: "B.Tech CSE, DTU Delhi",
    track: "Arena Operations"
  }
];

export default function Internships() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [statement, setStatement] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    branchYear: "",
    duration: "",
    track: "",
    portfolioUrl: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleApplyClick = (trackName = "") => {
    if (trackName) {
      setFormData((prev) => ({ ...prev, track: trackName }));
    }
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTextareaChange = (e) => {
    const val = e.target.value;
    if (val.length <= 500) {
      setStatement(val);
      if (errors.statement) {
        setErrors((prev) => ({ ...prev, statement: "" }));
      }
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
    if (!formData.collegeName.trim()) newErrors.collegeName = "College name is required.";
    if (!formData.branchYear.trim()) newErrors.branchYear = "Branch & Year are required.";
    if (!formData.duration) newErrors.duration = "Please select a duration.";
    if (!formData.track) newErrors.track = "Please select a track.";
    if (!statement.trim()) {
      newErrors.statement = "Please enter your statement.";
    } else if (statement.trim().length < 50) {
      newErrors.statement = "Statement must be at least 50 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        const insertData = {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          college: formData.collegeName,
          branch_year: formData.branchYear,
          duration: formData.duration,
          track: formData.track,
          portfolio_url: formData.portfolioUrl,
          motivation: statement
        };
        const { error: submitErr } = await submitInternshipApplication(insertData);
        if (submitErr) throw submitErr;
        setSuccess(true);
      } catch (err) {
        alert("Application transmission failed. Please try again.");
      }
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      collegeName: "",
      branchYear: "",
      duration: "",
      track: "",
      portfolioUrl: ""
    });
    setStatement("");
    setSuccess(false);
  };

  useDocumentMetadata("Robotics Internship Program — TRBG", "Forge real-world mechanical and firmware engineering skills inside the battle bot design pit. Apply to our rolling cohort tracks today.");

  return (
    <PageWrapper>

      <div className="bg-forge text-text-primary min-h-screen font-body overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-4 py-20">
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

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <span className="text-spark font-body text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-4">
              ⚡ CADET FIGHTER CORPS
            </span>
            <h1 className="font-display text-[clamp(32px,7vw,80px)] font-black uppercase text-text-primary leading-none mb-3">
              FORGE YOUR SKILLS
            </h1>
            <h2 className="font-display text-[clamp(32px,6vw,70px)] font-black uppercase text-fire leading-none mb-6">
              IN THE PIT.
            </h2>
            <p className="max-w-xl text-ash text-base md:text-lg font-light leading-relaxed mb-8">
              India's most hands-on robotics internship. Real projects. Real robots. Real credentials.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button 
                onClick={() => handleApplyClick()}
                className="px-10 py-4 bg-fire text-forge font-display text-2xl uppercase tracking-wider hover:bg-[#cc3700] hover:scale-[1.02] active:scale-[0.98] transition-all rounded-none shrink-0"
              >
                Apply Now
              </button>
              <Link 
                to="/verify"
                className="px-10 py-4 bg-transparent border border-fire text-fire font-display text-2xl uppercase tracking-wider hover:bg-fire/10 active:scale-[0.98] transition-all rounded-none shrink-0"
              >
                Verify Existing Cert →
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 1 — PROGRAM OVERVIEW */}
        <section className="bg-[#0D0D0D] py-24 px-4 border-y border-plate">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              
              {/* Left prose column */}
              <div className="space-y-12">
                <div>
                  <span className="text-fire font-display text-xl uppercase tracking-widest block mb-2">// Core Curriculum</span>
                  <h2 className="font-display text-[clamp(28px,5vw,40px)] font-black uppercase">What You'll Build</h2>
                </div>

                <ul className="space-y-4">
                  {[
                    "Work on live combat robots used in national championships",
                    "Interface with ESP32, Arduino, ROS-based systems",
                    "Design, fabricate, and test your own bot subsystem",
                    "Leave with a portfolio piece + verified certificate"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-ash">
                      <span className="text-fire mt-1"><IconChevronRight size={18} /></span>
                      <span className="text-base font-light">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Stacked Tracks Options */}
                <div className="space-y-4">
                  {[
                    { duration: "4 WEEKS", desc: "Introductory track focusing on mechanical fabrication basics and telemetry parameters." },
                    { duration: "8 WEEKS", desc: "Detailed cohort covering autonomous algorithms, speed controller loops, and frame dynamics.", popular: true },
                    { duration: "3 MONTHS", desc: "Comprehensive engineering program building custom heavy weaponry and pneumatic systems." }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-[#111111] border border-plate p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative rounded-none hover:border-fire/50 transition-colors"
                    >
                      {item.popular && (
                        <span className="absolute top-0 right-0 bg-spark text-forge font-display text-[10px] tracking-wider px-3 py-1 uppercase font-bold">
                          Most Popular
                        </span>
                      )}
                      <div>
                        <h4 className="font-display text-2xl uppercase tracking-wider text-text-primary mb-1">
                          {item.duration}
                        </h4>
                        <p className="text-xs text-ash/80 max-w-md">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => handleApplyClick(idx === 0 ? "4 Weeks" : idx === 1 ? "8 Weeks" : "3 Months")}
                        className="text-fire font-semibold text-xs tracking-wider uppercase hover:underline whitespace-nowrap"
                      >
                        APPLY FOR THIS TRACK →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — Collage grid & Certificate Preview mockup */}
              <div className="flex flex-col items-center gap-12 lg:pt-16 w-full">
                
                {/* 2-Image Collage Grid */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="border border-plate overflow-hidden h-48 rounded-none">
                    <ArenaImage
                      src={images.internship.interns1}
                      alt="Cadets in the pit"
                      className="w-full h-full transition-transform duration-300 hover:scale-[1.03]"
                      overlay={true}
                    />
                  </div>
                  <div className="border border-plate overflow-hidden h-48 mt-6 rounded-none">
                    <ArenaImage
                      src={images.internship.interns2}
                      alt="Calibrating heavy chassis"
                      className="w-full h-full transition-transform duration-300 hover:scale-[1.03]"
                      overlay={true}
                    />
                  </div>
                </div>

                {/* Certificate Preview mockup */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-[#111111] border-2 border-fire p-8 w-full max-w-md shadow-2xl relative select-none"
                  style={{
                    transform: "rotate(-1deg)"
                  }}
                >
                  {/* Decorative border edges */}
                  <div className="absolute inset-1 border border-plate pointer-events-none" />

                  <div className="text-center relative z-10 space-y-6">
                    
                    <span className="font-display text-[11px] tracking-[0.2em] text-ash block uppercase">
                      CERTIFICATE OF COMPLETION
                    </span>

                    <h3 className="font-display text-2xl uppercase tracking-widest text-text-primary">
                      THE ROBO <span className="text-fire">BG</span>
                    </h3>

                    <div className="border-t border-fire w-16 mx-auto" />

                    <div className="py-4">
                      <span className="text-[12px] text-ash italic block mb-2">Proudly awarded to</span>
                      <strong className="font-display text-4xl uppercase tracking-wide text-text-primary font-black block">
                        [YOUR NAME]
                      </strong>
                      <span className="text-[12px] text-ash italic block mt-4">for successfully completing the track in</span>
                      <strong className="font-display text-2xl uppercase tracking-wider text-fire block mt-1">
                        COMBAT BOT DESIGN
                      </strong>
                    </div>

                    <div className="border-t border-plate pt-4 flex justify-between items-center text-[10px] text-ash/50 font-mono">
                      <span>therobobattleground.in</span>
                      <div className="flex items-center gap-1.5 text-green-500 font-semibold font-body tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        VERIFIABLE ONLINE
                      </div>
                    </div>

                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2 — INTERNSHIP TRACKS */}
        <section className="py-24 px-4 bg-forge border-b border-plate">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-spark font-display text-xl uppercase tracking-widest block mb-2">ACADEMY DIRECTIVES</span>
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-text-primary">Fighter Tracks</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {tracksData.map((track, idx) => (
                <article 
                  key={track.id}
                  className="bg-[#111111] border border-plate p-8 hover:border-fire hover:-translate-y-[6px] hover:bg-fire/[0.03] transition-all duration-300 flex flex-col justify-between group rounded-none"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-plate border border-plate text-fire">{track.icon}</div>
                      <span className="bg-plate border border-plate text-spark font-mono text-[10px] px-2.5 py-1 uppercase tracking-widest font-semibold">
                        {track.eligibility}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl uppercase tracking-wider mb-2 text-text-primary group-hover:text-fire transition-colors">
                      {track.title}
                    </h3>
                    <span className="text-xs text-ash font-mono block mb-4 uppercase">
                      Duration Options: {track.durations}
                    </span>

                    <div className="flex flex-wrap gap-2 mb-8 border-t border-plate pt-6">
                      {track.skills.map((skill) => (
                        <span 
                          key={skill}
                          className="bg-[#1A1A1A] text-ash text-[10px] font-semibold tracking-wide px-2.5 py-1 uppercase rounded-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApplyClick(track.title)}
                    className="w-full py-4 border border-plate group-hover:border-fire text-text-primary font-display text-lg uppercase tracking-wider transition-colors inline-flex justify-center items-center gap-2 rounded-none"
                  >
                    Apply For This Track →
                  </button>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 3 — TESTIMONIALS */}
        <section className="bg-[#0D0D0D] py-24 px-4 border-b border-plate">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="text-fire font-display text-xl uppercase tracking-widest block mb-2">// Alumni Commends</span>
              <h2 className="font-display text-[clamp(28px,5vw,52px)] font-black uppercase text-text-primary">FROM THE PIT</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {testimonialsData.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#111111] border border-plate p-8 flex flex-col justify-between rounded-none hover:border-fire/40 transition-colors"
                >
                  <p className="text-ash text-sm md:text-base leading-relaxed italic mb-8 font-light">
                    "{item.quote}"
                  </p>
                  <div>
                    <h4 className="font-display text-2xl uppercase tracking-wider text-text-primary mb-1">
                      {item.name}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-ash/60">
                      <span>{item.role}</span>
                      <span className="bg-plate px-2 py-0.5 text-spark font-mono text-[9px] uppercase tracking-wider font-semibold border border-plate">
                        {item.track}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 4 — APPLICATION FORM */}
        <section ref={formRef} className="bg-forge py-24 px-4 relative">
          <div className="max-w-4xl mx-auto">
            
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  
                  <div className="text-center mb-12">
                    <h2 className="font-display text-[clamp(28px,5vw,56px)] font-black uppercase text-text-primary">
                      APPLY TO THE PROGRAM
                    </h2>
                  </div>

                  {/* Callout box */}
                  <div className="bg-[#FFB800]/5 border border-[#FFB800]/25 p-6 mb-8 rounded-none">
                    <p className="text-spark font-body text-sm font-semibold tracking-wide uppercase">
                      ⚡ Cohort Priority Alert: Applications reviewed on rolling basis. Limited seats per cohort. Early applications get priority.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="bg-steel border border-plate p-8 md:p-12 space-y-6 rounded-none">
                    
                    {/* Form splits 1 col mobile, 2 col md breakpoint */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="internship-fullName" className="text-xs uppercase text-ash">Full Name</label>
                        <input 
                          id="internship-fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Arjun Sharma"
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.fullName ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.fullName && <span className="text-red-500 text-xs font-semibold uppercase">{errors.fullName}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="internship-email" className="text-xs uppercase text-ash">Email Address</label>
                        <input 
                          id="internship-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="cadet@example.com"
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.email ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.email && <span className="text-red-500 text-xs font-semibold uppercase">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="internship-phone" className="text-xs uppercase text-ash">Phone Number</label>
                        <input 
                          id="internship-phone"
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
                        <label htmlFor="internship-collegeName" className="text-xs uppercase text-ash">College / University</label>
                        <input 
                          id="internship-collegeName"
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          placeholder="e.g. NIT Jaipur"
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.collegeName ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.collegeName && <span className="text-red-500 text-xs font-semibold uppercase">{errors.collegeName}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="internship-branchYear" className="text-xs uppercase text-ash">Branch & Year</label>
                        <input 
                          id="internship-branchYear"
                          name="branchYear"
                          value={formData.branchYear}
                          onChange={handleChange}
                          placeholder="e.g. Mech 3rd Year"
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.branchYear ? "border-red-500" : "border-plate"
                          }`}
                        />
                        {errors.branchYear && <span className="text-red-500 text-xs font-semibold uppercase">{errors.branchYear}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="internship-duration" className="text-xs uppercase text-ash">Duration</label>
                        <select
                          id="internship-duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.duration ? "border-red-500" : "border-plate"
                          }`}
                        >
                          <option value="">Select Duration</option>
                          <option value="4 Weeks">4 Weeks</option>
                          <option value="8 Weeks">8 Weeks</option>
                          <option value="3 Months">3 Months</option>
                        </select>
                        {errors.duration && <span className="text-red-500 text-xs font-semibold uppercase">{errors.duration}</span>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="internship-track" className="text-xs uppercase text-ash">Preferred Track</label>
                        <select
                          id="internship-track"
                          name="track"
                          value={formData.track}
                          onChange={handleChange}
                          className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                            errors.track ? "border-red-500" : "border-plate"
                          }`}
                        >
                          <option value="">Select Track</option>
                          <option value="Combat Bot Design">Combat Bot Design</option>
                          <option value="Embedded Systems & Control">Embedded Systems & Control</option>
                          <option value="Arena Operations">Arena Operations & Event Management</option>
                        </select>
                        {errors.track && <span className="text-red-500 text-xs font-semibold uppercase">{errors.track}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="internship-portfolioUrl" className="text-xs uppercase text-ash">GitHub / Portfolio URL (Optional)</label>
                      <input 
                        id="internship-portfolioUrl"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/..."
                        className="rounded-none bg-[#080808] border border-plate p-4 text-text-primary outline-none focus:border-fire"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs uppercase text-ash">
                        <label htmlFor="internship-statement">Why do you want to join TRBG?</label>
                        <span className="font-mono text-spark">{statement.length} / 500</span>
                      </div>
                      <textarea 
                        id="internship-statement"
                        name="statement"
                        value={statement}
                        onChange={handleTextareaChange}
                        rows={5}
                        placeholder="Explain your interest, previous projects, or technical goals..."
                        className={`rounded-none bg-[#080808] border p-4 text-text-primary outline-none focus:border-fire ${
                          errors.statement ? "border-red-500" : "border-plate"
                        }`}
                      />
                      {errors.statement && <span className="text-red-500 text-xs font-semibold uppercase">{errors.statement}</span>}
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-5 bg-fire hover:bg-[#cc3700] text-forge font-display text-2xl uppercase tracking-wider transition-colors rounded-none"
                    >
                      Submit Application Spec
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
                  APPLICATION SUBMITTED
                </h3>
                
                <p className="font-body text-ash text-base max-w-md">
                  WE'LL REVIEW AND RESPOND WITHIN 5 WORKING DAYS.
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
