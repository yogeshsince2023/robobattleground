import React, { useState } from "react";
import SectionDivider from "../components/SectionDivider.jsx";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";

const timelineData = [
  { year: "2022", text: "Founded in Jaipur, Rajasthan. A small team with big bots and bigger ambitions." },
  { year: "2023", text: "Built first permanent combat arena. First internal championship held." },
  { year: "2024", text: "Launched internship program. 50+ students trained in first cohort." },
  { year: "2024", text: "Competed at Technoxian World Robotics Championship." },
  { year: "2025", text: "Certificate verification platform launched. Expanded to 3 arena zones." }
];



export default function About() {
  useDocumentMetadata({
    title: "About Us — The Robo Battle Ground",
    description: "Born from competition. The Robo Battle Ground is Jaipur's combat robotics arena built by engineers, for engineers.",
  });

  return (
    <PageWrapper>

      <div className="bg-forge text-text-primary min-h-screen font-body overflow-x-hidden">
        
        {/* Hero */}
        <section className="relative py-24 px-4 text-center border-b border-plate bg-[radial-gradient(circle_at_center,rgba(255,69,0,0.05)_0%,transparent_60%)]">
          <div className="max-w-4xl mx-auto pt-12">
            <h1 className="font-display text-[clamp(32px,7vw,80px)] font-black uppercase text-text-primary mb-3">
              WHO WE ARE
            </h1>
            <p className="text-xl text-ash uppercase font-display tracking-widest">
              Born from competition. Built for builders.
            </p>
          </div>
        </section>

        {/* SECTION 1 — STORY */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left: Timeline */}
            <div className="relative">
              <span className="text-fire font-display text-xl uppercase tracking-widest block mb-8">// Our History</span>
              <div className="absolute left-4 top-16 bottom-0 w-[1px] bg-fire" />
              <div className="space-y-10 pl-12 relative">
                {timelineData.map((item, idx) => (
                  <div key={idx} className="relative">
                    {/* Dot marker */}
                    <span className="absolute -left-[38px] top-1.5 w-3 h-3 rounded-full bg-fire border-2 border-forge" />
                    <span className="font-display text-2xl text-fire uppercase block mb-1">
                      {item.year}
                    </span>
                    <p className="text-ash text-sm leading-relaxed max-w-md font-light">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Mission */}
            <div className="space-y-6 lg:pt-16">
              <h2 className="font-display text-4xl uppercase font-black tracking-wide text-text-primary">
                OUR MISSION
              </h2>
              <p className="text-ash text-base md:text-lg leading-relaxed font-light">
                We are dedicated to building genuine, heavy-duty combat robotics infrastructure for engineering students and builders across India.
              </p>
              <p className="text-ash text-base md:text-lg leading-relaxed font-light">
                Our focus is away from generic theoretical workshops. We provide active Polycarbonate fight enclosures, mechanical diagnostic tools, and custom speed controller firmware loops that solve real physical challenges.
              </p>
            </div>

          </div>
        </section>



        {/* SECTION 3 — VISION STATEMENT */}
        <section className="bg-forge py-28 px-6 text-center border-t border-plate">
          <div className="max-w-4xl mx-auto">
            <blockquote className="font-display text-[clamp(32px,5vw,64px)] uppercase tracking-tight leading-none text-text-primary mb-6">
              "WE BELIEVE EVERY ENGINEER DESERVES A PLACE TO BUILD, TEST, AND BATTLE."
            </blockquote>
            <cite className="font-body text-base text-fire uppercase tracking-widest not-italic font-semibold">
              — The Robo Battle Ground
            </cite>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
