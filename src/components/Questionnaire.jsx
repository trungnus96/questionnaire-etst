"use client";
import { useState, useEffect, useMemo, useRef, Fragment } from "react";
import { Send, AlertTriangle, CheckCircle2, CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns"; // For date formatting and parsing
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
import { cn } from "@/lib/utils";

// libs
import moment from "moment";

// icons
import { Loader2 } from "lucide-react";

// components
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import QuestionnaireLoadingSkeleton from "@/components/shared/QuestionnaireLoadingSkeleton";
import QuestionnaireSuccessMessage from "@/components/shared/QuestionnaireSuccessMessage";

// constants
import * as QuestionsConstants from "@/constants/questions";
import { MOCK_QUESTIONNAIRE } from "@/constants";

// utilities
import { isEmpty } from "lodash";

// Function to generate Zod schema and default values from questionnaire config
const generateFormSchemaAndDefaults = (questions) => {
  const schema_shape = {};
  const defaultValues = {};

  questions.forEach((question = {}) => {
    let field_schema;

    // Base type
    switch (question.type) {
      case QuestionsConstants.QUESTION_TYPE_INPUT:
      case QuestionsConstants.QUESTION_TYPE_TEXTAREA:
      case QuestionsConstants.QUESTION_TYPE_SIGNATURE:
        field_schema = z.string();
        defaultValues[question.id] = "";
        break;

      case QuestionsConstants.QUESTION_TYPE_DATE_PICKER:
        // For date picker, we'll store as Date object internally
        field_schema = z.date({
          invalid_type_error: "Invalid date format.",
        });
        defaultValues[question.id] = undefined; // Calendar expects undefined or Date
        break;

      case QuestionsConstants.QUESTION_TYPE_RADIO:
        field_schema = z.string();
        defaultValues[question.id] = "";
        break;

      case QuestionsConstants.QUESTION_TYPE_CHECKBOX: // Assuming checkbox stores an array of selected values
        field_schema = z.array(z.string());
        defaultValues[question.id] = [];
        break;

      default:
        field_schema = z.any(); // Fallback for unknown types
        defaultValues[question.id] = undefined;
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
    defaultValues: {
      ...defaultValues,
      personal_full_name: "hello",
      confirmation_agreement: ["agreed"],
      // personal_dob: new Date(),
      lifestyle_alcohol: "no",
    },
  };
};

function Questionnaire() {
  // hooks
  const [questionnaire_data, setQuestionnaireData] = useState(null);
  const [is_loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [is_submitting, setIsSubmitting] = useState(false);
  const [submission_success, setSubmissionSuccess] = useState(false);

  // Memoize schema and default values generation
  const { schema, defaultValues } = useMemo(() => {
    if (!questionnaire_data) {
      // Return a placeholder schema/defaults if data isn't loaded yet
      // This helps prevent errors during initial render before useEffect fetches data
      return { schema: z.object({}), defaultValues: {} };
    }
    return generateFormSchemaAndDefaults(questionnaire_data.questions);
  }, [questionnaire_data]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues, // Set once on mount
    mode: "onChange", // Validate on change for better UX
  });

  // Effect to fetch questionnaire data and reset form
  useEffect(() => {
    if (true) {
      // Assuming questionnaire_id determines which questionnaire to load
      setIsLoading(true);
      setError(null);
      setSubmissionSuccess(false);

      // Simulate API call to fetch questionnaire structure
      setTimeout(() => {
        const fetchedQuestionnaire = MOCK_QUESTIONNAIRE; // Use the one with validation
        setQuestionnaireData(fetchedQuestionnaire);

        // Regenerate defaults based on fetched data and reset the form
        const { defaultValues: newDefaultValues } =
          generateFormSchemaAndDefaults(fetchedQuestionnaire.questions);
        form.reset(newDefaultValues); // Reset form with new defaults when data changes

        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false); // No ID, so not loading
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // form.reset is stable, no need to add to deps if using useCallback for generateFormSchemaAndDefaults

  // useEffect to update form default values if questionnaire_data changes after initial load
  // This is crucial if the form is already initialized and then the data/schema changes.
  useEffect(() => {
    if (questionnaire_data) {
      const { defaultValues: newDefaultValues } = generateFormSchemaAndDefaults(
        questionnaire_data.questions
      );
      form.reset(newDefaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setSubmissionSuccess(false);

    // Transform data if needed (e.g., date formatting)
    const submission_data = {
      questionnaire_id: questionnaire_data._id,
      answers: questionnaire_data.questions.map((question) => {
        let value = data[question.id];

        if (
          question.type === QuestionsConstants.QUESTION_TYPE_DATE_PICKER &&
          value instanceof Date
        ) {
          value = moment(value).valueOf();
        }

        return { question_id: question.id, value };
      }),
    };

    console.log("Submitting Form Data:", submission_data);

    // Simulate API Call
    setTimeout(() => {
      console.log("Simulated API call for submission successful.");
      setSubmissionSuccess(true);
      setIsSubmitting(false);
      // Optionally reset the form to default values after successful submission
      // form.reset(defaultValues); // Or fetch new defaults if needed
    }, 1000 * 3);
  };

  const handleFillAgain = () => {
    setSubmissionSuccess(false);
    // Reset the form to its initial default values derived from the current questionnaire_data
    if (questionnaire_data) {
      const { defaultValues: currentDefaultValues } =
        generateFormSchemaAndDefaults(questionnaire_data.questions);
      form.reset(currentDefaultValues);
    }
    // Optionally, re-trigger useEffect if you need to simulate a full "reload"
    // setIsLoading(true); // This would re-run the data fetching timeout
  };

  if (is_loading) {
    return <QuestionnaireLoadingSkeleton />;
  }

  if (error) {
    return (
      /* Error UI remains the same */
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-5 w-5" /> <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "An unexpected error occurred."}
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.reload()}
          >
            Try again
          </Button>
        </Alert>
      </div>
    );
  }

  if (!questionnaire_data && !is_loading) {
    return (
      /* Not Found UI remains the same */
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Questionnaire Not Found</AlertTitle>
          <AlertDescription>
            The questionnaire you are looking for could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (submission_success) {
    return <QuestionnaireSuccessMessage />;
  }

  // constants
  const { sections = [] } = questionnaire_data;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8 leading-normal">
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
                const {
                  title = "",
                  description = "",
                  questions = [],
                } = section;

                const id = `section-${index}`;

                const is_last = index === sections.length - 1;

                return (
                  <Fragment key={id}>
                    <CardContent>
                      <div className="text-md font-semibold mb-4">{title}</div>

                      {description && (
                        <div className="mb-4 text-sm">{description}</div>
                      )}

                      <div className="space-y-8">
                        {questions.map((question, index) => (
                          <FormField
                            key={question.id}
                            control={form.control}
                            name={question.id}
                            render={({ field }) => {
                              const shared_props = {
                                field,
                                form,
                                question,
                                disabled: is_submitting,
                              };

                              return (
                                <QuestionRenderer
                                  {...shared_props}
                                  index={index}
                                />
                              );
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>

                    {!is_last && <Separator className="my-8" />}
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

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={
                    is_submitting ||
                    (!form.formState.isDirty &&
                      !Object.keys(form.formState.touchedFields).length === 0 &&
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
              </CardFooter>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default Questionnaire;
