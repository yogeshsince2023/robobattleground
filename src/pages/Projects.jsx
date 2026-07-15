import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconHammer, IconRobot, IconCpu, IconSettings, IconCode, IconCut } from "@tabler/icons-react";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";
import { getProjects } from "../lib/db.js";

const categories = ["All", "Combat Bots", "Autonomous", "PCB & Electronics", "Chassis & Fabrication", "Software & Control"];

// ponytail: map category to a fallback icon when no cover image exists
const categoryIcons = {
  "Combat Bots": IconRobot,
  "Autonomous": IconSettings,
  "PCB & Electronics": IconCpu,
  "Chassis & Fabrication": IconCut,
  "Software & Control": IconCode,
};

export default function Projects() {
  useDocumentMetadata(
    "Projects — The Robo Battle Ground",
    "Robots built at TRBG. Student and team projects from India's combat robotics arena."
  );

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    (async () => {
      const { data } = await getProjects();
      setProjects(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <PageWrapper>
      <div className="bg-[#080808] text-[#F5F5F5] min-h-screen font-body">

        {/* ═══ HERO ═══ */}
        <section className="relative py-32 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 50% 40%, rgba(255,69,0,0.06) 0%, transparent 60%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)", backgroundSize: "100% 3px" }} />
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="text-spark font-body text-[12px] font-semibold uppercase tracking-[0.2em] block mb-4">BUILT IN THE PIT</span>
            <h1 className="font-display text-[clamp(48px,10vw,96px)] text-[#F5F5F5] uppercase leading-none mb-4">PROJECTS</h1>
            <p className="text-ash text-[18px] max-w-xl mx-auto">Real robots. Real battles. Real builders.</p>
          </div>
        </section>

        {/* ═══ FILTER BAR ═══ */}
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-[13px] uppercase tracking-wider border transition-all duration-200 rounded-sm select-none ${
                  filter === cat
                    ? "bg-fire text-[#080808] border-fire font-display font-semibold"
                    : "bg-[#111111] text-ash border-[#1A1A1A] font-body hover:border-ash"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ PROJECTS GRID ═══ */}
        <div className="max-w-6xl mx-auto px-4 pb-24">
          {loading ? (
            /* Skeleton loader */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#111111] border border-[#1A1A1A] animate-pulse">
                  <div className="h-[200px] bg-[#1A1A1A]" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-[#1A1A1A] w-3/4 rounded" />
                    <div className="h-3 bg-[#1A1A1A] w-1/2 rounded" />
                    <div className="h-3 bg-[#1A1A1A] w-full rounded" />
                    <div className="h-3 bg-[#1A1A1A] w-5/6 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 && projects.length === 0 ? (
            /* Empty state — no projects at all */
            <div className="text-center py-24 select-none">
              <IconHammer size={80} className="mx-auto text-[#1A1A1A] mb-6" />
              <h2 className="font-display text-[36px] text-[#7A7A7A] uppercase tracking-wider mb-3">PROJECTS LOADING INTO THE PIT</h2>
              <p className="text-[#6A6A6A] text-[16px] max-w-md mx-auto">Our builders are working on something legendary. Check back soon.</p>
            </div>
          ) : filtered.length === 0 ? (
            /* No results for this filter */
            <div className="text-center py-16 select-none">
              <p className="text-ash text-sm">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((project) => {
                const FallbackIcon = categoryIcons[project.category] || IconRobot;
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.slug}`}
                    className="bg-[#111111] border border-[#1A1A1A] overflow-hidden hover:border-fire hover:-translate-y-1 transition-all duration-300 cursor-pointer group block"
                  >
                    {/* Cover image */}
                    <div className="relative h-[200px] bg-[#1A1A1A] overflow-hidden">
                      {project.cover_image_url ? (
                        <img src={project.cover_image_url} alt={project.title} width={800} height={450} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FallbackIcon size={48} className="text-[#333]" />
                        </div>
                      )}
                      {/* Category badge */}
                      <span className="absolute top-3 left-3 bg-[rgba(8,8,8,0.85)] border border-fire text-fire text-[11px] uppercase font-body px-2 py-1 tracking-wider">
                        {project.category}
                      </span>
                      {/* Featured badge */}
                      {project.is_featured && (
                        <span className="absolute top-3 right-3 bg-spark text-[#080808] text-[10px] uppercase font-body font-semibold px-2 py-1 tracking-wider">
                          ★ FEATURED
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-display text-[22px] text-[#F5F5F5] uppercase tracking-wide group-hover:text-fire transition-colors">{project.title}</h3>
                      {(project.team_name || project.college) && (
                        <p className="text-[#7A7A7A] text-[12px] mt-1 font-body">
                          {[project.team_name && `by ${project.team_name}`, project.college].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="text-ash text-[13px] leading-relaxed mt-2" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {project.description}
                      </p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.tags.map((tag) => (
                            <span key={tag} className="bg-[#1A1A1A] text-[#7A7A7A] px-2 py-0.5 text-[11px] font-body rounded-sm">{tag}</span>
                          ))}
                        </div>
                      )}
                      {project.result && (
                        <div className="mt-3">
                          <span className="text-spark text-[12px] font-semibold">🏆 {project.result}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
