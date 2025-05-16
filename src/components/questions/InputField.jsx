"use client";

// shadcn/ui components
import { Input } from "@/components/ui/input";

const TextQuestion = (props = {}) => {
  // props
  const { field = {}, form = {}, question = {}, disabled = false } = props;

  return (
    <Input
      {...field}
      type={
        question.validation?.type === "email"
          ? "email"
          : question.id.includes("phone")
          ? "tel"
          : "text"
      }
      placeholder={question.placeholder || "Your answer here..."}
      className={
        form.formState.errors[question.id]
          ? "border-destructive focus-visible:ring-destructive"
          : ""
      }
      disabled={disabled}
    />
  );
};

export default TextQuestion;
