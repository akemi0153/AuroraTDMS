import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function Cottages() {
  const { register, control, watch } = useFormContext();

  // Using useFieldArray for dynamic fields
  const { fields: acCottageFields, append: appendAcCottage } = useFieldArray({
    control,
    name: "acCottages",
  });

  const { fields: nonAcCottageFields, append: appendNonAcCottage } =
    useFieldArray({
      control,
      name: "nonAcCottages",
    });

  const { fields: tentFields, append: appendTent } = useFieldArray({
    control,
    name: "tents",
  });

  return (
    <TabsContent value="cottages">
      <div className="space-y-8">
        {/* Air-Conditioned Cottages/Villas */}
        <div className="space-y-4">
          <h3 className="font-medium">Air-Conditioned Cottages/Villas</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size/Bed Size</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amenities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acCottageFields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Input {...register(`acCottages.${index}.name`)} />
                  </TableCell>
                  <TableCell>
                    <Input {...register(`acCottages.${index}.size`)} />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`acCottages.${index}.capacity`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`acCottages.${index}.rate`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input {...register(`acCottages.${index}.amenities`)} />
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
              appendAcCottage({
                name: "",
                size: "",
                capacity: "",
                rate: "",
                amenities: "",
              })
            }
          >
            Add AC Cottage
          </Button>
        </div>

        {/* Non-Aircon Cottages/Villas */}
        <div className="space-y-4">
          <h3 className="font-medium">Non-Aircon Cottages/Villas</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size/Bed Size</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amenities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonAcCottageFields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Input {...register(`nonAcCottages.${index}.name`)} />
                  </TableCell>
                  <TableCell>
                    <Input {...register(`nonAcCottages.${index}.size`)} />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`nonAcCottages.${index}.capacity`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`nonAcCottages.${index}.rate`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input {...register(`nonAcCottages.${index}.amenities`)} />
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
              appendNonAcCottage({
                name: "",
                size: "",
                capacity: "",
                rate: "",
                amenities: "",
              })
            }
          >
            Add Non-AC Cottage
          </Button>
        </div>

        {/* Tents */}
        <div className="space-y-4">
          <h3 className="font-medium">Tents</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size/Bed Size</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Amenities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tentFields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell>
                    <Input {...register(`tents.${index}.name`)} />
                  </TableCell>
                  <TableCell>
                    <Input {...register(`tents.${index}.size`)} />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      {...register(`tents.${index}.capacity`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input type="number" {...register(`tents.${index}.rate`)} />
                  </TableCell>
                  <TableCell>
                    <Input {...register(`tents.${index}.amenities`)} />
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
              appendTent({
                name: "",
                size: "",
                capacity: "",
                rate: "",
                amenities: "",
              })
            }
          >
            Add Tent
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
