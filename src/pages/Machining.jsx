import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  IconTool,
  IconPrinter,
  IconCut,
  IconCpu,
  IconFlame,
  IconRuler,
  IconUpload,
  IconReceipt,
  IconTrophy,
  IconInfoCircle,
  IconCheck,
  IconChevronRight
} from "@tabler/icons-react";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";
import { submitMachiningEnquiry } from "../lib/db.js";

/* ───────── static data ───────── */

const services = [
  {
    icon: IconTool, name: "CNC MACHINING",
    desc: "Precision CNC milling and turning for aluminum, steel, and polycarbonate bot components. Tolerances up to ±0.05mm.",
    pills: ["Aluminum", "Steel", "Polycarbonate", "±0.05mm"]
  },
  {
    icon: IconPrinter, name: "3D PRINTING",
    desc: "FDM and resin printing for rapid prototyping, mounts, brackets, and non-structural components. PLA, PETG, ABS, and TPU available.",
    pills: ["PLA", "PETG", "ABS", "TPU", "Resin"]
  },
  {
    icon: IconCut, name: "LASER CUTTING",
    desc: "CO2 laser cutting for sheet metal, acrylic, and wood. Ideal for chassis plates, armor panels, and decorative elements.",
    pills: ["Sheet Metal", "Acrylic", "Wood", "Up to 10mm"]
  },
  {
    icon: IconCpu, name: "PCB MANUFACTURING",
    desc: "Custom PCB fabrication for bot electronics — motor driver boards, sensor mounts, and custom control PCBs.",
    pills: ["Single Layer", "Double Layer", "SMD", "THT"]
  },
  {
    icon: IconFlame, name: "WELDING & FABRICATION",
    desc: "MIG and TIG welding for steel and aluminum frames. Full chassis fabrication from your CAD files or sketches.",
    pills: ["MIG", "TIG", "Aluminum", "Steel"]
  },
  {
    icon: IconRuler, name: "DESIGN CONSULTATION",
    desc: "Not sure how to design your bot? Our engineers review your concept and suggest improvements for strength, weight, and fight performance.",
    pills: ["CAD Review", "FEA Analysis", "Weight Class"]
  }
];

const processSteps = [
  { icon: IconUpload, num: "01", title: "SUBMIT YOUR FILES", desc: "Share your CAD files (STEP, STL, DXF) or describe your requirements in the enquiry form." },
  { icon: IconReceipt, num: "02", title: "GET A QUOTE", desc: "We review your design and send a detailed quote with timeline and material costs within 24 hours." },
  { icon: IconTool, num: "03", title: "WE FABRICATE", desc: "Our machinist handles production. You get progress updates at each stage." },
  { icon: IconTrophy, num: "04", title: "PICK UP & FIGHT", desc: "Collect your components at the arena. Test fit in our build pit. Enter the arena." }
];

const materialsData = [
  ["Aluminum 6061", "CNC / Welding", "500×500mm", "Chassis, arms", "2–3 days"],
  ["Steel Mild", "CNC / Welding / Laser", "400×400mm", "Weapons, frames", "2–4 days"],
  ["Polycarbonate", "CNC / Laser", "600×600mm", "Armor panels", "1–2 days"],
  ["PETG", "3D Print", "250×250×250mm", "Brackets, mounts", "1 day"],
  ["Acrylic", "Laser", "600×600mm", "Decorative panels", "1 day"],
  ["FR4", "PCB Fab", "200×200mm", "Custom boards", "3–5 days"]
];

const serviceOptions = ["CNC Machining", "3D Printing", "Laser Cutting", "PCB Manufacturing", "Welding", "Design Consultation"];
const materialOptions = ["Aluminum 6061", "Mild Steel", "Polycarbonate", "PETG", "ABS", "PLA", "TPU", "Acrylic", "FR4", "Other"];
const weightOptions = ["Under 1kg", "1kg", "3kg", "10kg", "30kg", "60kg", "Other"];
const urgencyOptions = ["No Rush", "Within 1 Week", "Within 3 Days", "Urgent"];

/* ───────── component ───────── */

