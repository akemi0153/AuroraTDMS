import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function BasicInfo() {
  const { register, setValue } = useFormContext();

  const handleSelectChange = (value, name) => {
    setValue(name, value);
  };

  return (
    <TabsContent value="basic" className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="municipality">Municipality</Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange(value, "municipality")
                }
              >
                <SelectTrigger id="municipality">
                  <SelectValue placeholder="Select Municipality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baler">Baler</SelectItem>
                  <SelectItem value="San Luis">San Luis</SelectItem>
                  <SelectItem value="Maria Aurora">Maria Aurora</SelectItem>
                  <SelectItem value="Dipaculao">Dipaculao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="establishmentName">Establishment Name</Label>
              <Input
                id="establishmentName"
                placeholder="Enter establishment name"
                {...register("establishmentName", {
                  required: "Establishment name is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Input
                id="businessAddress"
                placeholder="Enter business address"
                {...register("businessAddress", {
                  required: "Business address is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                placeholder="Enter contact number"
                type="tel"
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9+]*$/,
                    message: "Invalid contact number format",
                  },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accreditationNumber">Accreditation Number</Label>
              <Input
                id="accreditationNumber"
                placeholder="Enter accreditation number"
                {...register("accreditationNumber", {
                  required: "Accreditation number is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input
                id="expirationDate"
                type="date"
                {...register("expirationDate", {
                  required: "Expiration date is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">LGU License Number</Label>
              <Input
                id="licenseNumber"
                placeholder="Enter LGU license number"
                {...register("licenseNumber", {
                  required: "LGU license number is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="Enter contact person's name"
                {...register("contactPerson", {
                  required: "Contact person is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="Enter designation"
                {...register("designation", {
                  required: "Designation is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address format",
                  },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                placeholder="Enter Facebook URL"
                {...register("facebook", {
                  required: "Facebook URL is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="Enter Instagram URL"
                {...register("instagram", {
                  required: "Instagram URL is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                placeholder="Enter Twitter URL"
                {...register("twitter", {
                  required: "Twitter URL is required",
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Other Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="Enter website URL"
                {...register("website", {
                  required: "Website is required",
                  pattern: {
                    value:
                      /^(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/,
                    message: "Invalid URL format. Example: https://example.com",
                  },
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bookingCompany">Booking Company</Label>
              <Input
                id="bookingCompany"
                placeholder="Enter booking company"
                {...register("bookingCompany", {
                  required: "Booking company is required",
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
