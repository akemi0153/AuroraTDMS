import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export default function Services() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rentals Section */}
        <div className="space-y-6">
          <h3 className="font-medium text-lg">Rentals</h3>
          {[
            { id: "videokeRental", label: "Videoke Rental" },
            { id: "atvRental", label: "ATV Rental" },
            { id: "bicycleRental", label: "Bicycle Rental" },
            { id: "motorcycleRental", label: "Motorcycle Rental" },
          ].map((rental) => (
            <div
              key={rental.id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id={rental.id}
                  {...register(`${rental.id}.checked`)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={rental.id} className="text-sm font-medium">
                  {rental.label}
                </label>
              </div>
              <div className="flex space-x-4">
                <Input
                  type="number"
                  placeholder="Availability"
                  {...register(`${rental.id}.availability`, {
                    valueAsNumber: true,
                  })}
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Price"
                  {...register(`${rental.id}.price`, { valueAsNumber: true })}
                  className="w-1/2"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Parking Space / Campsite Area Section */}
        <div className="space-y-6">
          <h3 className="font-medium text-lg">Parking Space / Campsite Area</h3>
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <label className="block mb-2 text-sm font-medium">
              Parking Space
            </label>
            <div className="flex space-x-4">
              <Input
                type="number"
                placeholder="Capacity"
                {...register("parkingSpace.capacity", { valueAsNumber: true })}
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Price"
                {...register("parkingSpace.price", { valueAsNumber: true })}
                className="w-1/2"
              />
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-white shadow-sm">
            <label className="block mb-2 text-sm font-medium">
              Campsite Area
            </label>
            <div className="flex space-x-4">
              <Input
                type="number"
                placeholder="Capacity"
                {...register("campsiteArea.capacity", { valueAsNumber: true })}
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Price"
                {...register("campsiteArea.price", { valueAsNumber: true })}
                className="w-1/2"
              />
            </div>
          </div>
        </div>

        {/* Common Areas Section */}
        <div className="space-y-6">
          <h3 className="font-medium text-lg">Common Areas</h3>
          {[
            { id: "commonKitchen", label: "Common Kitchen" },
            { id: "commonSink", label: "Common Sink" },
            { id: "commonGrillingSite", label: "Common Grilling Site" },
            { id: "commonBathroom", label: "Common Bathroom" },
            { id: "commonRestroom", label: "Common Restroom" },
            { id: "openShower", label: "Open Shower" },
          ].map((area) => (
            <div
              key={area.id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <label className="block mb-2 text-sm font-medium">
                {area.label}
              </label>
              <div className="flex space-x-4">
                <Input
                  type="number"
                  placeholder="Number"
                  {...register(`${area.id}.number`, { valueAsNumber: true })}
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Charge"
                  {...register(`${area.id}.charge`, { valueAsNumber: true })}
                  className="w-1/2"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Promotions and Discounts */}
        <div className="space-y-6">
          <h3 className="font-medium text-lg">Promotions and Discounts</h3>
          {[
            { id: "packages", label: "Packages" },
            { id: "advanceBooking", label: "Advance Booking" },
            { id: "summerPromo", label: "Summer Promo" },
            { id: "holidayPromo", label: "Holiday Promo" },
            { id: "returnClientRate", label: "Return Client Rate" },
          ].map((promo) => (
            <div key={promo.id} className="p-2">
              <input
                type="checkbox"
                id={promo.id}
                {...register(`promotions.${promo.id}`)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor={promo.id} className="ml-2 text-sm font-medium">
                {promo.label}
              </label>
            </div>
          ))}

          {/* Discounts */}
          {[
            { id: "corporateRate", label: "Corporate Rate" },
            { id: "governmentDiscount", label: "Government Discount" },
            { id: "seniorDiscount", label: "Senior Discount" },
            { id: "othersSpecify", label: "Others, Specify" },
          ].map((discount) => (
            <div
              key={discount.id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={discount.id}
                  {...register(`promotions.${discount.id}.checked`)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor={discount.id} className="text-sm font-medium">
                  {discount.label}
                </label>
              </div>
              <Input
                type="number"
                placeholder="Discount Amount"
                {...register(`promotions.${discount.id}.amount`, {
                  valueAsNumber: true,
                })}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
