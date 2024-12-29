"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import Link from "next/link";

const InspectionDemoForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    accommodationType: "",
    currentInspectionMethod: "",
    inspectionFrequency: "",
    challengesInInspection: "",
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the form data to your backend
    // Reset form or show success message
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Link href="/" className="inline-block mb-4">
          <Button
            variant="outline"
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-100"
          >
            ← Back to Home
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-800">
          Request an Inspection Process Demo
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Experience how C.A.T.M.S can streamline your accommodation inspection
          process. Fill out the form below to schedule a personalized demo of
          our inspection features.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name*</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="organization">Organization Name*</Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role">Your Role*</Label>
            <Select
              name="role"
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, role: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspector">Inspector</SelectItem>
                <SelectItem value="manager">Property Manager</SelectItem>
                <SelectItem value="owner">Property Owner</SelectItem>
                <SelectItem value="administrator">Administrator</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="accommodationType">Accommodation Type*</Label>
              <Select
                name="accommodationType"
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, accommodationType: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select accommodation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="vacation-rental">
                    Vacation Rental
                  </SelectItem>
                  <SelectItem value="boutique">Boutique Hotel</SelectItem>
                  <SelectItem value="hostel">Hostel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Current Inspection Method*</Label>
            <RadioGroup
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  currentInspectionMethod: value,
                }))
              }
              className="flex flex-col space-y-1"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paper" id="paper" />
                <Label htmlFor="paper">Paper-based Checklists</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spreadsheet" id="spreadsheet" />
                <Label htmlFor="spreadsheet">Digital Spreadsheets</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="software" id="software" />
                <Label htmlFor="software">Inspection Software</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">No Formal Method</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="inspectionFrequency">Inspection Frequency*</Label>
            <Select
              name="inspectionFrequency"
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, inspectionFrequency: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select inspection frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="as-needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="challengesInInspection">
              Current Challenges in Inspection Process
            </Label>
            <Textarea
              id="challengesInInspection"
              name="challengesInInspection"
              value={formData.challengesInInspection}
              onChange={handleChange}
              rows={4}
              placeholder="Please describe any specific challenges or pain points in your current inspection process."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
              }
              required
            />
            <Label htmlFor="agreeToTerms" className="text-sm">
              I agree to the{" "}
              <a href="/terms" className="text-indigo-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-indigo-600 hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your privacy is important to us. We'll never share your
                  information without your permission.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Request Inspection Process Demo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InspectionDemoForm;
