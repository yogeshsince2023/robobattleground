import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { IconArrowLeft, IconLoader, IconCopy, IconCheck } from "@tabler/icons-react";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";
import { getProjectBySlug } from "../lib/db.js";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await getProjectBySlug(slug);
      if (err || !data) { setError(true); }
      else { setProject(data); }
      setLoading(false);
    })();
  }, [slug]);

  useDocumentMetadata(
    project ? `${project.title} — TRBG` : "Project — TRBG",
    project?.description || "Project details on The Robo Battle Ground."
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="bg-[#080808] min-h-screen flex items-center justify-center">
          <IconLoader className="animate-spin text-fire" size={40} />
        </div>
      </PageWrapper>
    );
  }

  if (error || !project) {
    return (
      <PageWrapper>
        <div className="bg-[#080808] min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-[48px] text-[#F5F5F5] uppercase mb-4">PROJECT NOT FOUND</h1>
          <p className="text-ash text-sm mb-8">This project doesn't exist or hasn't been published yet.</p>
          <Link to="/projects" className="text-fire hover:underline font-body text-sm uppercase tracking-wider">← Back to Projects</Link>
        </div>
      </PageWrapper>
    );
  }

  const metaItems = [project.team_name, project.college, project.weight_class, project.competition].filter(Boolean);

  return (
    <PageWrapper>
      <div className="bg-[#080808] text-[#F5F5F5] min-h-screen font-body">
        <div className="max-w-4xl mx-auto py-20 px-6">

          {/* Back link */}
          <Link to="/projects" className="inline-flex items-center gap-2 text-ash hover:text-fire text-sm uppercase tracking-wider mb-8 transition-colors">
            <IconArrowLeft size={16} /> BACK TO PROJECTS
          </Link>

          {/* Cover image */}
          {project.cover_image_url && (
            <div className="w-full max-h-[500px] overflow-hidden mb-8 border border-[#1A1A1A]">
              <img src={project.cover_image_url} alt={project.title} width={800} height={450} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[rgba(8,8,8,0.85)] border border-fire text-fire text-[11px] uppercase font-body px-2 py-1 tracking-wider">
              {project.category}
            </span>
            {project.is_featured && (
              <span className="bg-spark text-[#080808] text-[10px] uppercase font-body font-semibold px-2 py-1 tracking-wider">
                ★ FEATURED
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-[clamp(36px,6vw,56px)] text-[#F5F5F5] uppercase leading-none mb-4">{project.title}</h1>

          {/* Meta row */}
          {metaItems.length > 0 && (
            <p className="text-ash text-[13px] mb-6">{metaItems.join(" · ")}</p>
          )}

          {/* Result highlight */}
          {project.result && (
            <div className="bg-[rgba(255,183,0,0.08)] border border-[rgba(255,183,0,0.3)] py-4 px-6 mb-8">
              <span className="font-display text-[24px] text-spark">🏆 {project.result}</span>
            </div>
          )}

          {/* Full content */}
          <div className="space-y-4 mb-12">
            {(project.full_content || project.description).split("\n\n").map((para, i) => (
              <p key={i} className="text-ash text-[16px] leading-[1.8]">{para}</p>
            ))}
          </div>

          {/* Gallery */}
          {project.gallery_urls && project.gallery_urls.length > 0 && (
            <div className="mb-12">
              <h2 className="font-display text-[24px] text-[#F5F5F5] uppercase tracking-wider mb-4">GALLERY</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {project.gallery_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="border border-[#1A1A1A] overflow-hidden hover:border-fire transition-colors block">
                    <img src={url} alt={`${project.title} photo ${i + 1}`} width={600} height={400} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="bg-[#1A1A1A] text-[#7A7A7A] px-2 py-1 text-[11px] font-body rounded-sm">{tag}</span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="border-t border-[#1A1A1A] pt-6">
            <button onClick={handleCopy} className="flex items-center gap-2 text-ash hover:text-fire text-sm uppercase tracking-wider transition-colors">
              {copied ? <><IconCheck size={16} /> COPIED!</> : <><IconCopy size={16} /> SHARE THIS PROJECT</>}
            </button>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
