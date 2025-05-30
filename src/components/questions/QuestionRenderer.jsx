"use client";

import React from "react";

// components
import InputField from "./InputField";
import TextareaQuestion from "./TextareaQuestion";
import RadioQuestion from "./RadioQuestion";
import CheckboxQuestion from "./CheckboxQuestion";
import SelectQuestion from "./SelectQuestion";
import DatePickerQuestion from "./DatePickerQuestion";
import SignatureQuestion from "./SignatureQuestion";

// shadcn/ui components
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// constants
import * as QuestionsConstants from "@/constants/questions";

const QuestionRenderer = (props = {}) => {
  // props
  const { field = {}, form = {}, question = {}, index = 0 } = props;

  // constants
  const shared_props = {
    field,
    form,
    question,
  };

  let content = null;

  switch (question.type) {
    case QuestionsConstants.QUESTION_TYPE_INPUT:
      content = <InputField {...shared_props} />;
      break;

    case QuestionsConstants.QUESTION_TYPE_TEXTAREA:
      content = <TextareaQuestion {...shared_props} />;
      break;

    case QuestionsConstants.QUESTION_TYPE_RADIO:
      content = <RadioQuestion {...shared_props} />;
      break;

    case QuestionsConstants.QUESTION_TYPE_CHECKBOX:
      content = <CheckboxQuestion {...shared_props} />;
      break;

    case QuestionsConstants.QUESTION_TYPE_SELECT:
      content = <SelectQuestion {...shared_props} />;
      break;

    case QuestionsConstants.QUESTION_TYPE_DATE_PICKER:
      content = (
        <DatePickerQuestion
          {...shared_props}
          end_year={new Date().getFullYear()}
        />
      );
      break;

    case QuestionsConstants.QUESTION_TYPE_SIGNATURE:
      content = <SignatureQuestion {...shared_props} />;
      break;

    default:
      content = null;
  }

  const id = `question-${question.id}`;

  return (
    <FormItem id={id}>
      <FormLabel className="leading-normal">
        <div>
          <div className="block font-semibold">
            {index + 1}. {question.label}
            {question.is_required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </div>
          {question.sub_label && (
            <div className="mb-1 text-muted-foreground">
              {question.sub_label}
            </div>
          )}
        </div>
      </FormLabel>

      <FormControl>{content}</FormControl>

      {question.description && (
        <FormDescription>{question.description}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
};

export default QuestionRenderer;
