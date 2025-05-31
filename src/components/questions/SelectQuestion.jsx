"use client";

import React from "react";

// shadcn/ui components
import { FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectQuestion = (props = {}) => {
  // props
  const { field = {}, form = {}, question = {}, disabled = false } = props;
  const { options = [] } = question;

  return (
    <Select
      onValueChange={field.onChange}
      value={field.value}
      disabled={disabled}
    >
      <FormControl className="w-full">
        <SelectTrigger>
          <SelectValue placeholder={question.placeholder || "Please select"} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem key={index} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectQuestion;
