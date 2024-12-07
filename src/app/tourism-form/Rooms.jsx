"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext, useFieldArray } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";

export default function Rooms() {
  const { register, control } = useFormContext();
  const { fields: acRoomFields, append: appendAcRoom } = useFieldArray({
    control,
    name: "acRooms",
  });

  const { fields: fanRoomFields, append: appendFanRoom } = useFieldArray({
    control,
    name: "fanRooms",
  });

  return (
    <TabsContent value="rooms">
      <div className="space-y-4">
        <h3 className="font-medium">Air Conditioned Rooms</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Number of Rooms</TableHead>
              <TableHead>Bed Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Amenities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acRoomFields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Input {...register(`acRooms.${index}.type`)} />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...register(`acRooms.${index}.number`)}
                  />
                </TableCell>
                <TableCell>
                  <Input {...register(`acRooms.${index}.bedType`)} />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...register(`acRooms.${index}.capacity`)}
                  />
                </TableCell>
                <TableCell>
                  <Input type="number" {...register(`acRooms.${index}.rate`)} />
                </TableCell>
                <TableCell>
                  <Input {...register(`acRooms.${index}.amenities`)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() =>
            appendAcRoom({
              type: "",
              number: 0,
              bedType: "",
              capacity: 0,
              rate: 0,
              amenities: "",
            })
          }
        >
          Add AC Room
        </Button>
      </div>
      <div className="space-y-4 mt-8">
        <h3 className="font-medium">Fan Rooms</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Type</TableHead>
              <TableHead>Number of Rooms</TableHead>
              <TableHead>Bed Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Amenities</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fanRoomFields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Input {...register(`fanRooms.${index}.type`)} />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...register(`fanRooms.${index}.number`)}
                  />
                </TableCell>
                <TableCell>
                  <Input {...register(`fanRooms.${index}.bedType`)} />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...register(`fanRooms.${index}.capacity`)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...register(`fanRooms.${index}.rate`)}
                  />
                </TableCell>
                <TableCell>
                  <Input {...register(`fanRooms.${index}.amenities`)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() =>
            appendFanRoom({
              type: "",
              number: 0,
              bedType: "",
              capacity: 0,
              rate: 0,
              amenities: "",
            })
          }
        >
          Add Fan Room
        </Button>
      </div>
    </TabsContent>
  );
}
