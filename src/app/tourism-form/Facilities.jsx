import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { useFormContext } from "react-hook-form";

export default function Facilities() {
  const { register } = useFormContext();

  return (
    <TabsContent value="facilities" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="font-medium">Dining Outlets</h3>
          <div className="space-y-4">
            <div className="border p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="restaurant"
                  {...register("diningOutlets.restaurant.checked")}
                />
                <label htmlFor="restaurant" className="text-sm font-medium">
                  Restaurant
                </label>
              </div>
              <Input
                type="number"
                placeholder="Capacity"
                {...register("diningOutlets.restaurant.capacity")}
                className="mt-2"
              />
            </div>

            <div className="border p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox id="bar" {...register("diningOutlets.bar.checked")} />
                <label htmlFor="bar" className="text-sm font-medium">
                  Bar/Cocktail Lounge
                </label>
              </div>
              <Input
                type="number"
                placeholder="Capacity"
                {...register("diningOutlets.bar.capacity")}
                className="mt-2"
              />
            </div>

            <div className="border p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="coffeeShop"
                  {...register("diningOutlets.coffeeShop.checked")}
                />
                <label htmlFor="coffeeShop" className="text-sm font-medium">
                  Coffee Shop
                </label>
              </div>
              <Input
                type="number"
                placeholder="Capacity"
                {...register("diningOutlets.coffeeShop.capacity")}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Conference/Convention</h3>
          <div className="space-y-4">
            {[
              "conventionHall",
              "conferenceHall",
              "functionHall",
              "meetingRoom",
            ].map((facility) => (
              <div key={facility} className="border p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={facility}
                    {...register(`conferenceConvention.${facility}.checked`)}
                  />
                  <label htmlFor={facility} className="text-sm font-medium">
                    {facility.split(/(?=[A-Z])/).join(" ")}
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    placeholder="Capacity"
                    {...register(`conferenceConvention.${facility}.capacity`)}
                  />
                  <Input
                    type="number"
                    placeholder="AC Price"
                    {...register(`conferenceConvention.${facility}.acPrice`)}
                  />
                  <Input
                    type="number"
                    placeholder="Non-AC Price"
                    {...register(`conferenceConvention.${facility}.nonAcPrice`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Marine Recreation</h3>
          <div className="space-y-4">
            {[
              "kayaking",
              "boardSurfing",
              "snorkeling",
              "paddleBoarding",
              "scubaDiving",
              "freeDiving",
              "kiteSurfing",
              "bananaBoat",
            ].map((activity) => (
              <div key={activity} className="border p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={activity}
                    {...register(`marineRecreation.${activity}.checked`)}
                  />
                  <label htmlFor={activity} className="text-sm font-medium">
                    {activity.split(/(?=[A-Z])/).join(" ")}
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Number of Equipment"
                    {...register(`marineRecreation.${activity}.quantity`)}
                  />
                  <Input
                    type="number"
                    placeholder="Price per Hour"
                    {...register(`marineRecreation.${activity}.price`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Sports Recreation</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="basketballCourt"
              {...register("sportsRecreation.basketballCourt")}
            />
            <label
              htmlFor="basketballCourt"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Basketball Court
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tennisCourt"
              {...register("sportsRecreation.tennisCourt")}
            />
            <label
              htmlFor="tennisCourt"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tennis Court
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="badmintonCourt"
              {...register("sportsRecreation.badmintonCourt")}
            />
            <label
              htmlFor="badmintonCourt"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Badminton Court
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="volleyballCourt"
              {...register("sportsRecreation.volleyballCourt")}
            />
            <label
              htmlFor="volleyballCourt"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Volleyball Court
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="beachVolleyball"
              {...register("sportsRecreation.beachVolleyball")}
            />
            <label
              htmlFor="beachVolleyball"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Beach Volleyball
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tableTennis"
              {...register("sportsRecreation.tableTennis")}
            />
            <label
              htmlFor="tableTennis"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Table Tennis
            </label>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium">Swimming Pools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Adult Pool</h4>
              <div className="space-y-2">
                <Input placeholder="Depth" {...register("adultPool.depth")} />
                <Input placeholder="Size" {...register("adultPool.size")} />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Childrens Pool</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Depth"
                  {...register("childrenPool.depth")}
                />
                <Input placeholder="Size" {...register("childrenPool.size")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
