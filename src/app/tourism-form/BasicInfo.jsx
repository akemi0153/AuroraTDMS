import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { useFormContext } from "react-hook-form";

export default function BasicInfo() {
  const { register } = useFormContext();

  return (
    <TabsContent value="basic" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="municipality"
            className="block text-sm font-medium text-gray-700"
          >
            Municipality
          </label>
          <select
            id="municipality"
            {...register("municipality", {
              required: "Municipality is required",
            })}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Municipality</option>
            <option value="Baler">Baler</option>
            <option value="San Luis">San Luis</option>
            <option value="Maria Aurora">Maria Aurora</option>
            <option value="Dipaculao">Dipaculao</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="establishmentName"
            className="block text-sm font-medium text-gray-700"
          >
            Establishment Name
          </label>
          <Input
            id="establishmentName"
            placeholder="Enter establishment name"
            {...register("establishmentName", {
              required: "Establishment name is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="businessAddress"
            className="block text-sm font-medium text-gray-700"
          >
            Business Address
          </label>
          <Input
            id="businessAddress"
            placeholder="Enter business address"
            {...register("businessAddress", {
              required: "Business address is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="contactNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Number
          </label>
          <Input
            id="contactNumber"
            placeholder="Enter contact number"
            type="text"
            {...register("contactNumber", {
              required: "Contact number is required",
              pattern: {
                value: /^[0-9+]*$/,
                message: "Invalid contact number format",
              },
            })}
          />
        </div>
        <div>
          <label
            htmlFor="accreditationNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Accreditation Number
          </label>
          <Input
            id="accreditationNumber"
            placeholder="Enter accreditation number"
            {...register("accreditationNumber", {
              required: "Accreditation number is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="expirationDate"
            className="block text-sm font-medium text-gray-700"
          >
            Expiration Date
          </label>
          <Input
            id="expirationDate"
            type="date"
            placeholder="Enter expiration date"
            {...register("expirationDate", {
              required: "Expiration date is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="licenseNumber"
            className="block text-sm font-medium text-gray-700"
          >
            LGU License Number
          </label>
          <Input
            id="licenseNumber"
            placeholder="Enter LGU license number"
            {...register("licenseNumber", {
              required: "LGU license number is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="contactPerson"
            className="block text-sm font-medium text-gray-700"
          >
            Contact Person
          </label>
          <Input
            id="contactPerson"
            placeholder="Enter contact person's name"
            {...register("contactPerson", {
              required: "Contact person is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="designation"
            className="block text-sm font-medium text-gray-700"
          >
            Designation
          </label>
          <Input
            id="designation"
            placeholder="Enter designation"
            {...register("designation", {
              required: "Designation is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
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
        <div>
          <label
            htmlFor="facebook"
            className="block text-sm font-medium text-gray-700"
          >
            Facebook
          </label>
          <Input
            id="facebook"
            placeholder="Enter Facebook URL"
            {...register("facebook", {
              required: "Facebook URL is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="instagram"
            className="block text-sm font-medium text-gray-700"
          >
            Instagram
          </label>
          <Input
            id="instagram"
            placeholder="Enter Instagram URL"
            {...register("instagram", {
              required: "Instagram URL is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="twitter"
            className="block text-sm font-medium text-gray-700"
          >
            Twitter
          </label>
          <Input
            id="twitter"
            placeholder="Enter Twitter URL"
            {...register("twitter", {
              required: "Twitter URL is required",
            })}
          />
        </div>
        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700"
          >
            Other Website
          </label>
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
        <div>
          <label
            htmlFor="bookingCompany"
            className="block text-sm font-medium text-gray-700"
          >
            Booking Company, Please Specify
          </label>
          <Input
            id="bookingCompany"
            placeholder="Enter booking company"
            {...register("bookingCompany", {
              required: "Booking company is required",
            })}
          />
        </div>
      </div>
    </TabsContent>
  );
}
