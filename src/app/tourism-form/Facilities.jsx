import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

export default function Facilities() {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "marineRecreation"
  });

  const marineActivities = [
    "Kayaking",
    "Board Surfing",
    "Snorkeling",
    "Paddle Boarding",
    "Scuba Diving",
    "Free Diving",
    "Kite Surfing",
    "Banana Boat",
  ];

  return (
    <TabsContent value="facilities" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dining Outlets</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["restaurant", "bar", "coffeeShop"].map((outlet) => (
            <div key={outlet} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={outlet}
                  {...register(`diningOutlets.${outlet}.checked`)}
                />
                <label htmlFor={outlet} className="text-sm font-medium">
                  {outlet.charAt(0).toUpperCase() + outlet.slice(1)}
                </label>
              </div>
              <Input
                type="number"
                placeholder="Capacity"
                {...register(`diningOutlets.${outlet}.capacity`)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conference/Convention</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["conventionHall", "conferenceHall", "functionHall", "meetingRoom"].map((facility) => (
            <div key={facility} className="space-y-2">
              <div className="flex items-center space-x-2">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marine Recreation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {marineActivities.map((activity) => (
              <Button
                key={activity}
                variant="outline"
                size="sm"
                onClick={() => append({ activity, quantity: "", price: "" })}
                type="button"
              >
                {activity}
              </Button>
            ))}
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Input
                {...register(`marineRecreation.${index}.activity`)}
                defaultValue={field.activity}
                readOnly
              />
              <Input
                type="number"
                placeholder="Quantity"
                {...register(`marineRecreation.${index}.quantity`)}
              />
              <Input
                type="number"
                placeholder="Price per Hour"
                {...register(`marineRecreation.${index}.price`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove {field.activity}</span>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sports Recreation</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {["basketballCourt", "tennisCourt", "badmintonCourt", "volleyballCourt", "beachVolleyball", "tableTennis"].map((sport) => (
            <div key={sport} className="flex items-center space-x-2">
              <Checkbox
                id={sport}
                {...register(`sportsRecreation.${sport}`)}
              />
              <label htmlFor={sport} className="text-sm font-medium">
                {sport.split(/(?=[A-Z])/).join(" ")}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Swimming Pools</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["adultPool", "childrenPool"].map((pool) => (
            <div key={pool} className="space-y-2">
              <h4 className="text-sm font-medium">{pool.split(/(?=[A-Z])/).join(" ")}</h4>
              <Input placeholder="Depth" {...register(`${pool}.depth`)} />
              <Input placeholder="Size" {...register(`${pool}.size`)} />
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

