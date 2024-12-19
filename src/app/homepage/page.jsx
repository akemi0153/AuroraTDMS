"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sunrise,
  ClipboardCheck,
  Shield,
  TrendingUp,
  Users,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Search,
  CheckCircle,
  BarChart,
} from "lucide-react";

export default function Home() {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const features = [
    {
      icon: ClipboardCheck,
      title: "Efficient Inspections",
      description:
        "Reduce paperwork by 80% and save time with our digital tools.",
    },
    {
      icon: Shield,
      title: "Ensure Compliance",
      description:
        "Stay updated with the latest regulations for 100% compliance.",
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Insights",
      description: "Make informed decisions with comprehensive analytics.",
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description: "Foster communication between all stakeholders.",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Receive instant notifications on inspection statuses.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Maintain high standards with our comprehensive tools.",
    },
  ];

  const testimonials = [
    {
      quote:
        "CATMS has revolutionized our inspection process, reducing inspection time by 40%.",
      author: "Maria Rodriguez",
      title: "Chief Inspector, Aurora City Tourism Board",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "We've seen a 30% increase in guest satisfaction due to improved standards.",
      author: "John Smith",
      title: "Owner, Sunrise Resort",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "CATMS has helped us identify and address issues 50% faster than before.",
      author: "Lisa Chen",
      title: "Director of Tourism, Central Aurora",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ];

  const inspectionSteps = [
    {
      icon: ClipboardList,
      title: "Preparation",
      description: "Schedule inspections and prepare documents digitally.",
    },
    {
      icon: Search,
      title: "On-Site Inspection",
      description: "Conduct thorough inspections using our mobile app.",
    },
    {
      icon: CheckCircle,
      title: "Evaluation",
      description: "Assess compliance and generate instant reports.",
    },
    {
      icon: BarChart,
      title: "Follow-up",
      description: "Track improvements and monitor progress over time.",
    },
  ];

  const nextTestimonial = () =>
    setCurrentTestimonialIndex(
      (prevIndex) => (prevIndex + 1) % testimonials.length
    );
  const prevTestimonial = () =>
    setCurrentTestimonialIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sunrise size={32} />
              <span className="text-xl font-bold">CATMS</span>
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
                  <Link href="#testimonials" className="hover:underline">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </nav>
            <Button variant="secondary" size="sm">
              Login
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="md:w-1/2 mb-8 md:mb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
                  Elevate Tourism Standards in Central Aurora
                </h1>
                <p className="text-xl text-blue-700 mb-6">
                  CATMS:Your all-in-one solution for efficient, transparent, and
                  standardized tourism inspections.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg">Get Started</Button>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/image/DD.png"
                  alt="Central Aurora Tourism"
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
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose CATMS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <feature.icon size={40} className="text-blue-600 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
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
            <h2 className="text-3xl font-bold text-center mb-12">
              Streamlined Inspection Process
            </h2>
            <Tabs defaultValue="preparation" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {inspectionSteps.map((step, index) => (
                  <TabsTrigger key={index} value={step.title.toLowerCase()}>
                    {step.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {inspectionSteps.map((step, index) => (
                <TabsContent key={index} value={step.title.toLowerCase()}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <step.icon size={24} className="text-blue-600 mr-4" />
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">
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

        <section id="testimonials" className="py-20 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Users Say
            </h2>
            <div className="relative max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-xl mb-4">
                        "{testimonials[currentTestimonialIndex].quote}"
                      </p>
                      <div className="flex items-center">
                        <Image
                          src={testimonials[currentTestimonialIndex].avatar}
                          alt={testimonials[currentTestimonialIndex].author}
                          width={60}
                          height={60}
                          className="rounded-full mr-4"
                        />
                        <div>
                          <p className="font-semibold">
                            {testimonials[currentTestimonialIndex].author}
                          </p>
                          <p className="text-sm text-gray-500">
                            {testimonials[currentTestimonialIndex].title}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 bg-white rounded-full p-2 shadow-md"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 bg-white rounded-full p-2 shadow-md"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>

        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Elevate Your Tourism Inspections?
            </h2>
            <p className="text-xl mb-8">
              Join CATMS today and experience the future of tourism management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary">
                Request a Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About CATMS</h3>
              <p className="text-sm">
                Central Aurora Tourism Inspection Management System streamlines
                the process of tourism inspections, ensuring safety and quality
                for all visitors.
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
                  <Link
                    href="#testimonials"
                    className="text-sm hover:underline"
                  >
                    Testimonials
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
              <p className="text-sm">123 Tourism Street, Aurora City</p>
              <p className="text-sm">Phone: (123) 456-7890</p>
              <p className="text-sm">Email: info@catims.gov</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Central Aurora Tourism
              Inspection Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
