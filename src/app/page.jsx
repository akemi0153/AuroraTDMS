"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Hotel,
  ClipboardCheck,
  ShieldCheck,
  TrendingUp,
  Users,
  Bell,
  Award,
  ClipboardList,
  Search,
  CheckCircle,
  BarChart2,
  FileText,
  Building,
  Zap,
} from "lucide-react";

const images = [
  "/image/bay.png",
  "/image/costa.png",
  "/image/resort.jpg",
  "/image/casa.png",
  "/image/baler.png",
  "/image/l-sirene-boutique-resort.png",
  "/image/playa-azul-baler.png",
  "/image/Riverstone.png",
  "/image/m.png",
  "/image/caption.png",
];

export default function CATDMS() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const toggleFAQ = (index) => {
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(index);
    }
  };

  const features = [
    {
      icon: ClipboardCheck,
      title: "Streamlined Inspections",
      description:
        "Reduce inspection time by 60% with our digital checklists. Ensure thorough room-by-room evaluations without the paperwork hassle. Our intuitive interface allows inspectors to quickly navigate through tasks, capture photos, and add notes on the go.",
    },
    {
      icon: ShieldCheck,
      title: "Compliance Assurance",
      description:
        "Stay updated with the latest hospitality regulations. Our system adapts to new guidelines, keeping your property compliant and guest-ready. Receive automatic updates on regulatory changes and ensure your inspections meet the highest standards.",
    },
    {
      icon: Users,
      title: "Admin Management",
      description:
        "Centralized control for administrators to oversee inspection processes, review submissions, and manage client establishments effectively. Gain insights through detailed reports and analytics to make informed decisions and improve operational efficiency.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description:
        "Maintain consistently high standards across all accommodations through systematic pre-inspection processes and administrative oversight. Track performance metrics and identify areas for improvement to ensure exceptional guest experiences.",
    },
  ];

  const inspectionSteps = [
    {
      icon: ClipboardList,
      title: "Pre-Inspection",
      description:
        "Get ready for inspections by setting up schedules and checklists. We'll help you prepare everything you need for a smooth evaluation process.",
      videoUrl: "/videos/pre-inspection.mp4",
    },
    {
      icon: Search,
      title: "On-Site Inspection",
      description:
        "Conduct thorough property inspections using our easy-to-use web platform. Take photos, add notes, and rate different areas all in one place.",
      videoUrl: "/videos/on-site-inspection.mp4",
    },
    {
      icon: BarChart2,
      title: "Follow-up & Improvement",
      description:
        "Track how well improvements are being made. Set deadlines, assign tasks to team members, and keep an eye on progress to help your property get better.",
      videoUrl: "/videos/follow-up-improvement.mp4",
    },
  ];

  const faqItems = [
    {
      question: "How does the system improve inspection efficiency?",
      answer:
        "Our system digitizes the entire inspection process, from scheduling to reporting. This reduces paperwork, eliminates manual data entry, and allows for real-time collaboration, significantly speeding up inspections while improving accuracy and consistency across all rooms and facilities.",
    },
    {
      question:
        "Can the system be customized for different types of accommodations?",
      answer:
        "Yes, our system is highly flexible and can be tailored to various accommodation types, including hotels, resorts, vacation rentals. Customizable checklists and evaluation criteria ensure that inspections are relevant to your specific property type and brand standards.",
    },
    {
      question: "How does the system ensure data security and guest privacy?",
      answer:
        "We adhere strictly to the Philippine Data Protection Law to safeguard all information. Our system employs robust encryption and security measures to protect data. Access to sensitive information is tightly controlled based on user roles, and we ensure that all data handling practices comply with the requirements set forth by the Philippine data protection regulations.",
    },
    {
      question: "How does the system help in maintaining brand standards?",
      answer:
        "The system includes customizable checklists that reflect your brand standards. It provides detailed reports and actionable insights after each inspection, allowing you to track compliance with brand requirements. The system also offers trend analysis to help identify recurring issues that may affect brand consistency.",
    },
    {
      question: "What kind of support and training do you offer?",
      answer:
        "We provide comprehensive onboarding and training for Tourism Officers, Hotel Staff, and Municipalities Inspectors. Our support team is available on a scheduled basis within Monday, Wednesday, Thursday, and Friday to assist with any questions or issues. We also offer regular webinars and updates on best practices in accommodation inspection and quality management.",
    },
    {
      question:
        "What legal mandates govern tourism data submission in Aurora Province?",
      answer:
        "Under Provincial Ordinance No. 473 and Republic Act No. 9593 (Tourism Act of 2009), all accommodation establishments in Aurora Province including Hotels, Resorts, Apartelles, Pension Houses, Tourist Inns, Transient Houses, and similar establishments are required to submit their tourism statistical data to the Provincial Tourism Office for proper implementation and monitoring.",
    },
    {
      question:
        "How does CATDMS address the unique needs of Central Aurora's tourism industry?",
      answer: (
        <div className="space-y-4 text-justify">
          <p>
            CATDMS is specifically designed to meet the unique requirements of
            Central Aurora's diverse tourism landscape. It incorporates both DOT
            (Department of Tourism) Standard Regulations and Local Standard
            Regulations:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <span className="font-semibold">DOT Compliance:</span> The system
              ensures all accommodations adhere to the latest DOT standards,
              including the National Accommodation Standards for Hotels,
              Resorts, and Apartment Hotels. It covers crucial areas such as
              guest rooms, public areas, food and beverage outlets, kitchen and
              food production areas, and guest services.
            </li>
            <li>
              <span className="font-semibold">Local Regulations:</span> CATDMS
              integrates Central Aurora's specific local ordinances and
              regulations, such as environmental protection measures for coastal
              properties and cultural preservation guidelines for heritage
              sites.
            </li>
            <li>
              <span className="font-semibold">Customized Checklists:</span> The
              system offers tailored inspection checklists for various
              accommodation types found in Central Aurora, from beach resorts to
              mountain lodges, ensuring relevant criteria for each property
              type.
            </li>
            <li>
              <span className="font-semibold">Seasonal Adaptability:</span> The
              system accounts for Central Aurora's seasonal tourism patterns,
              allowing for adjusted inspection schedules and criteria during
              peak and off-peak seasons.
            </li>
            <li>
              <span className="font-semibold">Local Collaboration:</span> CATDMS
              facilitates seamless cooperation between local government units,
              property owners, and the Provincial Tourism Office, ensuring a
              unified approach to maintaining and improving accommodation
              standards across Central Aurora.
            </li>
            <li>
              <span className="font-semibold">
                Sustainable Tourism Practices:
              </span>{" "}
              In line with both DOT and local initiatives, the system
              incorporates sustainability metrics, helping properties in Central
              Aurora to implement and track eco-friendly practices.
            </li>
          </ol>
          <p>
            By addressing these specific needs, CATDMS not only ensures
            regulatory compliance but also contributes to the overall
            improvement of Central Aurora's tourism industry, enhancing guest
            experiences and supporting the region's reputation as a top-tier
            destination.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-indigo-700 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/image/lap.png"
                  alt="AccomoInspect Logo"
                  width={70}
                  height={70}
                />
              </Link>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#process" className="hover:underline">
                    Process
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-b from-indigo-800 to-indigo-600 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-sky-100 mb-4">
                  Central Aurora Tourism Digital Management System
                </h1>
                <p className="text-xl text-sky-200 mb-6">
                  CATDMS Your all-in-one solution for efficient, transparent,
                  and standardized accommodation inspections. Empower your team
                  to maintain world-class standards and enhance guest
                  satisfaction.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-amber-400 text-indigo-900 hover:bg-amber-300"
                    onClick={openVideoModal}
                  >
                    Watch Demo
                  </Button>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-amber-400 text-indigo-900 hover:bg-amber-300"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative w-full h-[400px]">
                  {images.map((src, index) => (
                    <Image
                      key={src}
                      src={src}
                      alt={`Slide ${index + 1}`}
                      fill
                      className={`rounded-lg shadow-lg object-cover transition-opacity duration-1000 ${
                        index === currentImageIndex
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      priority={index === 0}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-teal-800">
              Why Choose CATDMS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <feature.icon size={40} className="text-indigo-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-indigo-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-teal-800">
              Streamlined Inspection Process
            </h2>
            <Tabs defaultValue="pre-inspection" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                {inspectionSteps.map((step, index) => (
                  <TabsTrigger
                    key={index}
                    value={step.title.toLowerCase().replace(" ", "-")}
                    className="text-indigo-600 data-[state=active]:bg-indigo-100"
                  >
                    {step.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {inspectionSteps.map((step, index) => (
                <TabsContent
                  key={index}
                  value={step.title.toLowerCase().replace(" ", "-")}
                >
                  <Card className="border-teal-200">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <step.icon size={24} className="text-teal-600 mr-4" />
                        <h3 className="text-2xl font-bold text-teal-800">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="aspect-video bg-teal-50 rounded-lg overflow-hidden">
                        {step.videoUrl ? (
                          <video
                            src={step.videoUrl}
                            controls
                            className="w-full h-full object-cover"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <p className="flex items-center justify-center h-full text-teal-500">
                            Video coming soon
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-teal-800">
              Empowering Your Accommodation Business
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText size={48} className="text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-teal-800">
                    For Inspectors
                  </h3>
                  <p className="text-gray-600">
                    Streamline your workflow, access real-time data, and conduct
                    more efficient room-by-room inspections.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Building size={48} className="text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-teal-800">
                    For Property Managers
                  </h3>
                  <p className="text-gray-600">
                    Maintain high standards, track performance, and improve
                    guest satisfaction with data-driven insights.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap size={48} className="text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-teal-800">
                    Administrator of Provincial Tourism Office
                  </h3>
                  <p className="text-gray-600">
                    Gain comprehensive insights, ensure brand consistency, and
                    drive continuous improvement across your properties using
                    our web-based system.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-teal-800">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 w-full max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      className="flex justify-between items-center w-full p-4 text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span className="text-lg font-semibold text-teal-700">
                        {item.question}
                      </span>
                      {expandedFAQ === index ? (
                        <ChevronUp className="h-5 w-5 text-teal-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-teal-500" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-4 pb-4"
                        >
                          <div className="text-gray-600">{item.answer}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                About Central Aurora Tourism Digital Management System
              </h3>
              <p className="text-sm">
                CATDMS is the leading accommodation inspection management
                system, streamlining quality control processes for hotels,
                resorts, and vacation rentals worldwide. Our mission is to
                elevate hospitality standards and enhance guest experiences
                through efficient, data-driven inspections.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#process" className="text-sm hover:underline">
                    Our Process
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-sm hover:underline">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm hover:underline">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Contact Information
              </h3>
              <p className="text-sm">123 Hospitality Avenue, Global City</p>
              <p className="text-sm">Phone: (123) 456-7890</p>
              <p className="text-sm">Email: auroratourismdev@outlook.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} CATDMS All rights reserved.
              Develop by クリスチャン ジョセフ マリグメン.
            </p>
          </div>
        </div>
      </footer>

      {isVideoModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeVideoModal();
            }
          }}
        >
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg">
            <div className="aspect-video">
              <video
                src="/videos/demo.mp4"
                controls
                className="w-full h-full rounded-lg"
                title="Demo Video"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
