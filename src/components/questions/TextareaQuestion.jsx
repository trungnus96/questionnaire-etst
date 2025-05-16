"use client";

import React from "react";

// shadcn/ui components
import { Textarea } from "@/components/ui/textarea";

const TextareaQuestion = (props = {}) => {
  // props
  const { field = {}, form = {}, question = {}, disabled = false } = props;

  return (
    <Textarea
      {...field}
      rows={4}
      placeholder="Your detailed answer..."
      className={
        form.formState.errors[question.id]
          ? "border-destructive focus-visible:ring-destructive"
          : ""
      }
      disabled={disabled}
    />
  );
};

export default TextareaQuestion;
