"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Coffee,
  Wifi,
  Dumbbell,
  Search,
  Map,
  LifeBuoy,
  Sparkles,
  Car,
  ChevronDown,
  Sun,
  Waves,
  Mountain,
  Users,
  Phone,
  Mail,
  Globe,
  Clock,
} from "lucide-react";

const hotels = [
  {
    id: 1,
    name: "Costa Pacifica",
    rating: 4.5,
    price: 8250,
    image: "./image/costa.png",
    location: "Baler, Aurora",
    amenities: ["wifi", "gym", "restaurant", "pool", "spa"],
    description:
      "Luxurious beachfront resort with stunning ocean views and world-class amenities.",
    contact: {
      phone: "+63 2 8519 4249",
      email: "info@costapacificabaler.com",
      website: "https://www.costapacificabaler.com",
    },
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
    photos: [
      "/image/costa-1.jpg",
      "/image/costa-2.jpg",
      "/image/costa-3.jpg",
      "/image/costa-4.jpg",
    ],
  },
  {
    id: 2,
    name: "Bay's Inn Resort",
    rating: 4.2,
    price: 6600,
    image: "/image/bay.png",
    location: "Baler, Aurora",
    amenities: ["wifi", "restaurant", "parking"],
    description:
      "Cozy beachfront resort offering comfortable accommodations and easy access to Sabang Beach.",
    contact: {
      phone: "+63 919 991 3075",
      email: "baysinnresort@gmail.com",
      website: "https://www.baysinnresort.com",
    },
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    photos: ["/image/bay-1.jpg", "/image/bay-2.jpg"],
  },
  {
    id: 3,
    name: "Aliya Surf Camp",
    rating: 4.0,
    price: 5500,
    image: "/image/resort.jpg",
    location: "Baler, Aurora",
    amenities: ["wifi", "parking", "restaurant"],
    description:
      "Laid-back surf camp offering surf lessons, board rentals, and beachfront accommodations.",
    contact: {
      phone: "+63 917 794 7749",
      email: "aliyasurfcamp@gmail.com",
      website: "https://www.aliyasurfcamp.com",
    },
    checkIn: "1:00 PM",
    checkOut: "10:00 AM",
    photos: ["/image/aliya-1.jpg", "/image/aliya-2.jpg", "/image/aliya-3.jpg"],
  },
];

const amenitiesOptions = [
  { value: "wifi", label: "Wi-Fi", icon: Wifi },
  { value: "gym", label: "Gym", icon: Dumbbell },
  { value: "restaurant", label: "Restaurant", icon: Coffee },
  { value: "pool", label: "Pool", icon: LifeBuoy },
  { value: "spa", label: "Spa", icon: Sparkles },
  { value: "parking", label: "Parking", icon: Car },
];

const attractions = [
  {
    name: "Sabang Beach",
    description:
      "A 2-kilometer stretch of gray sand beach known for its surfing waves. Perfect for beginners and experienced surfers alike.",
    icon: Waves,
    activities: [
      "Surfing lessons for beginners",
      "Advanced surfing spots for experienced surfers",
      "Beach volleyball",
      "Sunbathing and relaxation",
      "Beachside dining",
      "Sunset watching",
    ],
    bestTime:
      "The best time to visit Sabang Beach for surfing is from October to March when the waves are at their best. However, the beach is beautiful year-round and offers a great escape even during the off-season.",
  },
  {
    name: "Dicasalarin Cove",
    description:
      "A secluded white sand beach surrounded by rolling hills. Offers breathtaking views and is ideal for swimming and picnics.",
    icon: Sun,
    activities: [
      "Swimming in crystal clear waters",
      "Picnicking on the beach",
      "Hiking to the nearby lighthouse",
      "Photography of the scenic landscape",
      "Birdwatching",
    ],
    howToGetThere:
      "Dicasalarin Cove is about 30 minutes drive from Baler town proper. You'll need to arrange transportation as public vehicles don't regularly go to this area. Many local tour operators offer trips to the cove.",
  },
  {
    name: "Diguisit Falls",
    description:
      "A series of cascading waterfalls surrounded by lush greenery. A great spot for nature lovers and photographers.",
    icon: Mountain,
    activities: [
      "Swimming in the natural pools",
      "Rock climbing",
      "Nature photography",
      "Picnicking",
      "Short hiking trails",
    ],
    bestTime:
      "The best time to visit Diguisit Falls is during the rainy season (June to October) when the water flow is at its peak. However, be cautious of potential flash floods during heavy rains. Early morning visits are recommended for the best lighting for photography.",
  },
];

