"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Star, Coffee, Wifi, Dumbbell, Search, Map, LifeBuoy, Sparkles, Car, ChevronDown, Calendar, Sun, Waves, Mountain, Users, Phone, Mail, Globe, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const hotels = [
  {
    id: 1,
    name: "Costa Pacifica",
    rating: 4.5,
    price: 8250,
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/bb/65/a8/costa-pacifica.jpg?w=1200&h=-1&s=1",
    location: "Baler, Aurora",
    amenities: ["wifi", "gym", "restaurant", "pool", "spa"],
    description: "Luxurious beachfront resort with stunning ocean views and world-class amenities.",
    reviews: [
      { id: 1, user: "John D.", rating: 5, comment: "Absolutely stunning resort with impeccable service!" },
      { id: 2, user: "Sarah M.", rating: 4, comment: "Beautiful location, but the food could be better." },
      { id: 3, user: "Mike R.", rating: 5, comment: "Perfect getaway spot. Will definitely come back!" },
    ],
    contact: {
      phone: "+63 2 8519 4249",
      email: "info@costapacificabaler.com",
      website: "https://www.costapacificabaler.com",
    },
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: 2,
    name: "Bay's Inn Resort",
    rating: 4.2,
    price: 6600,
    image:
      "https://pix8.agoda.net/property/60263241/0/ea45117c4c9930d33d6b9749a4a5055c.jpeg?ce=0&s=1024x",
    location: "Baler, Aurora",
    amenities: ["wifi", "restaurant", "parking"],
    description: "Cozy beachfront resort offering comfortable accommodations and easy access to Sabang Beach.",
    reviews: [
      { id: 1, user: "Emily L.", rating: 4, comment: "Great location and friendly staff. Rooms are basic but clean." },
      { id: 2, user: "David K.", rating: 5, comment: "Excellent value for money. The restaurant serves delicious local cuisine." },
    ],
    contact: {
      phone: "+63 919 991 3075",
      email: "baysinnresort@gmail.com",
      website: "https://www.baysinnresort.com",
    },
    checkIn: "2:00 PM",
    checkOut: "12:00 PM",
  },
  {
    id: 3,
    name: "Aliya Surf Camp",
    rating: 4.0,
    price: 5500,
    image:
      "https://media-cdn.tripadvisor.com/media/photo-s/12/a7/3f/e8/img-20180324-064351-largejpg.jpg",
    location: "Baler, Aurora",
    amenities: ["wifi", "parking", "restaurant"],
    description: "Laid-back surf camp offering surf lessons, board rentals, and beachfront accommodations.",
    reviews: [
      { id: 1, user: "Alex S.", rating: 4, comment: "Great spot for surfing enthusiasts. Instructors are knowledgeable and friendly." },
      { id: 2, user: "Lisa M.", rating: 3, comment: "Basic accommodations, but perfect for those focused on surfing." },
    ],
    contact: {
      phone: "+63 917 794 7749",
      email: "aliyasurfcamp@gmail.com",
      website: "https://www.aliyasurfcamp.com",
    },
    checkIn: "1:00 PM",
    checkOut: "11:00 AM",
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
    description: "A 2-kilometer stretch of gray sand beach known for its surfing waves. Perfect for beginners and experienced surfers alike.",
    icon: Waves,
  },
  {
    name: "Dicasalarin Cove",
    description: "A secluded white sand beach surrounded by rolling hills. Offers breathtaking views and is ideal for swimming and picnics.",
    icon: Sun,
  },
  {
    name: "Diguisit Falls",
    description: "A series of cascading waterfalls surrounded by lush greenery. A great spot for nature lovers and photographers.",
    icon: Mountain,
  },
];

