"use client";

import React, { useEffect, useState } from "react";
import { useSelectedOptions } from "@/components/appx/context/SelectedOpti";

import { ViewFrame } from "./view_frame";
import { DateRangeFrame } from "./dateRange_frame";
import { RegionFrame } from "./region_frame";
import { CountryFrame } from "./country_frame";
import { ModelNameFrame } from "./modelName_frame";
import { SegmentFrame } from "./segment_frame";
import { ScopeFrame } from "./scope_frame";

import axios from "axios";

export default function ThirdNav() {
  const { selectedOptions, setSelectedOptions } = useSelectedOptions();
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    axios
      .get("/control_panel")
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => console.error("Error Loading JSON:", error));
  }, []);

  useEffect(() => {
    console.log("Current selections: ", selectedOptions);
  }, [selectedOptions]);

  return (
    <div className="flex flex-wrap bg-gray-100 w-full border-b border-gray-300 py-2">
      <h4 className="text-lg font-semibold text-gray-800">View:</h4>
      <ViewFrame selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />

      <h4 className="text-lg font-semibold text-gray-800">Date:</h4>
      <DateRangeFrame selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />

      <h4 className="text-lg font-semibold text-gray-800">Country:</h4>
      <CountryFrame selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />

      <h4 className="text-lg font-semibold text-gray-800">Region:</h4>
      <RegionFrame selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />

      <h4 className="text-lg font-semibold text-gray-800">Model Name:</h4>
      <ModelNameFrame selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />

      <h4 className="text-lg font-semibold text-gray-800">Segment:</h4>
      <SegmentFrame selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />

      <h4 className="text-lg font-semibold text-gray-800">Scope:</h4>
      <ScopeFrame selectedOptions={selectedOptions} setSelectedOptions={setSelectedOptions} />
    </div>
  );
}
