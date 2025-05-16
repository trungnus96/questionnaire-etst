"use client";

import React from "react";

// shadcn/ui components
import {
  FormControl,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const CheckboxQuestion = (props = {}) => {
  // props
  const { field = {}, form = {}, question = {}, disabled = false } = props;
  const { options = [] } = question;

  return options.map((option, index) => {
    return (
      <FormItem
        key={index}
        className={
          "flex items-center space-x-1 hover:bg-muted/50 rounded-md transition-colors"
        }
      >
        <FormControl>
          <Checkbox
            checked={field.value?.includes(option.value)}
            onCheckedChange={(checked) => {
              return checked
                ? field.onChange([...(field.value || []), option.value])
                : field.onChange(
                    (field.value || []).filter((v) => v !== option.value)
                  );
            }}
            id={`${question.id}-${option.value}`}
            disabled={disabled}
          />
        </FormControl>
        <FormLabel
          htmlFor={`${question.id}-${option.value}`}
          className="font-normal cursor-pointer text-sm leading-relaxed"
        >
          {option.label}
        </FormLabel>
      </FormItem>
    );
  });
};

export default CheckboxQuestion;
