"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, ChevronUp } from "lucide-react";
import Head from "next/head";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      const sections = document.querySelectorAll("section[id]");
      let currentActiveSection = "";
      for (const section of sections) {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          currentActiveSection = section.id;
        }
      }
      setActiveSection(currentActiveSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collection", title: "Information Collection" },
    { id: "use-of-information", title: "Use of Information" },
    { id: "data-protection", title: "Data Protection" },
    { id: "sharing-information", title: "Sharing of Information" },
    { id: "third-party-websites", title: "Third-party Websites" },
    { id: "changes-to-policy", title: "Changes to Policy" },
    { id: "user-rights", title: "User Rights" },
    { id: "software-license", title: "Software License" },
    { id: "contact-information", title: "Contact Information" },
  ];

  return (
    <>
      <Head>
        <title>Central Aurora Tourism Management System - Privacy Policy</title>
        <meta
          name="description"
          content="Privacy Policy for C.A.T.M.S - Protecting your data and rights"
        />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-indigo-700 text-white py-4 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">C.A.T.M.S Privacy Policy</h1>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="text-gray-500 border-orange-400 hover:bg-orange-400"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="text-gray-500 border-orange-400 hover:bg-orange-400"
                  >
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex">
          <nav className="hidden lg:block w-64 mr-8">
            <Card className="p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`text-left w-full py-1 px-2 rounded transition-colors ${
                        activeSection === section.id
                          ? "bg-indigo-100 text-indigo-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          </nav>

          <div className="flex-grow">
            <Card className="p-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">
                Privacy Policy for Central Aurora Tourism Management System
                (C.A.T.M.S)
              </h1>

              <section id="introduction" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                  Welcome to the Central Aurora Tourism Management System
                  (C.A.T.M.S) Privacy Policy. This document outlines our
                  commitment to protecting your privacy and personal information
                  in compliance with Republic Act No. 10173, also known as the
                  Data Privacy Act of 2012.
                </p>
                <p className="mb-4">
                  C.A.T.M.S is operated by the Government Office of Tourism of
                  Aurora Province, Philippines. We are dedicated to ensuring
                  that your personal information is collected, used, and
                  protected in accordance with Philippine law and international
                  best practices.
                </p>
                <p>
                  By using C.A.T.M.S, you agree to the terms outlined in this
                  Privacy Policy. We encourage you to read this document
                  carefully to understand how we handle your personal
                  information.
                </p>
              </section>

              <section id="information-collection" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  2. Information Collection
                </h2>
                <p className="mb-4">
                  We collect personal identification information from users
                  through various touchpoints within our system. This may occur
                  when you:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Visit our website</li>
                  <li>Register for an account</li>
                  <li>Fill out forms</li>
                  <li>Participate in surveys or feedback sessions</li>
                  <li>Engage with our customer support</li>
                  <li>Use specific features of our system</li>
                </ul>
                <p className="mb-4">
                  The types of personal information we may collect include, but
                  are not limited to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Mailing address</li>
                  <li>
                    Job title and company affiliation (for business users)
                  </li>
                  <li>
                    Government-issued identification numbers (when required by
                    law)
                  </li>
                  <li>User preferences and settings</li>
                </ul>
                <p>
                  We are committed to collecting only the information necessary
                  to provide you with our services and to comply with legal
                  requirements.
                </p>
              </section>

              <section id="use-of-information" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  3. Use of Collected Information
                </h2>
                <p className="mb-4">
                  The Government Office of Tourism of Aurora Province uses the
                  collected personal information for various purposes aimed at
                  improving our services and your experience with C.A.T.M.S.
                  These include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Enhancing and personalizing user experience</li>
                  <li>
                    Improving our system's functionality and user interface
                  </li>
                  <li>Processing transactions and bookings</li>
                  <li>
                    Sending periodic emails with system updates, offers, and
                    tourism-related information
                  </li>
                  <li>
                    Responding to customer service requests and support needs
                  </li>
                  <li>
                    Conducting research and analysis to improve our tourism
                    services
                  </li>
                  <li>Complying with legal and regulatory requirements</li>
                </ul>
                <p className="mb-4">
                  We may use data analytics tools to understand user behavior
                  and preferences, which helps us in making data-driven
                  decisions to enhance our services.
                </p>
                <p>
                  Rest assured that we will only use your information for the
                  purposes outlined in this policy or for purposes that are
                  clearly compatible with these. If we need to use your
                  information for a purpose not covered here, we will seek your
                  consent before doing so.
                </p>
              </section>

              <section id="data-protection" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  4. Data Protection
                </h2>
                <p className="mb-4">
                  Protecting your personal information is our top priority. We
                  implement a variety of security measures to maintain the
                  safety of your personal information when you enter, submit, or
                  access your personal information. These measures include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Use of secure socket layer (SSL) technology for data
                    encryption
                  </li>
                  <li>Regular security audits and penetration testing</li>
                  <li>
                    Access controls and authentication procedures for system
                    users
                  </li>
                  <li>Data backup and recovery processes</li>
                  <li>
                    Employee training on data protection and privacy practices
                  </li>
                  <li>
                    Physical security measures for our data centers and offices
                  </li>
                </ul>
                <p className="mb-4">
                  We follow industry best practices and comply with Philippine
                  data protection laws to ensure that your data is protected
                  against unauthorized access, alteration, disclosure, or
                  destruction.
                </p>
                <p>
                  While we strive to use commercially acceptable means to
                  protect your personal information, no method of transmission
                  over the Internet or method of electronic storage is 100%
                  secure. Therefore, while we strive to protect your personal
                  information, we cannot guarantee its absolute security.
                </p>
              </section>

              <section id="sharing-information" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  5. Sharing of Personal Information
                </h2>
                <p className="mb-4">
                  We respect your privacy and are committed to maintaining the
                  confidentiality of your personal information. We do not sell,
                  trade, or rent users' personal identification information to
                  others. However, we may share generic aggregated demographic
                  information not linked to any personal identification
                  information regarding visitors and users with our business
                  partners, trusted affiliates, and advertisers for the purposes
                  outlined above.
                </p>
                <p className="mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    With service providers who assist us in operating our
                    website, conducting our business, or servicing you
                  </li>
                  <li>
                    With affiliated government agencies when required for the
                    provision of tourism services
                  </li>
                  <li>
                    To comply with legal obligations, such as responding to
                    subpoenas or court orders
                  </li>
                  <li>
                    To protect our rights, property, or safety, or the rights,
                    property, or safety of others
                  </li>
                  <li>With your consent or at your direction</li>
                </ul>
                <p>
                  We require all third parties to respect the security of your
                  personal data and to treat it in accordance with the law. We
                  do not allow our third-party service providers to use your
                  personal data for their own purposes and only permit them to
                  process your personal data for specified purposes and in
                  accordance with our instructions.
                </p>
              </section>

              <section id="third-party-websites" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  6. Third-party Websites
                </h2>
                <p className="mb-4">
                  Users may find content on our System that links to the sites
                  and services of our partners, suppliers, advertisers,
                  sponsors, licensors and other third parties. We do not control
                  the content or links that appear on these sites and are not
                  responsible for the practices employed by websites linked to
                  or from our System.
                </p>
                <p className="mb-4">
                  These websites and services may have their own privacy
                  policies and customer service policies. Browsing and
                  interaction on any other website, including websites which
                  have a link to our System, is subject to that website's own
                  terms and policies.
                </p>
                <p>
                  We encourage our users to be aware when they leave our site
                  and to read the privacy statements of any other site that
                  collects personally identifiable information. This Privacy
                  Policy applies solely to information collected by C.A.T.M.S.
                </p>
              </section>

              <section id="changes-to-policy" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  7. Changes to this Privacy Policy
                </h2>
                <p className="mb-4">
                  The Government Office of Tourism of Aurora Province has the
                  discretion to update this privacy policy at any time. When we
                  do, we will revise the updated date at the bottom of this
                  page. We encourage Users to frequently check this page for any
                  changes to stay informed about how we are helping to protect
                  the personal information we collect.
                </p>
                <p className="mb-4">
                  If we make material changes to this policy, we will notify you
                  here, by email, or by means of a notice on our home page
                  before the change becomes effective.
                </p>
                <p>
                  You acknowledge and agree that it is your responsibility to
                  review this privacy policy periodically and become aware of
                  modifications. Your continued use of C.A.T.M.S after we post
                  any modifications to the Privacy Policy on this page will
                  constitute your acknowledgment of the modifications and your
                  consent to abide and be bound by the modified Privacy Policy.
                </p>
              </section>

              <section id="user-rights" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. User Rights</h2>
                <p className="mb-4">
                  In accordance with the Data Privacy Act of 2012, users have
                  certain rights regarding their personal data. As a user of
                  C.A.T.M.S, you have the right to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    Be informed about the collection and processing of your
                    personal data
                  </li>
                  <li>Object to the processing of your personal data</li>
                  <li>Access your personal data</li>
                  <li>Rectify erroneous or incomplete data</li>
                  <li>Erase or block personal data</li>
                  <li>Be indemnified for damages</li>
                  <li>Data portability</li>
                </ul>
                <p className="mb-4">
                  To exercise these rights, you may contact us using the
                  information provided in the Contact Information section of
                  this policy. We will respond to your request within a
                  reasonable timeframe and in accordance with applicable data
                  protection laws.
                </p>
                <p>
                  Please note that while we will always strive to accommodate
                  your requests, there may be circumstances where we are unable
                  to do so, particularly if it conflicts with our legal
                  obligations or affects the rights of others. In such cases, we
                  will explain our decision and explore alternative solutions
                  where possible.
                </p>
              </section>

              <section id="software-license" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  9. Software License and Copyright Notice
                </h2>
                <p className="mb-4">
                  The Central Aurora Tourism Management System (C.A.T.M.S) is
                  proprietary software owned and operated by the Government
                  Office of Tourism of Aurora Province, Philippines. All rights
                  reserved.
                </p>
                <p className="mb-4">
                  This software and its content are protected under Philippine
                  copyright laws and international treaty provisions.
                  Unauthorized reproduction or distribution of this software, or
                  any portion of it, may result in severe civil and criminal
                  penalties, and will be prosecuted to the maximum extent
                  possible under the law.
                </p>
                <p className="mb-4">
                  The use of this software is subject to the terms of a Private
                  Software License Agreement between the Government Office of
                  Tourism of Aurora Province and the end user. No part of this
                  software may be reproduced, distributed, or transmitted in any
                  form or by any means without the prior written permission of
                  the Government Office of Tourism of Aurora Province.
                </p>
                <p className="mb-4">
                  Key points of the software license include:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>
                    The software is provided "as is" without warranty of any
                    kind, either expressed or implied.
                  </li>
                  <li>
                    Users may not modify, decompile, or reverse engineer the
                    software.
                  </li>
                  <li>
                    The license is non-transferable and may not be sublicensed.
                  </li>
                  <li>
                    Any violation of the license terms will result in immediate
                    termination of the license.
                  </li>
                </ul>
                <p>
                  For full details of the license agreement, please contact the
                  Government Office of Tourism of Aurora Province.
                </p>
              </section>

              <section id="contact-information" className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  10. Contact Information
                </h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, the
                  practices of this System, or your dealings with this System,
                  please contact us at:
                </p>
                <address className="not-italic mb-4">
                  Government Office of Tourism of Aurora Province
                  <br />
                  Provincial Capitol Complex
                  <br />
                  Brgy. Suklayin, Baler
                  <br />
                  Aurora, Philippines 3200
                  <br />
                  Phone: +63 (42) 724-0358
                  <br />
                  Email: auroratourism@aurora.gov.ph
                </address>
                <p>
                  Our Data Protection Officer can be reached at
                  dpo@aurora.gov.ph for any data privacy concerns or inquiries.
                </p>
              </section>

              <p className="text-sm text-gray-600 mt-8">
                This document was last updated on{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                .
              </p>
            </Card>
          </div>
        </main>

        <footer className="bg-gray-200 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            &copy; {new Date().getFullYear()} Central Aurora Tourism Management
            System. All rights reserved.
          </div>
        </footer>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </button>
        )}
      </div>

      <style jsx global>{`
        @media print {
          header,
          footer,
          nav,
          button {
            display: none !important;
          }

          body {
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
          }

          h1 {
            font-size: 24pt;
            margin-bottom: 20pt;
          }

          h2 {
            font-size: 18pt;
            margin-top: 15pt;
            margin-bottom: 10pt;
          }

          p,
          ul {
            margin-bottom: 10pt;
          }

          a {
            text-decoration: none;
            color: #000;
          }

          .card {
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </>
  );
}
