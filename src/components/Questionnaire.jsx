"use client";
import { useState, useEffect, useMemo, Fragment } from "react";
import { AlertTriangle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormField } from "@/components/ui/form";

// libs
import moment from "moment";

// icons
import { Loader2 } from "lucide-react";

// components
import QuestionRenderer from "@/components/questions/QuestionRenderer";
// import QuestionnaireLoadingSkeleton from "@/components/shared/QuestionnaireLoadingSkeleton";
import QuestionnaireSuccessMessage from "@/components/shared/QuestionnaireSuccessMessage";

// services
import { submitQuestionnaireResponse } from "@/services/Questionnaires";

// constants
import * as QuestionsConstants from "@/constants/questions";

// utilities
import delay from "delay";
import { isEmpty } from "lodash";
import {
  processQuestionnaireData,
  processPreviousQuestionnaireResponse,
} from "@/utilities/questionnaires";

// Function to generate Zod schema and default values from questionnaire config
const generateFormSchemaAndDefaults = ({
  questions = [],
  previous_answers = {},
} = {}) => {
  const schema_shape = {};
  const default_values = {};

  questions.forEach((question = {}) => {
    let field_schema;

    // Base type
    switch (question.type) {
      case QuestionsConstants.QUESTION_TYPE_INPUT:
      case QuestionsConstants.QUESTION_TYPE_TEXTAREA:
      case QuestionsConstants.QUESTION_TYPE_SIGNATURE:
      case QuestionsConstants.QUESTION_TYPE_RADIO:
      case QuestionsConstants.QUESTION_TYPE_SELECT:
        field_schema = z.string();
        default_values[question.id] = "";

        if (
          !isEmpty(previous_answers) &&
          previous_answers[question.id] &&
          previous_answers[question.id].length > 0
        ) {
          default_values[question.id] = previous_answers[question.id][0] || "";
        }

        break;

      case QuestionsConstants.QUESTION_TYPE_DATE_PICKER:
        // For date picker, we'll store as Date object internally
        field_schema = z.date({
          invalid_type_error: "Invalid date format.",
        });
        default_values[question.id] = undefined; // Calendar expects undefined or Date

        if (
          !isEmpty(previous_answers) &&
          previous_answers[question.id] &&
          previous_answers[question.id].length > 0 &&
          moment(previous_answers[question.id][0]).isValid()
        ) {
          default_values[question.id] = moment(
            previous_answers[question.id][0]
          ).toDate();
        }

        break;

      case QuestionsConstants.QUESTION_TYPE_CHECKBOX: // Assuming checkbox stores an array of selected values
        field_schema = z.array(z.string());
        default_values[question.id] = [];

        if (
          !isEmpty(previous_answers) &&
          previous_answers[question.id] &&
          previous_answers[question.id].length > 0
        ) {
          default_values[question.id] = previous_answers[question.id] || [];
        }
        break;

      default:
        field_schema = z.any(); // Fallback for unknown types
        default_values[question.id] = "";
    }

    // Required validation
    if (question.is_required) {
      if (
        [
          QuestionsConstants.QUESTION_TYPE_INPUT,
          QuestionsConstants.QUESTION_TYPE_TEXTAREA,
          QuestionsConstants.QUESTION_TYPE_SIGNATURE,
        ].includes(question.type)
      ) {
        field_schema = field_schema.min(1, {
          message:
            question.type === QuestionsConstants.QUESTION_TYPE_SIGNATURE
              ? "Please sign here"
              : `${question.label} is required`,
        });
      } else if (
        question.type === QuestionsConstants.QUESTION_TYPE_DATE_PICKER
      ) {
        // z.date() itself being non-optional handles required
        // If you want a custom message for undefined:
        field_schema = field_schema.refine(
          (val) => val !== undefined && val !== null,
          { message: `${question.label} is required` }
        );
      } else if (question.type === QuestionsConstants.QUESTION_TYPE_CHECKBOX) {
        field_schema = field_schema.min(1, {
          message: `Please make at least one selection`,
        });
      }
    }

    // Additional validations from question.validation
    if (!isEmpty(question.validation)) {
      if (question.validation.type === "email") {
        field_schema = field_schema.email({
          message: "Invalid email address.",
        });
      }

      if (question.validation.min_length) {
        field_schema = field_schema.min(question.validation.min_length, {
          message: `${question.label} must be at least ${question.validation.min_length} characters`,
        });
      }

      if (question.validation.max_length) {
        field_schema = field_schema.max(question.validation.max_length, {
          message: `${question.label} cannot exceed ${question.validation.max_length} characters`,
        });
      }

      // to do: review
      // if (question.validation.pattern) {
      //   field_schema = field_schema.regex(
      //     new RegExp(question.validation.pattern),
      //     {
      //       message:
      //         question.validation.patternMessage ||
      //         `Invalid format for ${question.label}`,
      //     }
      //   );
      // }
    }

    // Ensure optional fields don't break chaining with .email, .regex etc. if they are empty strings
    // Zod handles this well by default (e.g. .optional().email() will pass if undefined/null, but fail if it's a non-empty invalid email)
    // However, if an optional string field is empty "", it will pass .email() unless .min(1) is also applied.
    // For our case, if a field is not required, an empty string is acceptable.
    // If it's not required but has a pattern/email validation, it should only fail if it's non-empty AND invalid.
    if (
      !question.is_required &&
      [
        QuestionsConstants.QUESTION_TYPE_INPUT,
        QuestionsConstants.QUESTION_TYPE_TEXTAREA,
        QuestionsConstants.QUESTION_TYPE_SIGNATURE,
      ].includes(question.type)
    ) {
      field_schema = field_schema.or(z.literal("")); // Allow empty string for optional text/textarea
    }

    schema_shape[question.id] = field_schema;
  });

  return {
    schema: z.object(schema_shape),
    default_values,
  };
};