function HotelListingComponent() {
  const [filteredHotels, setFilteredHotels] = useState(hotels);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortOption, setSortOption] = useState("rating");
  const [showMap, setShowMap] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: addDays(new Date(), 7) });
  const [selectedHotel, setSelectedHotel] = useState(null);
  const hotelsPerPage = 4;

  useEffect(() => {
    let result = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAmenities.length === 0 || selectedAmenities.every((amenity) => hotel.amenities.includes(amenity)))
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
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

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
  };

  const closeHotelDetails = () => {
    setSelectedHotel(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "Scheduled":
        return "bg-blue-500";
      case "Pending Approval":
        return "bg-yellow-500";
      case "Overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
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
            <Link href="/about"><Button variant="ghost">About</Button></Link>
            <Link href="/contact"><Button variant="ghost">Contact</Button></Link>
            <Link href="/faq"><Button variant="ghost">FAQ</Button></Link>
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

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 flex flex-wrap gap-4 items-center justify-between bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="search">Search Hotels</Label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label>Amenities</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Select Amenities
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Amenities</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedAmenities.length === amenitiesOptions.length}
                  onCheckedChange={toggleAllAmenities}
                >
                  Select All
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {amenitiesOptions.map((amenity) => (
                  <DropdownMenuCheckboxItem
                    key={amenity.value}
                    checked={selectedAmenities.includes(amenity.value)}
                    onCheckedChange={() => toggleAmenity(amenity.value)}
                  >
                    <amenity.icon className="mr-2 h-4 w-4" />
                    {amenity.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="sort">Sort By</Label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label>Check-in / Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowMap(!showMap)}
            className="min-w-[120px]"
          >
            {showMap ? "Hide Map" : "Show Map"}
            <Map className="ml-2 h-4 w-4" />
          </Button>
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
                  <p className="text-xs text-muted-foreground">
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
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                        <CardHeader className="p-0">
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
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle>{hotel.name}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Star className="h-5 w-5 text-yellow-400 mr-1" />
                            {hotel.rating.toFixed(1)}
                          </CardDescription>
                          <p className="text-sm text-gray-600 mt-2">{hotel.description}</p>
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
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={() => openHotelDetails(hotel)}>
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-xl font-semibold text-gray-600">No hotels found matching your criteria.</p>
                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </motion.div>
              <div className="flex justify-center gap-2">
                {Array.from(
                  { length: Math.ceil(filteredHotels.length / hotelsPerPage) },
                  (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => paginate(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  )
                )}
              </div>
            </>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Popular Attractions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {attractions.map((attraction) => (
              <Card key={attraction.name}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <attraction.icon className="h-6 w-6 mr-2 text-teal-600" />
                    {attraction.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {attraction.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/attractions/${attraction.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="outline">Learn More</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Central Aurora?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Pristine Beaches", icon: Sun, description: "Miles of untouched coastline perfect for surfing and relaxation." },
              { title: "Rich Culture", icon: Users, description: "Experience the warm hospitality and traditions of Aurora." },
              { title: "Adventure Sports", icon: Mountain, description: "From surfing to trekking, adventure awaits at every corner." },
              { title: "Natural Wonders", icon: Sparkles, description: "Explore waterfalls, caves, and lush forests in this natural paradise." },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <item.icon className="h-6 w-6 mr-2 text-teal-600" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="bg-white py-8 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Central Aurora Explorer. All rights reserved.</p>
        </div>
      </footer>

      <Dialog open={selectedHotel !== null} onOpenChange={closeHotelDetails}>
        <DialogContent className="max-w-4xl">
          {selectedHotel && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedHotel.name}</DialogTitle>
                <DialogDescription>{selectedHotel.location}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-64 object-cover rounded-lg" />
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedHotel.description}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedHotel.amenities.map((amenity) => {
                        const amenityOption = amenitiesOptions.find((a) => a.value === amenity);
                        if (amenityOption) {
                          return (
                            <span key={amenity} className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
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
                  <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details">
                      <Card>
                        <CardHeader>
                          <CardTitle>Hotel Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-2 text-teal-600" />
                            <span>Check-in: {selectedHotel.checkIn} | Check-out: {selectedHotel.checkOut}</span>
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
                            <a href={selectedHotel.contact.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                              Visit Website
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="reviews">
                      <Card>
                        <CardHeader>
                          <CardTitle>Guest Reviews</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {selectedHotel.reviews.map((review) => (
                              <div key={review.id} className="border-b pb-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarFallback>{review.user[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold">{review.user}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                    <span>{review.rating}</span>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="location">
                      <Card>
                        <CardHeader>
                          <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-w-16 aspect-h-9">
                            <iframe
                              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.9999999999995!2d121.56000000000002!3d15.760000000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c00000000001%3A0x0000000000000000!2s${encodeURIComponent(selectedHotel.name)}%2C%20Baler%2C%20Aurora%2C%20Philippines!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus`}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              <div className="mt-6">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Book Now</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HotelListingComponent;

