"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

export default function CATMS() {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Streamlined Inspections",
      description:
        "Reduce inspection time by 60% with our digital checklists. Ensure thorough room-by-room evaluations without the paperwork hassle.",
    },
    {
      icon: ShieldCheck,
      title: "Compliance Assurance",
      description:
        "Stay updated with the latest hospitality regulations. Our system adapts to new guidelines, keeping your property compliant and guest-ready.",
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description:
        "Gain valuable insights into your property's performance. Track improvements, identify areas for enhancement, and benchmark against industry standards.",
    },
    {
      icon: Users,
      title: "Staff Collaboration",
      description:
        "Enhance communication between inspectors, management, and staff. Assign tasks, track progress, and ensure swift resolution of identified issues.",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description:
        "Receive real-time alerts on critical issues. Stay informed about inspection progress and urgent matters requiring immediate attention.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description:
        "Maintain consistently high standards across all rooms and facilities. Uphold your property's reputation and ensure guest satisfaction.",
    },
  ];

  const inspectionSteps = [
    {
      icon: ClipboardList,
      title: "Pre-Inspection",
      description:
        "Schedule inspections and prepare digital checklists. Access property history, previous reports, and specific room details for targeted evaluations.",
    },
    {
      icon: Search,
      title: "On-Site Inspection",
      description:
        "Conduct thorough room-by-room inspections using our mobile app. Document findings with photos, notes, and ratings in real-time.",
    },
    {
      icon: CheckCircle,
      title: "Evaluation & Reporting",
      description:
        "Generate comprehensive reports instantly. Our AI-assisted system helps identify trends, suggest improvements, and prioritize actions.",
    },
    {
      icon: BarChart2,
      title: "Follow-up & Improvement",
      description:
        "Track the implementation of recommendations. Set deadlines, assign tasks to staff, and monitor progress to ensure continuous improvement.",
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
        "Yes, our system is highly flexible and can be tailored to various accommodation types, including hotels, resorts, vacation rentals, and boutique properties. Customizable checklists and evaluation criteria ensure that inspections are relevant to your specific property type and brand standards.",
    },
    {
      question: "How does the system ensure data security and guest privacy?",
      answer:
        "We adhere strictly to the Philippine Data Protection Law to safeguard all information. Our system employs robust encryption and security measures to protect data. Access to sensitive information is tightly controlled based on user roles, and we ensure that all data handling practices comply with the requirements set forth by the Philippine data protection regulations.",
    },
    {
      question:
        "Can the system integrate with our existing property management software?",
      answer:
        "Yes, our system is designed with integration in mind. It can seamlessly connect with various property management systems, housekeeping software, and maintenance tracking tools. This ensures a smooth flow of information across your entire operation, from front desk to back-of-house.",
    },
    {
      question: "How does the system help in maintaining brand standards?",
      answer:
        "The system includes customizable checklists that reflect your brand standards. It provides detailed reports and actionable insights after each inspection, allowing you to track compliance with brand requirements. The system also offers trend analysis to help identify recurring issues that may affect brand consistency.",
    },
    {
      question: "What kind of support and training do you offer?",
      answer:
        "We provide comprehensive onboarding and training for all users, including inspectors, management, and staff. Our support team is available 24/7 to assist with any questions or issues. We also offer regular webinars and updates on best practices in accommodation inspection and quality management.",
    },
  ];

  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (index) => {
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(index);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-indigo-700 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/image/lap.png"
                alt="AccomoInspect Logo"
                width={70}
                height={70}
              />
            </Link>
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
                  Central Aurora Tourism Management System
                </h1>
                <p className="text-xl text-sky-200 mb-6">
                  C.A.T.M.S: Your all-in-one solution for efficient,
                  transparent, and standardized accommodation inspections.
                  Empower your team to maintain world-class standards and
                  enhance guest satisfaction.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-amber-400 text-indigo-900 hover:bg-amber-300"
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
                <Image
                  src="/image/BB.png"
                  alt="Accommodation Inspection"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-teal-800">
              Why Choose C.A.T.M.S?
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
              <TabsList className="grid w-full grid-cols-4 mb-8">
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
                      <div className="aspect-video bg-teal-50 rounded-lg flex items-center justify-center">
                        <p className="text-teal-500">
                          Interactive demo or video placeholder
                        </p>
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
                          <p className="text-gray-600">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-indigo-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Elevate Your Accommodation Inspections?
            </h2>
            <p className="text-xl mb-8">
              Join C.A.T.M.S today and experience the future of hospitality
              quality management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/demo-form">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-amber-400 text-indigo-900 hover:bg-amber-300"
                >
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                About Central Aurora Tourism Management System
              </h3>
              <p className="text-sm">
                C.A.T.M.S is the leading accommodation inspection management
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
              <p className="text-sm">Email: info@accomoinspect.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} C.A.T.M.S. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
