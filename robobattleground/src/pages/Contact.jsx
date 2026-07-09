import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconClock, 
  IconCheck, 
  IconSend 
} from "@tabler/icons-react";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";
import { submitContactMessage } from "../lib/db.js";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error: submitErr } = await submitContactMessage(formData);
      if (submitErr) throw submitErr;
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      setLoading(false);
      alert("Message transmission failed. Please try again.");
    }
  };

  useDocumentMetadata("Contact — The Robo Battle Ground", "Reach our command war room directly. Query our team for arena availability, corporate event sponsorships, or credential logs.");

  return (
    <PageWrapper>

      <div className="bg-forge text-text-primary min-h-screen font-body overflow-x-hidden pt-12">
        <div className="max-w-5xl mx-auto px-6 py-20">
          
          {/* Clean Hero */}
          <div className="border-b border-plate pb-10 mb-16">
            <h1 className="font-display text-[clamp(32px,6vw,72px)] font-black uppercase text-text-primary">
              GET IN TOUCH
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            
            {/* LEFT — Info Column */}
            <div className="space-y-12">
              <div>
                <h2 className="font-display text-3xl text-fire uppercase tracking-wider mb-6">
                  REACH US
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <IconMail className="text-fire shrink-0" size={20} />
                    <a href="mailto:contact@therobobattleground.in" className="text-ash hover:text-text-primary transition-colors font-mono text-sm">
                      contact@therobobattleground.in
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <IconPhone className="text-fire shrink-0" size={20} />
                    <span className="text-ash font-mono text-sm">
                      +91 99999 99999
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <IconMapPin className="text-fire shrink-0" size={20} />
                    <span className="text-ash text-sm">
                      Jaipur, Rajasthan, India
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <IconClock className="text-fire shrink-0" size={20} />
                    <span className="text-ash text-sm">
                      Mon–Sat · 10AM – 7PM IST
                    </span>
                  </div>
                </div>
              </div>

              {/* QUICK LINKS SECTION */}
              <div>
                <h3 className="font-display text-2xl uppercase tracking-wider text-text-primary mb-4 border-b border-plate pb-2">
                  QUICK LINKS
                </h3>
                <div className="flex flex-col">
                  <Link 
                    to="/arena" 
                    className="block border-b border-plate py-3 text-sm text-ash hover:text-fire hover:pl-2 transition-all"
                  >
                    Book Arena Slot →
                  </Link>
                  <Link 
                    to="/internships" 
                    className="block border-b border-plate py-3 text-sm text-ash hover:text-fire hover:pl-2 transition-all"
                  >
                    Apply for Internship →
                  </Link>
                  <Link 
                    to="/verify" 
                    className="block border-b border-plate py-3 text-sm text-ash hover:text-fire hover:pl-2 transition-all"
                  >
                    Verify Certificate →
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — Contact Form */}
            <div className="bg-steel border border-plate p-8 md:p-10 rounded-none relative">
              {success ? (
                <div className="text-center py-12 space-y-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 mb-2">
                    <IconCheck size={26} />
                  </div>
                  <h3 className="font-display text-3xl uppercase text-text-primary">
                    MESSAGE SENT
                  </h3>
                  <p className="text-ash text-sm font-light">
                    We'll get back within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-fire font-semibold text-xs tracking-wider uppercase hover:underline pt-4"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-xs uppercase text-ash">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Karan Joshi"
                      className="rounded-none bg-[#080808] border border-plate p-4 text-text-primary outline-none focus:border-fire text-sm"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-xs uppercase text-ash">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="rounded-none bg-[#080808] border border-plate p-4 text-text-primary outline-none focus:border-fire text-sm"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-subject" className="text-xs uppercase text-ash">Subject</label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="rounded-none bg-[#080808] border border-plate p-4 text-text-primary outline-none focus:border-fire text-sm"
                      required
                      disabled={loading}
                    >
                      <option value="">Select Subject</option>
                      <option value="General Enquiry">General Enquiry</option>
                      <option value="Arena Booking">Arena Booking</option>
                      <option value="Internship">Internship</option>
                      <option value="Certificate Issue">Certificate Issue</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-message" className="text-xs uppercase text-ash">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about your requirements..."
                      className="rounded-none bg-[#080808] border border-plate p-4 text-text-primary outline-none focus:border-fire text-sm resize-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-fire hover:bg-[#cc3700] text-forge font-display text-xl uppercase tracking-wider transition-colors rounded-none inline-flex items-center justify-center gap-2"
                  >
                    {loading ? "Transmitting..." : <>Send Message <IconSend size={18} /></>}
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
