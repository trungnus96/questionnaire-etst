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
import {
  submitQuestionnaireResponse,
  updateQuestionnaireResponse,
} from "@/services/Questionnaires";

// constants
import * as QuestionsConstants from "@/constants/questions";

// utilities
import delay from "delay";
import { isEmpty } from "lodash";
import { processSubmittedQuestionnaireResponse } from "@/utilities/questionnaires";

// Function to generate Zod schema and default values from questionnaire config
const generateFormSchemaAndDefaults = ({
  questions = [],
  submitted_answers = {},
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
          !isEmpty(submitted_answers) &&
          submitted_answers[question.id] &&
          submitted_answers[question.id].length > 0
        ) {
          default_values[question.id] = submitted_answers[question.id][0] || "";
        }

        break;

      case QuestionsConstants.QUESTION_TYPE_DATE_PICKER:
        // For date picker, we'll store as Date object internally
        field_schema = z.date({
          invalid_type_error: "Invalid date format.",
        });
        default_values[question.id] = undefined; // Calendar expects undefined or Date

        if (
          !isEmpty(submitted_answers) &&
          submitted_answers[question.id] &&
          submitted_answers[question.id].length > 0 &&
          moment(
            submitted_answers[question.id][0],
            question.date_format || ""
          ).isValid()
        ) {
          const moment_date = moment(
            submitted_answers[question.id][0],
            question.date_format
          );

          if (moment_date.isValid()) {
            default_values[question.id] = moment_date.toDate();
          }
        }

        break;

      case QuestionsConstants.QUESTION_TYPE_CHECKBOX: // Assuming checkbox stores an array of selected values
        field_schema = z.array(z.string());
        default_values[question.id] = [];

        if (
          !isEmpty(submitted_answers) &&
          submitted_answers[question.id] &&
          submitted_answers[question.id].length > 0
        ) {
          default_values[question.id] = submitted_answers[question.id] || [];
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
    sections = [],
    questions = [],
    submitted_answers: _submitted_answers = {},
    is_submitted = false,
    search_params: { group_gid = "", corresponding_gid = "" } = {},
    submitted_questionnaire_response = {},
    allow_updating = false,
  } = props;

  // hooks
  const [is_submitting, setIsSubmitting] = useState(false);
  const [submission_success, setSubmissionSuccess] = useState(false);
  const [error_message, setErrorMessage] = useState("");
  const [submitted_answers, setSubmittedAnswers] = useState(
    is_submitted ? _submitted_answers : {}
  );
  const [is_show_prefill_alert, setIsShowPrefillAlert] = useState(
    !is_submitted && !isEmpty(submitted_answers)
  );

  useEffect(() => {
    const { default_values: new_default_values } =
      generateFormSchemaAndDefaults({ questions, submitted_answers });

    form.reset(new_default_values); // Reset form with new defaults when data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted_answers]);

  // Memoize schema and default values generation
  const { schema, default_values } = useMemo(() => {
    if (!questions || questions.length === 0) {
      // Return a placeholder schema/defaults if data isn't loaded yet
      // This helps prevent errors during initial render before useEffect fetches data
      return { schema: z.object({}), default_values: {} };
    }

    return generateFormSchemaAndDefaults({ questions, submitted_answers });
  }, [questions]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: default_values, // Set once on mount
    mode: "onChange", // Validate on change for better UX
  });

  // functions
  const onSubmit = async (data) => {
    setErrorMessage("");

    const submission_data = {
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
    };

    setIsSubmitting(true);

    let api_response = {};

    if (!is_submitted) {
      // POST - submitResponse
      api_response = await submitResponse({
        submission_data,
      });
    } else {
      // PUT - updateResponse
      api_response = await updateResponse({
        submission_data,
      });
    }

    const { error_message = "", data: api_data = {} } = api_response;

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

  const submitResponse = async ({ submission_data = {} } = {}) => {
    submission_data = {
      ...submission_data,
      questionnaire_gid: questionnaire.g_id,
      group_gid,
      corresponding_gid,
    };

    console.log("Submitting Form Data:", submission_data);

    const { error_message = "", data = {} } = await submitQuestionnaireResponse(
      submission_data
    );

    return {
      error_message,
      data,
    };
  };

  const updateResponse = async ({ submission_data = {} } = {}) => {
    const { answers = [] } = submission_data;

    const dirty_fields_names = Object.keys(form.formState.dirtyFields);

    const answers_to_be_updated = answers.filter((answer) =>
      dirty_fields_names.includes(answer.reference_id)
    );

    submission_data = {
      g_id: submitted_questionnaire_response.g_id,
      answers: answers_to_be_updated,
    };

    console.log("Submitting Form Data:", submission_data);

    const { error_message = "", data = {} } = await updateQuestionnaireResponse(
      submission_data
    );

    return {
      error_message,
      data,
    };
  };

  const prefillAnswers = () => {
    // const submitted_answers = processSubmittedQuestionnaireResponse({
    //   questionnaire_response,
    // });
    // setSubmittedAnswers(submitted_answers);
    // setIsShowPrefillAlert(false);
  };

  // const handleFillAgain = () => {
  //   if (questionnaire) {
  //     const { default_values: currentdefault_values } =
  //       generateFormSchemaAndDefaults({ questions, submitted_answers });
  //     form.reset(currentdefault_values);
  //   }
  // };

  // if (is_loading) {
  //   return <QuestionnaireLoadingSkeleton />;
  // }

  if (submission_success) {
    return (
      <QuestionnaireSuccessMessage
        message={
          is_submitted
            ? "Your response has been updated successfully!"
            : "Your response has been submitted successfully!"
        }
      />
    );
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

  let questionnaire_timestamp = null;
  if (
    !isEmpty(submitted_questionnaire_response) &&
    submitted_questionnaire_response.created_at
  ) {
    const submitted_timestamp = (
      <div className="max-w-2xl mx-auto mt-1 text-xs text-gray-400 flex justify-end">
        Last submitted:{" "}
        {moment(submitted_questionnaire_response.created_at).format(
          "DD-MM-YYYY HH:mm:ss"
        )}
      </div>
    );

    let modified_timestamp = null;
    if (
      submitted_questionnaire_response.modified_at &&
      moment(submitted_questionnaire_response.modified_at).isBefore(
        moment(submitted_questionnaire_response.created_at)
      )
    ) {
      modified_timestamp = (
        <div className="max-w-2xl mx-auto mt-1 text-xs text-gray-400 flex justify-end">
          Last updated:{" "}
          {moment(submitted_questionnaire_response.modified_at).format(
            "DD-MM-YYYY HH:mm:ss"
          )}
        </div>
      );
    }

    questionnaire_timestamp = (
      <Fragment>
        {submitted_timestamp}
        {modified_timestamp}
      </Fragment>
    );
  }

  return (
    <Fragment>
      {prefill_answer_alert}

      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-primary">
            {questionnaire.title}
          </CardTitle>

          {questionnaire.description && (
            <CardDescription className="mt-2 whitespace-pre-line">
              {questionnaire.description}
            </CardDescription>
          )}
        </CardHeader>

        <Separator className="my-2" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {sections &&
              sections.length > 0 &&
              sections.map((section) => {
                const {
                  g_id = "",
                  title = "",
                  description = "",
                  items: questions = [],
                } = section;

                return (
                  <Fragment key={g_id}>
                    <CardContent></CardContent>

                    <CardContent>
                      <div className="text-md font-semibold mb-4">{title}</div>

                      {description && (
                        <div className="mb-4 text-sm">{description}</div>
                      )}

                      <div className="space-y-8">
                        {questions.map((question, index) => {
                          const key = question.reference_id;

                          if (
                            question.type ===
                            QuestionsConstants.QUESTION_TYPE_CONTENT
                          ) {
                            return (
                              <div
                                key={key}
                                dangerouslySetInnerHTML={{
                                  __html: question.label,
                                }}
                              ></div>
                            );
                          }

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
                                  disabled:
                                    is_submitting ||
                                    (is_submitted && !allow_updating),
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
                      !Object.keys(form.formState.dirtyFields).length > 0
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

                {allow_updating && (
                  <Fragment>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mb-2"
                      disabled={
                        is_submitting ||
                        !Object.keys(form.formState.dirtyFields).length > 0
                      }
                      onClick={() => console.log(form.formState.dirtyFields)}
                    >
                      {is_submitting ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save changes"
                      )}
                    </Button>

                    <Button
                      type="button"
                      size="lg"
                      className="w-full"
                      variant="outline"
                      disabled={
                        is_submitting ||
                        !Object.keys(form.formState.dirtyFields).length > 0
                      }
                      onClick={() => form.reset()}
                    >
                      Clear changes
                    </Button>
                  </Fragment>
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

      {questionnaire_timestamp}
    </Fragment>
  );
}

export default Questionnaire;
