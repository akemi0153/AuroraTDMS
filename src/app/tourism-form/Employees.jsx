import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

export default function Employees() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="font-medium text-lg">Employees</h3>
      <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Local Male</label>
            <Input
              type="number"
              placeholder="Number of Local Male Employees"
              {...register("localmaleNum", { valueAsNumber: true })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Local Female</label>
            <Input
              type="number"
              placeholder="Number of Local Female Employees"
              {...register("localfemaleNum", { valueAsNumber: true })}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Foreign Male</label>
            <Input
              type="number"
              placeholder="Number of Foreign Male Employees"
              {...register("foreignmaleNum", { valueAsNumber: true })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Foreign Female</label>
            <Input
              type="number"
              placeholder="Number of Foreign Female Employees"
              {...register("foreignfemaleNum", { valueAsNumber: true })}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
