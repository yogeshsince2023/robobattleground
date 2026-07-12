import React from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import useDocumentMetadata from "../hooks/useDocumentMetadata.js";

export default function Terms() {
  useDocumentMetadata(
    "Terms & Conditions — The Robo Battle Ground",
    "Read the official Terms and Conditions for accessing and using The Robo Battle Ground platform, services, and courses."
  );

  return (
    <PageWrapper>
      <div className="bg-forge text-text-primary min-h-screen font-body py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b border-plate pb-8 mb-12 text-center sm:text-left">
            <span className="text-fire font-display text-sm tracking-[0.2em] uppercase block mb-3">
              // Legal Policy
            </span>
            <h1 className="font-display text-[clamp(32px,6vw,56px)] font-black uppercase leading-none text-text-primary">
              Terms & Conditions
            </h1>
            <p className="text-ash text-sm font-mono mt-4">
              Last updated: July 12, 2026
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10 text-[#CCCCCC] text-[15px] leading-relaxed font-light">
            
            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                1. Introduction
              </h2>
              <p>
                These Terms and Conditions (“Terms”) govern your access to and use of the website 
                <span className="text-text-primary font-medium"> www.therobobattleground.com</span> (“Website”) and any purchase of products, courses, internships, or arena services from 
                <span className="text-text-primary font-medium"> The Robo Battle Ground</span> (“we”, “us”, “our”).
              </p>
              <p>
                By accessing or using the Website, you agree to be bound by these Terms. If you do not agree to all of these Terms, you must not access or use the Website or our services.
              </p>
            </section>

            {/* 2. Company Details */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                2. Company Details
              </h2>
              <p>
                The Robo Battle Ground is operated under our registered business entity:
              </p>
              <ul className="list-none space-y-2 pl-4 border-l-2 border-plate py-1 bg-steel/30 font-mono text-[13px] text-ash">
                <li><strong className="text-text-primary font-sans">Business Name:</strong> The Robo Battle Ground</li>
                <li><strong className="text-text-primary font-sans">Udyam Registration No:</strong> UDYAM-RJ-21-0091002</li>
                <li><strong className="text-text-primary font-sans">Address:</strong> Jaipur, Rajasthan, India</li>
                <li><strong className="text-text-primary font-sans">Email:</strong> therobobattleground@gmail.com</li>
                <li><strong className="text-text-primary font-sans">Phone:</strong> +91 85298 96177</li>
              </ul>
            </section>

            {/* 3. Eligibility */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                3. Eligibility
              </h2>
              <p>
                By using this Website, you represent that you are at least the age of majority in your state or province of residence, or that you have given us your consent to allow any of your minor dependents to use this site, and that you are legally capable of entering into binding contracts.
              </p>
            </section>

            {/* 4. Account Registration */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                4. Account Registration
              </h2>
              <p>
                You may need to create an account or provide verified user credentials to place orders, apply for internships, book arena slots, or verify certificates on our portal.
              </p>
              <p>
                You are solely responsible for maintaining the confidentiality of your login credentials and for all actions taken under your account. You must provide accurate, current, and complete information and promptly update it as needed. We reserve the right to suspend or terminate accounts that contain false information or violate these Terms.
              </p>
            </section>

            {/* 5. Products, Services, and Pricing */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                5. Products, Services, and Pricing
              </h2>
              <p>
                Descriptions, technical specifications, training content details, booking availability, and pricing listed on our Website are for general information and are subject to update or change at any time without notice.
              </p>
              <p>
                All prices are in Indian Rupees (INR) unless explicitly stated otherwise. Despite our best efforts, pricing or catalog details may occasionally contain errors. We reserve the right to correct any errors, inaccuracies, or omissions, and to change details or cancel orders if any information is inaccurate.
              </p>
            </section>

            {/* 6. Orders and Acceptance */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                6. Orders and Acceptance
              </h2>
              <p>
                By placing an order, booking an arena session, or enrolling in a course, you make an offer to purchase the selected services under these Terms. Order confirmations acknowledge receipt of your order but do not constitute formal acceptance.
              </p>
              <p>
                Acceptance occurs only when we confirm your booking schedule or dispatch your course access/credentials. We reserve the right to refuse or cancel bookings or orders at our sole discretion, including due to capacity limitations, slot conflicts, or payment processing failures.
              </p>
            </section>

            {/* 7. Payment Terms */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                7. Payment Terms
              </h2>
              <p>
                We accept payments through secure third-party payment gateways (including Razorpay and other methods listed on the Website at checkout). 
              </p>
              <p>
                By providing payment details, you represent that you are authorized to use the chosen payment method and authorize our payment partners to charge the total transaction amount. We are not liable for transaction failures, bank declines, or payment-related delays.
              </p>
            </section>

            {/* 8. Shipping and Delivery */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                8. Shipping and Delivery
              </h2>
              <p>
                For any physical shipments (components, hardware kits, merchandise), shipping will be arranged through reputable courier and logistics partners (such as DTDC and others). 
              </p>
              <p>
                Estimated delivery timelines are guidelines and not binding guarantees. Risk of loss and title to components passes to you upon handover to the logistics partner. You are responsible for ensuring shipping details are accurate.
              </p>
            </section>

            {/* 9. Cancellations, Returns, and Refunds */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                9. Cancellations, Returns, and Refunds
              </h2>
              <p>
                Due to the customized nature of training cohorts, certificate issuances, and scheduled arena bookings, refunds and cancellations are handled strictly on a case-by-case basis. Please review any specific cohort terms during checkout. In the event of an approved refund, processing will be routed back to the original payment source.
              </p>
            </section>

            {/* 10. Use of the Website */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                10. Use of the Website
              </h2>
              <p>
                You agree not to use this Website for any unlawful, fraudulent, or malicious purpose. You must not attempt to disrupt our servers, bypass authentication barriers, or scrape data using automated tools (crawlers, bots, or script processes) in a manner that harms the platform's stability.
              </p>
            </section>

            {/* 11. Intellectual Property */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                11. Intellectual Property
              </h2>
              <p>
                All materials on the Website—including text, layout designs, media graphics, combat rules, logos, code scripts, and course content—are owned by or licensed to The Robo Battle Ground.
              </p>
              <p>
                You are granted a limited, personal, non-commercial license to access the Website. You may not copy, duplicate, resell, or distribute any site graphics or content without our explicit prior written consent.
              </p>
            </section>

            {/* 12. Third-Party Services */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                12. Third-Party Services
              </h2>
              <p>
                Our services may link to or integrate third-party platforms (like Supabase for database management, Netlify for hosting, and Razorpay for payment checkouts). These partners operate under their own legal terms. We are not responsible for third-party practices or privacy protocols.
              </p>
            </section>

            {/* 13. Disclaimer of Warranties */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                13. Disclaimer of Warranties
              </h2>
              <p className="italic text-ash">
                The Website and all products, tools, and services provided herein are offered on an "as is" and "as available" basis, without any warranties of any kind, whether express or implied, to the maximum extent permitted by law.
              </p>
            </section>

            {/* 14. Limitation of Liability */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                14. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law, The Robo Battle Ground, its founders, and affiliates shall not be liable for any indirect, incidental, special, or consequential damages (including drivetrain fatigue, battery failure, bot damage, or data loss) arising out of your participation in combat robotics trials, use of our tools, or reliance on Website information. Our aggregate liability will not exceed the transaction amount paid for the specific order.
              </p>
            </section>

            {/* 15. Indemnity */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                15. Indemnity
              </h2>
              <p>
                You agree to indemnify and hold harmless The Robo Battle Ground and its team from any claims, losses, liabilities, costs, and legal expenses arising out of your breach of these Terms, misuse of the Website, or violation of third-party rights.
              </p>
            </section>

            {/* 16. Governing Law and Jurisdiction */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                16. Governing Law and Jurisdiction
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any legal disputes or claims arising out of these Terms or your use of our services will be subject to the exclusive jurisdiction of the competent courts in 
                <span className="text-text-primary font-medium"> Jaipur, Rajasthan</span>.
              </p>
            </section>

            {/* 17. Changes to Terms */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                17. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Updates will take effect immediately upon posting to this page. Your continued use of the Website after modifications indicates your acceptance of the revised Terms.
              </p>
            </section>

            {/* 18. Contact */}
            <section className="space-y-3">
              <h2 className="font-display text-xl uppercase tracking-wider text-fire font-bold">
                18. Contact Details
              </h2>
              <p>
                For clarifications, inquiries, or feedback regarding these Terms, please contact us directly:
              </p>
              <ul className="list-none space-y-1 pl-4 text-ash">
                <li><strong className="text-text-primary">Email:</strong> therobobattleground@gmail.com</li>
                <li><strong className="text-text-primary">WhatsApp/Call:</strong> +91 85298 96177</li>
              </ul>
            </section>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
