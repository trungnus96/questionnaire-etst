"use client";

import React from "react";

// shadcn/ui components
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RadioQuestion = (props = {}) => {
  // props
  const { field = {}, form = {}, question = {}, disabled = false } = props;

  return (
    <RadioGroup
      onValueChange={field.onChange}
      value={field.value} // Or value={field.value}
      className={`space-y-1 ${
        form.formState.errors[question.id]
          ? "rounded-md border border-destructive p-3"
          : ""
      }`}
    >
      {question.options.map((option) => {
        const id = `${question.id}-${option.value}`;

        return (
          <FormItem
            key={option.value}
            className="flex items-center space-x-2 hover:bg-muted/50 rounded-md transition-colors"
          >
            <FormControl>
              <RadioGroupItem
                value={option.value}
                id={id}
                disabled={disabled}
              />
            </FormControl>
            <FormLabel htmlFor={id} className="font-normal cursor-pointer">
              {option.label}
            </FormLabel>
          </FormItem>
        );
      })}
    </RadioGroup>
  );
};

export default RadioQuestion;