function Questionnaire(props) {
  // props
  const {
    questionnaire = {},
    questionnaire_response = {},
    group_gid = "",
    corresponding_gid = "",
  } = props;

  const processed_questionnaire = processQuestionnaireData({ questionnaire });
  const {
    questionnaire: questionnaire_data = {},
    sections = [],
    questions = [],
  } = processed_questionnaire;

  const is_submitted =
    questionnaire_response.corresponding_gid === corresponding_gid &&
    corresponding_gid !== "";

  // hooks
  const [is_submitting, setIsSubmitting] = useState(false);
  const [submission_success, setSubmissionSuccess] = useState(false);
  const [error_message, setErrorMessage] = useState("");
  const [previous_answers, setPreviousAnswers] = useState(
    is_submitted
      ? processPreviousQuestionnaireResponse({
          questionnaire_response,
        })
      : {}
  );
  const [is_show_prefill_alert, setIsShowPrefillAlert] = useState(
    !is_submitted && isEmpty(previous_answers)
  );

  useEffect(() => {
    const { default_values: new_default_values } =
      generateFormSchemaAndDefaults({ questions, previous_answers });

    form.reset(new_default_values); // Reset form with new defaults when data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previous_answers]);

  // Memoize schema and default values generation
  const { schema, default_values } = useMemo(() => {
    if (!questions || questions.length === 0) {
      // Return a placeholder schema/defaults if data isn't loaded yet
      // This helps prevent errors during initial render before useEffect fetches data
      return { schema: z.object({}), default_values: {} };
    }

    return generateFormSchemaAndDefaults({ questions, previous_answers });
  }, [questions]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: default_values, // Set once on mount
    mode: "onChange", // Validate on change for better UX
  });

  // functions
  const onSubmit = async (data) => {
    setErrorMessage("");

    // Transform data if needed (e.g., date formatting)
    const submission_data = {
      questionnaire_gid: questionnaire_data.g_id,
      answers: questions.map((question) => {
        let value = data[question.id];

        if (
          question.type === QuestionsConstants.QUESTION_TYPE_DATE_PICKER &&
          value instanceof Date
        ) {
          value = moment(value).format(question.date_format || "DD-MM-YYYY");
        }

        return {
          reference_id: question.id,
          value: Array.isArray(value) ? value : [value],
          section_gid: question.section_gid,
          item_gid: question.g_id,
        };
      }),
      group_gid,
      customer_email: "trungnus96@gmail.com",
      corresponding_gid: "abc123",
    };

    console.log("Submitting Form Data:", submission_data);

    setIsSubmitting(true);
    const { error_message = "", data: api_data = {} } =
      await submitQuestionnaireResponse(submission_data);
    setIsSubmitting(false);

    if (error_message) {
      setErrorMessage(error_message);

      await delay(100); // Ensure the DOM is updated before scrolling

      const error_message_el = document.querySelector(".error-message");

      if (error_message_el) {
        // scroll to error_message_el
        error_message_el.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "end",
        });
      }

      return;
    }

    setSubmissionSuccess(true);
  };

  const prefillAnswers = () => {
    const previous_answers = processPreviousQuestionnaireResponse({
      questionnaire_response,
    });

    setPreviousAnswers(previous_answers);
    setIsShowPrefillAlert(false);
  };

  // const handleFillAgain = () => {
  //   if (questionnaire_data) {
  //     const { default_values: currentdefault_values } =
  //       generateFormSchemaAndDefaults({ questions, previous_answers });
  //     form.reset(currentdefault_values);
  //   }
  // };

  // if (is_loading) {
  //   return <QuestionnaireLoadingSkeleton />;
  // }

  if (submission_success) {
    return <QuestionnaireSuccessMessage />;
  }

  // content render helper
  let prefill_answer_alert = null;
  if (is_show_prefill_alert) {
    prefill_answer_alert = (
      <Alert className="max-w-2xl mx-auto shadow-xl mb-4">
        <AlertDescription className="flex items-center justify-between">
          Prefill your answers from your last submission to save time
          <Button onClick={prefillAnswers}>Prefill</Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Fragment>
      {prefill_answer_alert}

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-primary">
            {questionnaire_data.title}
          </CardTitle>

          {questionnaire_data.description && (
            <CardDescription className="mt-2 whitespace-pre-line">
              {questionnaire_data.description}
            </CardDescription>
          )}
        </CardHeader>

        <Separator className="my-2" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {sections &&
              sections.length > 0 &&
              sections.map((section, index) => {
                let {
                  g_id = "",
                  title = "",
                  description = "",
                  items: questions = [],
                } = section;

                questions = questions.filter(
                  (question) => question.type !== "TEXT"
                );

                const is_last = index === sections.length - 1;

                return (
                  <Fragment key={g_id}>
                    <CardContent>
                      <div className="text-md font-semibold mb-4">{title}</div>

                      {description && (
                        <div className="mb-4 text-sm">{description}</div>
                      )}

                      <div className="space-y-8">
                        {questions.map((question, index) => {
                          const key = question.reference_id;

                          return (
                            <FormField
                              key={key}
                              control={form.control}
                              name={key}
                              render={({ field }) => {
                                const shared_props = {
                                  field,
                                  form,
                                  question,
                                  disabled: is_submitting || is_submitted,
                                };

                                return (
                                  <QuestionRenderer
                                    {...shared_props}
                                    index={index}
                                  />
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </CardContent>

                    <Separator className="my-8" />
                    {/* {is_last && <div className="mb-8"></div>} */}
                  </Fragment>
                );
              })}

            <CardContent>
              <CardFooter className="p-0 flex flex-col items-center">
                {Object.keys(form.formState.errors).length > 0 &&
                  !form.formState.isValid && (
                    <Alert variant="destructive" className="mb-6 w-full">
                      <AlertTriangle className="h-4 w-4" />

                      <AlertTitle>Validation Errors</AlertTitle>

                      <AlertDescription>
                        Please correct the highlighted fields above before
                        submitting.
                      </AlertDescription>
                    </Alert>
                  )}

                {!is_submitted && (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={
                      is_submitting ||
                      (!form.formState.isDirty &&
                        !Object.keys(form.formState.touchedFields).length ===
                          0 &&
                        !form.formState.isValid)
                    }
                  >
                    {is_submitting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                )}

                {error_message && (
                  <Alert
                    variant="destructive"
                    className="mt-4 w-full error-message"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error_message}</AlertDescription>
                  </Alert>
                )}
              </CardFooter>
            </CardContent>
          </form>
        </Form>
      </Card>
    </Fragment>
  );
}

export default Questionnaire;
