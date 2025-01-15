"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function Services() {
  const { register, setValue } = useFormContext();
  const [selectedRentals, setSelectedRentals] = useState([]);

  const rentals = [
    { id: "videokeRental", label: "Videoke Rental" },
    { id: "atvRental", label: "ATV Rental" },
    { id: "bicycleRental", label: "Bicycle Rental" },
    { id: "motorcycleRental", label: "Motorcycle Rental" },
  ];

  const commonAreas = [
    { id: "commonKitchen", label: "Common Kitchen" },
    { id: "commonSink", label: "Common Sink" },
    { id: "commonGrillingSite", label: "Common Grilling Site" },
    { id: "commonBathroom", label: "Common Bathroom" },
    { id: "commonRestroom", label: "Common Restroom" },
    { id: "openShower", label: "Open Shower" },
  ];

  const promotions = [
    { id: "packages", label: "Packages" },
    { id: "advanceBooking", label: "Advance Booking" },
    { id: "summerPromo", label: "Summer Promo" },
    { id: "holidayPromo", label: "Holiday Promo" },
    { id: "returnClientRate", label: "Return Client Rate" },
  ];

  const discounts = [
    { id: "corporateRate", label: "Corporate Rate" },
    { id: "governmentDiscount", label: "Government Discount" },
    { id: "seniorDiscount", label: "Senior Discount" },
    { id: "othersSpecify", label: "Others, Specify" },
  ];

  const handleRentalSelect = (value) => {
    if (!selectedRentals.includes(value)) {
      setSelectedRentals([...selectedRentals, value]);
      setValue(`rentals.${value}.checked`, true);
    }
  };

  const handleRentalRemove = (value) => {
    setSelectedRentals(selectedRentals.filter((rental) => rental !== value));
    setValue(`rentals.${value}.checked`, false);
    setValue(`rentals.${value}.availability`, undefined);
    setValue(`rentals.${value}.price`, undefined);
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Rentals Section */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg mb-2">Rentals</h3>
          <div className="p-3 border rounded-lg bg-white shadow-sm space-y-2">
            <Select onValueChange={handleRentalSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select rentals" />
              </SelectTrigger>
              <SelectContent>
                {rentals.map((rental) => (
                  <SelectItem key={rental.id} value={rental.id}>
                    {rental.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-2 mt-2">
              {selectedRentals.map((rentalId) => {
                const rental = rentals.find((r) => r.id === rentalId);
                return (
                  <div key={rentalId} className="p-2 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {rental?.label}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRentalRemove(rentalId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Availability"
                        className="w-1/2 text-sm"
                        {...register(`rentals.${rentalId}.availability`, {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        className="w-1/2 text-sm"
                        {...register(`rentals.${rentalId}.price`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Parking Space / Campsite Area Section */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg mb-2">
            Parking Space / Campsite Area
          </h3>
          <div className="p-3 border rounded-lg bg-white shadow-sm space-y-2">
            <label className="block text-sm font-medium">Parking Space</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Capacity"
                className="w-1/2 text-sm"
                {...register("parkingSpace.capacity", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Price"
                className="w-1/2 text-sm"
                {...register("parkingSpace.price", { valueAsNumber: true })}
              />
            </div>
          </div>
          <div className="p-3 border rounded-lg bg-white shadow-sm space-y-2">
            <label className="block text-sm font-medium">Campsite Area</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Capacity"
                className="w-1/2 text-sm"
                {...register("campsiteArea.capacity", { valueAsNumber: true })}
              />
              <Input
                type="number"
                placeholder="Price"
                className="w-1/2 text-sm"
                {...register("campsiteArea.price", { valueAsNumber: true })}
              />
            </div>
          </div>
        </section>

        {/* Common Areas Section */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg mb-2">Common Areas</h3>
          {commonAreas.map((area) => (
            <div
              key={area.id}
              className="p-3 border rounded-lg bg-white shadow-sm space-y-2"
            >
              <label className="block text-sm font-medium">{area.label}</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Number"
                  className="w-1/2 text-sm"
                  {...register(`${area.id}.number`, { valueAsNumber: true })}
                />
                <Input
                  type="number"
                  placeholder="Charge"
                  className="w-1/2 text-sm"
                  {...register(`${area.id}.charge`, { valueAsNumber: true })}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Promotions and Discounts */}
        <section className="space-y-4">
          <h3 className="font-semibold text-lg mb-2">
            Promotions and Discounts
          </h3>
          <div className="p-3 border rounded-lg bg-white shadow-sm space-y-3">
            <h4 className="font-medium text-sm mb-2">Promotions</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {promotions.map((promo) => (
                <div key={promo.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={promo.id}
                    {...register(`promotions.${promo.id}`)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={promo.id} className="text-sm">
                    {promo.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Discounts</h4>
            {discounts.map((discount) => (
              <div
                key={discount.id}
                className="p-3 border rounded-lg bg-white shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={discount.id}
                      {...register(`promotions.${discount.id}.checked`)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={discount.id} className="text-sm">
                      {discount.label}
                    </label>
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="Discount Amount"
                  {...register(`promotions.${discount.id}.amount`, {
                    valueAsNumber: true,
                  })}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