const faqs = [
  {
    question: "What's the best time to visit Central Aurora?",
    answer:
      "The best time to visit Central Aurora is during the dry season, from November to April. This period offers the most favorable weather for outdoor activities and beach experiences.",
  },
  {
    question: "How do I get to Central Aurora?",
    answer:
      "You can reach Central Aurora by bus from Manila, which takes about 5-6 hours. Alternatively, you can drive or hire a private car for more flexibility in your travel plans.",
  },
  {
    question: "What are the must-visit attractions in Central Aurora?",
    answer:
      "Some must-visit attractions include Sabang Beach for surfing, Dicasalarin Cove for its pristine beauty, Ditumabo Mother Falls for nature lovers, and the historical Baler Church.",
  },
  {
    question: "Is Central Aurora suitable for family trips?",
    answer:
      "Yes, Central Aurora offers a variety of activities suitable for families, including beach outings, historical sites, and nature trips. Many resorts also offer family-friendly accommodations and facilities.",
  },
  {
    question: "What should I pack for a trip to Central Aurora?",
    answer:
      "Pack light, breathable clothing, swimwear, sunscreen, insect repellent, and comfortable walking shoes. If you plan to surf, you might want to bring your own gear, though rentals are available.",
  },
];

function HotelListingComponent() {
  const [filteredHotels, setFilteredHotels] = useState(hotels);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortOption, setSortOption] = useState("rating");
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [amenitiesDropdownOpen, setAmenitiesDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openAccordionItem, setOpenAccordionItem] = useState(null);
  const hotelsPerPage = 4;

  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const faqRef = useRef(null);
  const attractionsRef = useRef(null);
  const privacyPolicyRef = useRef(null);

  useEffect(() => {
    let result = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAmenities.length === 0 ||
          selectedAmenities.every((amenity) =>
            hotel.amenities.includes(amenity)
          ))
    );

    if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredHotels(result);
    setCurrentPage(1);
  }, [searchTerm, selectedAmenities, sortOption]);

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleAllAmenities = (checked) => {
    if (checked) {
      setSelectedAmenities(amenitiesOptions.map((amenity) => amenity.value));
    } else {
      setSelectedAmenities([]);
    }
  };

  const openHotelDetails = (hotel) => {
    setSelectedHotel(hotel);
    setModalOpen(true);
  };

  const closeHotelDetails = () => {
    setSelectedHotel(null);
    setModalOpen(false);
  };

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-cyan-200">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Central Aurora Explorer
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => scrollToSection(aboutRef)}
              className="px-4 py-2 text-gray-600 hover:text-teal-600"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="px-4 py-2 text-gray-600 hover:text-teal-600"
            >
              Contact
            </button>
            <button
              onClick={() => scrollToSection(faqRef)}
              className="px-4 py-2 text-gray-600 hover:text-teal-600"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToSection(attractionsRef)}
              className="px-4 py-2 text-gray-600 hover:text-teal-600"
            >
              Attractions
            </button>
            <button
              onClick={() => scrollToSection(privacyPolicyRef)}
              className="px-4 py-2 text-gray-600 hover:text-teal-600"
            >
              Privacy Policy
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Discover Central Aurora
          </h2>
          <p className="text-xl text-gray-600">
            Find your perfect stay in the heart of Aurora
          </p>
        </motion.div>
        <div className="mb-8 overflow-hidden bg-white rounded-lg shadow-md">
          <div className="p-0 relative">
            <img
              src="./image/DD.png"
              alt="Explore Central Aurora"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center"></div>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 flex flex-wrap gap-4 items-center justify-between bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search Hotels
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">
              Amenities
            </label>
            <div className="relative">
              <button
                onClick={() => setAmenitiesDropdownOpen(!amenitiesDropdownOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Select Amenities
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2" />
              </button>
              {amenitiesDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="p-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedAmenities.length === amenitiesOptions.length
                        }
                        onChange={(e) => toggleAllAmenities(e.target.checked)}
                        className="mr-2"
                      />
                      Select All
                    </label>
                  </div>
                  <hr />
                  {amenitiesOptions.map((amenity) => (
                    <div key={amenity.value} className="p-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.value)}
                          onChange={() => toggleAmenity(amenity.value)}
                          className="mr-2"
                        />
                        <amenity.icon className="mr-2 h-4 w-4" />
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700"
            >
              Sort By
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="rating">Rating (High to Low)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className="min-w-[120px] px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
          >
            {showMap ? "Hide Map" : "Show Map"}
            <Map className="ml-2 h-4 w-4 inline" />
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {showMap ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8 bg-white p-4 rounded-lg shadow-md"
            >
              <div className="relative w-full aspect-[16/9] bg-white rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.9999999999995!2d121.56000000000002!3d15.760000000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c00000000001%3A0x0000000000000000!2sBaler%2C%20Aurora%2C%20Philippines!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md">
                  <p className="text-sm font-semibold">Central Aurora Region</p>
                  <p className="text-xs text-gray-600">
                    Showing {filteredHotels.length} hotels
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                {currentHotels.length > 0 ? (
                  currentHotels.map((hotel, index) => (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="p-0">
                          <div className="relative">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
                              ₱{hotel.price}/night
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center mt-2">
                            <Star className="h-5 w-5 text-yellow-400 mr-1" />
                            {hotel.rating.toFixed(1)}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {hotel.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity) => {
                              const amenityOption = amenitiesOptions.find(
                                (a) => a.value === amenity
                              );
                              if (amenityOption) {
                                return (
                                  <span
                                    key={amenity}
                                    className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center"
                                  >
                                    <amenityOption.icon className="h-3 w-3 mr-1" />
                                    {amenityOption.label}
                                  </span>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                        <div className="p-4 border-t border-gray-200">
                          <button
                            className="w-full px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
                            onClick={() => openHotelDetails(hotel)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-xl font-semibold text-gray-600">
                      No hotels found matching your criteria.
                    </p>
                    <p className="text-gray-500 mt-2">
                      Try adjusting your filters or search terms.
                    </p>
                  </div>
                )}
              </motion.div>
              <div className="flex justify-center gap-2">
                {Array.from(
                  { length: Math.ceil(filteredHotels.length / hotelsPerPage) },
                  (_, i) => (
                    <button
                      key={i + 1}
                      className={`px-4 py-2 rounded ${
                        currentPage === i + 1
                          ? "bg-teal-600 text-white"
                          : "bg-white text-teal-600 hover:bg-teal-100"
                      }`}
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </AnimatePresence>

        <section ref={aboutRef} className="py-12">
          <h2 className="text-3xl font-bold mb-6">
            About Central Aurora Explorer
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p>
                Central Aurora Explorer is dedicated to showcasing the beauty
                and wonders of Aurora Province, Philippines. Our mission is to
                provide travelers with comprehensive information and resources
                to explore this stunning region, from its pristine beaches to
                its lush forests and rich cultural heritage.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Our Story</h3>
              <p>
                Founded in 2020 by a group of passionate local travelers,
                Central Aurora Explorer began as a small blog sharing hidden
                gems and travel tips about Aurora. As our community grew, we
                expanded our services to become a one-stop platform for all
                things Aurora, partnering with local businesses and tour
                operators to provide the best experience for our visitors.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Our Team</h3>
              <p>
                Our team consists of local experts, travel enthusiasts, and tech
                professionals who are committed to promoting sustainable tourism
                in Aurora. We work closely with local communities to ensure that
                our activities benefit both travelers and residents alike.
              </p>
            </div>
          </div>
        </section>

        <section ref={contactRef} className="py-12">
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        placeholder="Your message"
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                        focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Contact Information
                </h3>
                <address className="not-italic">
                  <p>123 Explorer Street</p>
                  <p>Baler, Aurora</p>
                  <p>Philippines</p>
                  <p className="mt-4">Phone: +63 123 456 7890</p>
                  <p>Email: info@centralaurora.com</p>
                </address>
              </div>
            </div>
          </div>
        </section>

        <section ref={faqRef} className="py-12">
          <h2 className="text-3xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Common Questions About Central Aurora
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-md"
                  >
                    <button
                      onClick={() =>
                        setOpenAccordionItem(
                          openAccordionItem === index ? null : index
                        )
                      }
                      className="w-full px-4 py-2 text-left font-medium focus:outline-none"
                    >
                      {faq.question}
                    </button>
                    {openAccordionItem === index && (
                      <div className="px-4 py-2 bg-gray-50">{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section ref={attractionsRef} className="py-12">
          <h2 className="text-3xl font-bold mb-6">Popular Attractions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {attractions.map((attraction) => (
              <div
                key={attraction.name}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 flex items-center">
                    <attraction.icon className="h-6 w-6 mr-2 text-teal-600" />
                    {attraction.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {attraction.description}
                  </p>
                  <h4 className="font-semibold mb-2">Activities:</h4>
                  <ul className="list-disc pl-5 mb-4">
                    {attraction.activities.map((activity, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {activity}
                      </li>
                    ))}
                  </ul>
                  {attraction.bestTime && (
                    <>
                      <h4 className="font-semibold mb-2">
                        Best Time to Visit:
                      </h4>
                      <p className="text-sm text-gray-600">
                        {attraction.bestTime}
                      </p>
                    </>
                  )}
                  {attraction.howToGetThere && (
                    <>
                      <h4 className="font-semibold mb-2">How to Get There:</h4>
                      <p className="text-sm text-gray-600">
                        {attraction.howToGetThere}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section ref={privacyPolicyRef} className="py-12">
          <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  1. Information We Collect
                </h3>
                <p>
                  We collect information you provide directly to us, such as
                  when you create an account, make a booking, or contact us for
                  support. This may include your name, email address, phone
                  number, and payment information.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  2. How We Use Your Information
                </h3>
                <p>
                  We use the information we collect to provide, maintain, and
                  improve our services, to process your bookings, to communicate
                  with you, and to personalize your experience on our platform.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  3. Information Sharing and Disclosure
                </h3>
                <p>
                  We do not sell or rent your personal information to third
                  parties. We may share your information with our service
                  providers, partners, and as required by law.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">4. Data Security</h3>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect the security of your personal information against
                  unauthorized access, disclosure, alteration, and destruction.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">5. Your Rights</h3>
                <p>
                  You have the right to access, correct, or delete your personal
                  information. You may also have the right to restrict or object
                  to certain processing of your data.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">About Us</h4>
              <p className="text-sm text-gray-600">
                Central Aurora Explorer is your gateway to discovering the
                beauty and adventure of Aurora Province, Philippines.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection(aboutRef)}
                    className="text-sm text-gray-600 hover:text-teal-600"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(contactRef)}
                    className="text-sm text-gray-600 hover:text-teal-600"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(faqRef)}
                    className="text-sm text-gray-600 hover:text-teal-600"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection(privacyPolicyRef)}
                    className="text-sm text-gray-600 hover:text-teal-600"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="text-sm text-gray-600 not-italic">
                <p>123 Explorer Street</p>
                <p>Baler, Aurora</p>
                <p>Philippines</p>
                <p className="mt-2">Phone: +63 123 456 7890</p>
                <p>Email: info@centralaurora.com</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; 2024 Central Aurora Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {modalOpen && selectedHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <button
              onClick={closeHotelDetails}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedHotel.name}</h2>
            <p className="text-gray-600 mb-4">{selectedHotel.location}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedHotel.image}
                  alt={selectedHotel.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-gray-600">
                    {selectedHotel.description}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHotel.amenities.map((amenity) => {
                      const amenityOption = amenitiesOptions.find(
                        (a) => a.value === amenity
                      );
                      if (amenityOption) {
                        return (
                          <span
                            key={amenity}
                            className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center"
                          >
                            <amenityOption.icon className="h-3 w-3 mr-1" />
                            {amenityOption.label}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Hotel Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-teal-600" />
                        <span>
                          Check-in: {selectedHotel.checkIn} | Check-out:{" "}
                          {selectedHotel.checkOut}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-teal-600" />
                        <span>{selectedHotel.contact.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-teal-600" />
                        <span>{selectedHotel.contact.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 mr-2 text-teal-600" />
                        <a
                          href={selectedHotel.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelListingComponent;