export default function Machining() {
  useDocumentMetadata(
    "Machining & Fabrication — The Robo Battle Ground",
    "CNC machining, 3D printing, laser cutting, PCB manufacturing and welding services for combat robot builders in Jaipur."
  );

  const formRef = useRef(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ── form state ── */
  const [formData, setFormData] = useState({
    full_name: "", email: "", phone: "", team_name: "",
    services: [], material: "", weight_class: "",
    description: "", urgency: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const toggleService = (svc) => {
    setFormData((p) => {
      const has = p.services.includes(svc);
      return { ...p, services: has ? p.services.filter((s) => s !== svc) : [...p.services, svc] };
    });
    if (errors.services) setErrors((p) => ({ ...p, services: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = "Full name is required.";
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email format.";
    if (!formData.phone.trim()) errs.phone = "Phone number is required.";
    if (formData.services.length === 0) errs.services = "Select at least one service.";
    if (!formData.description.trim()) errs.description = "Project description is required.";

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    try {
      const { error } = await submitMachiningEnquiry(formData);
      if (error) throw error;
      setSubmittedEmail(formData.email);
      setSuccess(true);
    } catch {
      alert("Submission failed. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({ full_name: "", email: "", phone: "", team_name: "", services: [], material: "", weight_class: "", description: "", urgency: "" });
    setErrors({});
    setSuccess(false);
  };

  /* ── helpers ── */
  const inputCls = (field) =>
    `w-full bg-[#080808] border ${errors[field] ? "border-red-500" : "border-[#1A1A1A]"} focus:border-fire outline-none p-3 text-[#F5F5F5] font-body text-sm rounded-none`;

  return (
    <PageWrapper>
      <div className="bg-[#080808] text-[#F5F5F5] min-h-screen overflow-hidden font-body">

        {/* ═══════ HERO ═══════ */}
        <section className="relative min-h-[85vh] w-full bg-[#080808] overflow-hidden flex items-center justify-center">
          {/* radial spotlight */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 60% 40%, rgba(255,69,0,0.08) 0%, transparent 60%)" }} />
          {/* scanlines */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)", backgroundSize: "100% 3px" }} />
          {/* vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)" }} />

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.1 }}
            className="max-w-4xl mx-auto text-center z-10 px-4 flex flex-col items-center"
          >
            <motion.span
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.5 }}
              className="text-spark font-body text-[12px] font-semibold uppercase tracking-[0.2em] mb-6"
            >
              FABRICATION SERVICES
            </motion.span>

            <h1 className="font-display uppercase font-black leading-none mb-6">
              <motion.span initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="block text-[#F5F5F5] text-[clamp(40px,8vw,96px)]">
                BUILD YOUR
              </motion.span>
              <motion.span initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="block text-fire text-[clamp(40px,8vw,96px)]">
                BATTLE BOT.
              </motion.span>
            </h1>

            <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="text-ash text-[18px] max-w-xl mx-auto leading-relaxed mb-10">
              Professional machining and fabrication services for combat robot builders. Bring your designs. We'll make them real.
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
              onClick={scrollToForm}
              className="bg-fire hover:bg-[#cc3700] text-[#080808] font-display text-[18px] tracking-[0.1em] px-8 py-4 uppercase transition-all duration-200 rounded-none select-none"
            >
              REQUEST A QUOTE →
            </motion.button>
          </motion.div>
        </section>

        {/* ═══════ SERVICES GRID ═══════ */}
        <section className="relative bg-[#0D0D0D] py-24 px-4" style={{ clipPath: "polygon(0 4%, 100% 0%, 100% 96%, 0 100%)" }}>
          <div className="max-w-6xl mx-auto">
            <span className="text-spark font-body text-[12px] font-semibold uppercase tracking-[0.2em] block text-center mb-3">WHAT WE OFFER</span>
            <h2 className="font-display text-[56px] text-[#F5F5F5] text-center uppercase tracking-wider mb-16 leading-none">Machining Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.name}
                    className="bg-[#111111] border border-[#1A1A1A] p-6 transition-all duration-300 hover:border-fire hover:-translate-y-1 hover:bg-[rgba(255,69,0,0.03)] group"
                  >
                    <div className="w-20 h-20 flex items-center justify-center bg-[rgba(255,69,0,0.08)] border border-[rgba(255,69,0,0.15)] mb-4">
                      <Icon size={36} className="text-fire" />
                    </div>
                    <h3 className="font-display text-[24px] text-[#F5F5F5] uppercase tracking-wide mt-4">{svc.name}</h3>
                    <p className="text-ash text-[14px] leading-[1.7] mt-2">{svc.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {svc.pills.map((p) => (
                        <span key={p} className="bg-[#1A1A1A] text-[#555] px-2 py-1 text-[11px] font-body rounded-sm">{p}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ PROCESS SECTION ═══════ */}
        <section className="bg-[#080808] py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-[52px] text-[#F5F5F5] text-center uppercase tracking-wider mb-16 leading-none">FROM DESIGN TO BATTLE</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
              {processSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="relative flex flex-col items-center text-center px-4 py-8 md:py-0">
                    {/* decorative step number */}
                    <span className="font-display text-[80px] leading-none text-[rgba(255,69,0,0.08)] absolute top-0 select-none pointer-events-none">{step.num}</span>

                    <div className="relative z-10 mt-12">
                      <div className="w-16 h-16 flex items-center justify-center bg-[rgba(255,69,0,0.08)] border border-[rgba(255,69,0,0.15)] mx-auto mb-4">
                        <Icon size={28} className="text-fire" />
                      </div>
                      <h3 className="font-display text-[20px] text-[#F5F5F5] uppercase tracking-wide mb-2">{step.title}</h3>
                      <p className="text-ash text-[14px] leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
                    </div>

                    {/* arrow connector — hidden on mobile, shown between steps */}
                    {i < processSteps.length - 1 && (
                      <>
                        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20">
                          <IconChevronRight size={24} className="text-fire" />
                        </div>
                        <div className="md:hidden w-[2px] h-8 bg-fire/30 mx-auto mt-4" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════ MATERIALS TABLE ═══════ */}
        <section className="bg-[#111111] py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-[40px] text-[#F5F5F5] text-center uppercase tracking-wider mb-10 leading-none">MATERIALS WE WORK WITH</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-[#1A1A1A] border-b border-fire">
                    {["Material", "Process", "Max Size", "Best For", "Est. Lead Time"].map((h) => (
                      <th key={h} className="py-3 px-4 font-display text-[14px] text-ash uppercase tracking-[0.1em] font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {materialsData.map((row, i) => (
                    <tr key={i} className={`border-b border-[#1A1A1A] ${i % 2 === 1 ? "bg-[rgba(255,255,255,0.01)]" : "bg-[#111111]"}`}>
                      {row.map((cell, j) => (
                        <td key={j} className={`py-3 px-4 font-body text-[14px] ${j === 0 ? "text-[#F5F5F5] font-semibold" : "text-ash"}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══════ ENQUIRY FORM ═══════ */}
        <section ref={formRef} id="enquiry-form" className="bg-[#0D0D0D] py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-[52px] text-fire text-center uppercase tracking-wider mb-12 leading-none">REQUEST A QUOTE</h2>

            {success ? (
              <div className="text-center py-16 space-y-4">
                <span className="font-display text-[48px] text-[#F5F5F5] block">⚙ QUOTE REQUEST RECEIVED</span>
                <p className="text-ash text-[16px]">We'll send your quote within 24 hours to <span className="text-fire">{submittedEmail}</span></p>
                <button onClick={resetForm} className="text-fire hover:underline font-body text-sm uppercase tracking-wider mt-4">Submit Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name *" className={inputCls("full_name")} />
                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email *" className={inputCls("email")} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  {/* Phone */}
                  <div>
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Phone *" className={inputCls("phone")} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  {/* Team */}
                  <div>
                    <input name="team_name" value={formData.team_name} onChange={handleChange} placeholder="Team / Institution Name" className={inputCls("team_name")} />
                  </div>
                </div>

                {/* Services toggle pills */}
                <div>
                  <label className="text-xs uppercase text-ash tracking-widest font-semibold block mb-2">Services Required *</label>
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions.map((svc) => {
                      const selected = formData.services.includes(svc);
                      return (
                        <button
                          key={svc} type="button" onClick={() => toggleService(svc)}
                          className={`px-4 py-2 text-sm font-body uppercase tracking-wider transition-all duration-200 border select-none ${
                            selected
                              ? "bg-fire text-[#080808] border-fire font-semibold"
                              : "bg-[#111111] text-ash border-[#1A1A1A] hover:border-ash"
                          }`}
                        >
                          {selected && <IconCheck size={14} className="inline mr-1 -mt-0.5" />}{svc}
                        </button>
                      );
                    })}
                  </div>
                  {errors.services && <p className="text-red-500 text-xs mt-1">{errors.services}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Material */}
                  <select name="material" value={formData.material} onChange={handleChange} className={inputCls("material") + " appearance-none"}>
                    <option value="">Select Material</option>
                    {materialOptions.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {/* Weight class */}
                  <select name="weight_class" value={formData.weight_class} onChange={handleChange} className={inputCls("weight_class") + " appearance-none"}>
                    <option value="">Select Weight Class</option>
                    {weightOptions.map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>

                {/* File attachment info */}
                <div className="flex items-start gap-3 bg-[#111111] border border-[#1A1A1A] p-4">
                  <IconInfoCircle size={20} className="text-spark shrink-0 mt-0.5" />
                  <p className="text-ash text-sm leading-relaxed">
                    Email your CAD files to <a href="mailto:therobobattleground@gmail.com" className="text-fire hover:underline">therobobattleground@gmail.com</a> after submitting this form.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Project Description *" className={inputCls("description") + " resize-none"} />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Urgency */}
                <select name="urgency" value={formData.urgency} onChange={handleChange} className={inputCls("urgency") + " appearance-none"}>
                  <option value="">Deadline / Urgency</option>
                  {urgencyOptions.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>

                <button type="submit" className="w-full bg-fire hover:bg-[#cc3700] text-[#080808] font-display text-[24px] tracking-[0.1em] py-5 uppercase transition-all duration-200 rounded-none select-none">
                  SUBMIT ENQUIRY
                </button>
              </form>
            )}
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
