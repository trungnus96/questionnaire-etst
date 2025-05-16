// pages/survey/[questionnaireId].js
// This component displays a questionnaire to the customer using shadcn/ui components,
// including a date picker for Date of Birth.
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, AlertTriangle, CheckCircle2, CalendarIcon } from "lucide-react";
import { format } from "date-fns"; // For date formatting

import {
  Button as AriaButton,
  DatePicker as AriaDatePicker,
  Dialog as AriaDialog,
  Group as AriaGroup,
  Label as AriaLabel,
  Popover as AriaPopover,
} from "react-aria-components";

import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // For Date Picker
// import { Calendar } from "@/components/ui/calendar"; // For Date Picker
import { cn } from "@/lib/utils"; // For conditional classnames, ensure this path is correct

// MOCK_QUESTIONNAIRE data for iKOU Spa Online Booking
const MOCK_IKOU_SPA_QUESTIONNAIRE = {
  _id: "ikou_spa_booking_v1",
  title: "iKOU Spa - Pre-Treatment Questionnaire",
  description:
    "Welcome to iKOU Spa! Please complete this confidential questionnaire to help us tailor your treatment for the best possible experience and ensure your safety and comfort. \n\nImportant Information (Byron Bay Appointments): iKOU Byron Bay is located at Shop 1/8 Lawson St, Byron Bay right next to Lorna Jane. iKOU Byron Bay is an open plan wellness bar, you may hear sounds from other guests. We aim to keep noise and disruption to a minimum during the treatment. We look forward to treating you to the iKOU experience.",
  questions: [
    // Section 1: Personal Information
    {
      id: "personal_full_name",
      text: "Full Name",
      type: "text",
      isRequired: true,
      category: "Personal Information",
    },
    {
      id: "personal_dob",
      text: "Date of Birth",
      type: "date_picker",
      placeholder: "DD/MM/YYYY",
      isRequired: true,
      category: "Personal Information",
    }, // Changed type to 'date_picker'
    {
      id: "personal_phone",
      text: "Phone Number",
      type: "text",
      isRequired: true,
      category: "Personal Information",
    },
    {
      id: "personal_email",
      text: "Email Address",
      type: "text",
      isRequired: true,
      category: "Personal Information",
    },
    {
      id: "emergency_contact_name",
      text: "Emergency Contact - Name",
      type: "text",
      isRequired: true,
      category: "Personal Information",
    },
    {
      id: "emergency_contact_phone",
      text: "Emergency Contact - Phone Number",
      type: "text",
      isRequired: true,
      category: "Personal Information",
    },
    // Section 2: Health and Medical History
    {
      id: "health_skin_type",
      text: "How would you describe your skin type?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "oily", label: "Oily" },
        { value: "dry", label: "Dry" },
        { value: "combination", label: "Combination" },
        { value: "sensitive", label: "Sensitive" },
        { value: "normal", label: "Normal" },
      ],
    },
    {
      id: "health_skin_concerns_bool",
      text: "Do you have any specific skin concerns or conditions (e.g., eczema, acne, rosacea)?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "health_skin_concerns_details",
      text: "If yes, please specify your skin concerns or conditions:",
      type: "textarea",
      isRequired: false,
      category: "Health and Medical History",
    },
    {
      id: "health_skincare_regimen",
      text: "Please list any skincare products you are currently using:",
      type: "textarea",
      isRequired: false,
      category: "Health and Medical History",
    },
    {
      id: "health_recent_treatments_bool",
      text: "Have you had any recent skin treatments or procedures (e.g., chemical peels, laser treatments)?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "health_recent_treatments_details",
      text: "If yes, please provide details of recent skin treatments:",
      type: "textarea",
      isRequired: false,
      category: "Health and Medical History",
    },
    {
      id: "health_allergies_bool",
      text: "Do you have any known allergies (e.g., skincare ingredients, nuts, essential oils, latex)?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "health_allergies_details",
      text: "If yes, please list your known allergies:",
      type: "textarea",
      isRequired: false,
      category: "Health and Medical History",
    },
    {
      id: "health_chronic_conditions_bool",
      text: "Do you have any chronic conditions we should be aware of (e.g., diabetes, heart disease, high blood pressure)?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "health_chronic_conditions_details",
      text: "If yes, please specify your chronic conditions:",
      type: "textarea",
      isRequired: false,
      category: "Health and Medical History",
    },
    {
      id: "health_recent_surgeries_bool",
      text: "Have you had any recent surgeries or injuries?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "health_recent_surgeries_details",
      text: "If yes, please provide details of recent surgeries or injuries:",
      type: "textarea",
      isRequired: false,
      category: "Health and Medical History",
    },
    {
      id: "health_blood_clots_bool",
      text: "Do you have a history of blood clots or varicose veins?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "health_medications_bool",
      text: "Are you currently taking any medications, including topical treatments?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "health_medications_details",
      text: "If yes, please list your current medications:",
      type: "textarea",
      isRequired: false,
      category: "Health and Medical History",
    },
    {
      id: "health_pregnancy_status",
      text: "Are you currently pregnant or trying to conceive?",
      type: "radio",
      isRequired: true,
      category: "Health and Medical History",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
        { value: "prefer_not_to_say", label: "Prefer not to say" },
      ],
    },
    // Section 3: Lifestyle Factors
    {
      id: "lifestyle_sun_exposure",
      text: "How often are you exposed to the sun?",
      type: "radio",
      isRequired: true,
      category: "Lifestyle Factors",
      options: [
        { value: "daily", label: "Daily" },
        { value: "occasionally", label: "Occasionally" },
        { value: "rarely", label: "Rarely" },
      ],
    },
    {
      id: "lifestyle_sunscreen_use",
      text: "Do you regularly use sunscreen?",
      type: "radio",
      isRequired: true,
      category: "Lifestyle Factors",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "lifestyle_smoking",
      text: "Do you smoke?",
      type: "radio",
      isRequired: true,
      category: "Lifestyle Factors",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "lifestyle_alcohol",
      text: "Do you consume alcohol regularly?",
      type: "radio",
      isRequired: true,
      category: "Lifestyle Factors",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    // Section 4: Confirmation
    {
      id: "confirmation_agreement",
      text: "By selecting this checkbox, I confirm that I have read and understand the above statements and agree to proceed with my treatment.",
      type: "checkbox",
      isRequired: true,
      category: "Confirmation",
      options: [{ value: "agreed", label: "I confirm and agree" }],
    },
    {
      id: "confirmation_client_name",
      text: "Client Name (Digital Signature)",
      type: "text",
      isRequired: true,
      category: "Confirmation",
    },
    {
      id: "confirmation_date",
      text: "Date (DD/MM/YYYY)",
      type: "text",
      placeholder: "DD/MM/YYYY",
      isRequired: true,
      category: "Confirmation",
    },
  ],
};

export default function FillQuestionnairePage() {
  const searchParams = useSearchParams();

  const allParams = Object.fromEntries(searchParams);

  console.log(allParams);

  const [questionnaire, setQuestionnaire] = useState(null);
  const [responses, setResponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Fetch questionnaire data
  useEffect(() => {
    if (true) {
      setIsLoading(true);
      setError(null);
      setSubmissionSuccess(false);
      // Simulate API call
      setTimeout(() => {
        // Using MOCK_IKOU_SPA_QUESTIONNAIRE:
        const API_RESPONSE = {
          success: true,
          data: MOCK_IKOU_SPA_QUESTIONNAIRE,
        };
        if (API_RESPONSE.success && API_RESPONSE.data) {
          setQuestionnaire(API_RESPONSE.data);
          const initialResponses = {};
          API_RESPONSE.data.questions.forEach((q) => {
            if (q.type === "date_picker") {
              // Initialize date picker field
              initialResponses[q.id] = undefined; // Calendar expects undefined or Date
            } else if (q.type === "checkbox") {
              initialResponses[q.id] = [];
            } else if (q.type === "rating_scale") {
              // Though not in iKOU mock, keep for generality
              initialResponses[q.id] = null;
            } else {
              initialResponses[q.id] = "";
            }
          });
          setResponses(initialResponses);
        } else {
          setError(
            API_RESPONSE.message || "Mock questionnaire data is invalid."
          );
          setQuestionnaire(null);
        }
        setIsLoading(false);
      }, 500); // Reduced timeout for quicker loading
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handles general input changes, including date picker
  const handleInputChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    if (formErrors[questionId]) {
      setFormErrors((prev) => ({ ...prev, [questionId]: null }));
    }
  };

  const handleCheckboxChange = (questionId, optionValue, checked) => {
    setResponses((prev) => {
      const currentValues = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentValues, optionValue] };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((val) => val !== optionValue),
        };
      }
    });
    if (formErrors[questionId]) {
      setFormErrors((prev) => ({ ...prev, [questionId]: null }));
    }
  };

  const handleSelectChange = (questionId, value) => {
    handleInputChange(questionId, value);
  };

  const handleRadioChange = (questionId, value) => {
    handleInputChange(questionId, value);
  };

  const validateForm = () => {
    if (!questionnaire) return false;
    const errors = {};
    questionnaire.questions.forEach((q) => {
      if (q.isRequired) {
        const value = responses[q.id];
        if (q.type === "checkbox") {
          if (!value || value.length === 0) {
            errors[q.id] = `Please make at least one selection.`;
          }
        } else if (q.type === "date_picker") {
          if (!value) {
            // For date picker, value will be undefined if not selected
            errors[q.id] = `This field is required.`;
          }
        } else if (q.type === "rating_scale") {
          if (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
          ) {
            errors[q.id] = `This field is required.`;
          }
        } else {
          if (!value || String(value).trim() === "") {
            errors[q.id] = `This field is required.`;
          }
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorKey = Object.keys(formErrors)[0];
      if (firstErrorKey) {
        const errorElement = document.getElementById(
          `question-${firstErrorKey}`
        );
        errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmissionSuccess(false);

    const submissionData = {
      questionnaireId: questionnaire._id,
      answers: Object.entries(responses).map(([questionId, value]) => {
        // Format date to string if it's a Date object, e.g., for 'personal_dob'
        const question = questionnaire.questions.find(
          (q) => q.id === questionId
        );
        if (
          question &&
          question.type === "date_picker" &&
          value instanceof Date
        ) {
          return { questionId, value: format(value, "yyyy-MM-dd") }; // Or 'dd/MM/yyyy'
        }
        return { questionId, value };
      }),
    };
    console.log("Submitting Responses:", submissionData);

    setTimeout(() => {
      console.log("Simulated API call for submission.");
      setSubmissionSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  // Loading Skeleton UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-full mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-full" />
                {i === 2 && (
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-12 w-32 ml-auto" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
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

  // Not Found UI
  if (!questionnaire && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert className="max-w-lg">
          <AlertTriangle className="h-5 w-5" />{" "}
          <AlertTitle>Questionnaire Not Found</AlertTitle>
          <AlertDescription>
            The questionnaire you are looking for could not be found.
          </AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
        </Alert>
      </div>
    );
  }

  // Submission Success UI
  if (submissionSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-800/30 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <CardDescription>
              Your responses have been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => {
                setSubmissionSuccess(false);
                setIsLoading(true); // Re-trigger useEffect
              }}
            >
              {" "}
              Fill Again (Demo){" "}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Main Questionnaire Form UI
  return (
    <div className="min-h-screen bg-background text-foreground font-sans py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">
            {" "}
            {questionnaire.title}{" "}
          </CardTitle>
          {questionnaire.description && (
            <CardDescription className="mt-2 text-lg whitespace-pre-line">
              {" "}
              {questionnaire.description}{" "}
            </CardDescription>
          )}
        </CardHeader>
        <Separator className="my-6" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-10">
            {questionnaire.questions.map((q, index) => (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className={`p-6 rounded-lg border transition-all duration-300 ${
                  formErrors[q.id]
                    ? "border-destructive bg-destructive/10"
                    : "border-border bg-card"
                }`}
              >
                <Label
                  htmlFor={q.id}
                  className="block text-xl font-semibold mb-4"
                >
                  {index + 1}. {q.text}
                  {q.isRequired && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>

                {/* Date Picker for Date of Birth */}
                {/* {q.type === "date_picker" && q.id === "personal_dob" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !responses[q.id] && "text-muted-foreground",
                          formErrors[q.id]
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        )}
                        id={q.id}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {responses[q.id] ? (
                          format(responses[q.id], "dd/MM/yyyy")
                        ) : (
                          <span>{q.placeholder || "Pick a date"}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={responses[q.id]}
                        onSelect={(date) => handleInputChange(q.id, date)}
                        initialFocus
                        // captionLayout="dropdown-buttons" // More user-friendly navigation
                        fromYear={1900} // Example: set a range for DOB
                        toYear={new Date().getFullYear()} // Example: up to current year
                      />
                    </PopoverContent>
                  </Popover>
                )} */}

                {q.type === "date_picker" && q.id === "personal_dob" && (
                  <AriaDatePicker className="*:not-first:mt-2">
                    <AriaLabel className="text-foreground text-sm font-medium">
                      Date picker
                    </AriaLabel>
                    <div className="flex">
                      <AriaGroup className="w-full">
                        <DateInput className="pe-9" />
                      </AriaGroup>
                      <AriaButton
                        type="button"
                        className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]"
                      >
                        <CalendarIcon size={16} />
                      </AriaButton>
                    </div>
                    <AriaPopover
                      className="bg-background text-AriaPopover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
                      offset={4}
                    >
                      <AriaDialog className="max-h-[inherit] overflow-auto p-2">
                        <Calendar />
                      </AriaDialog>
                    </AriaPopover>
                  </AriaDatePicker>
                )}

                {q.type === "text" &&
                  q.id !== "personal_dob" && ( // Ensure not to render text input for DOB handled by date_picker
                    <Input
                      id={q.id}
                      type={
                        q.id === "personal_email"
                          ? "email"
                          : q.id === "personal_phone" ||
                            q.id === "emergency_contact_phone"
                          ? "tel"
                          : "text"
                      }
                      value={responses[q.id] || ""}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      placeholder={q.placeholder || "Your answer here..."}
                      className={
                        formErrors[q.id]
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                      required={q.isRequired}
                    />
                  )}

                {q.type === "textarea" && (
                  <Textarea
                    id={q.id}
                    value={responses[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    rows={4}
                    placeholder="Your detailed answer..."
                    className={
                      formErrors[q.id]
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                    required={q.isRequired}
                  />
                )}

                {q.type === "radio" && (
                  <RadioGroup
                    id={q.id}
                    value={responses[q.id] || ""}
                    onValueChange={(value) => handleRadioChange(q.id, value)}
                    className={`mt-2 space-y-2 ${
                      formErrors[q.id]
                        ? "rounded-md border border-destructive p-3"
                        : ""
                    }`}
                    required={q.isRequired}
                  >
                    {q.options.map((opt) => (
                      <div
                        key={opt.value}
                        className="flex items-center space-x-2 p-3 hover:bg-muted/50 rounded-md transition-colors"
                      >
                        <RadioGroupItem
                          value={opt.value}
                          id={`${q.id}-${opt.value}`}
                        />
                        <Label
                          htmlFor={`${q.id}-${opt.value}`}
                          className="font-normal cursor-pointer"
                        >
                          {" "}
                          {opt.label}{" "}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {q.type === "checkbox" && ( // For single confirmation checkbox
                  <div
                    className={`mt-2 flex items-start space-x-2 p-3 hover:bg-muted/50 rounded-md transition-colors ${
                      formErrors[q.id]
                        ? "rounded-md border border-destructive"
                        : ""
                    }`}
                  >
                    <Checkbox
                      id={`${q.id}-${q.options[0].value}`} // Assuming one option for confirmation
                      checked={(responses[q.id] || []).includes(
                        q.options[0].value
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(q.id, q.options[0].value, checked)
                      }
                    />
                    <Label
                      htmlFor={`${q.id}-${q.options[0].value}`}
                      className="font-normal cursor-pointer text-sm leading-relaxed"
                    >
                      {q.options[0].label}
                    </Label>
                  </div>
                )}

                {/* This is a generic dropdown, not used in MOCK_IKOU_SPA_QUESTIONNAIRE but kept for future use */}
                {q.type === "dropdown" && (
                  <Select
                    id={q.id}
                    value={responses[q.id] || ""}
                    onValueChange={(value) => handleSelectChange(q.id, value)}
                    required={q.isRequired}
                  >
                    <SelectTrigger
                      className={
                        formErrors[q.id]
                          ? "border-destructive focus:ring-destructive"
                          : ""
                      }
                    >
                      {" "}
                      <SelectValue placeholder="Select an option" />{" "}
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.value === "" && q.isRequired}
                        >
                          {" "}
                          {opt.label}{" "}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Rating scale, not in MOCK_IKOU_SPA_QUESTIONNAIRE but kept for future use */}
                {q.type === "rating_scale" && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2 px-1">
                      <span>{q.minLabel || `Min: ${q.minRating}`}</span>
                      <span>{q.maxLabel || `Max: ${q.maxRating}`}</span>
                    </div>
                    <div
                      className={`flex flex-wrap gap-2 justify-center p-3 rounded-md ${
                        formErrors[q.id]
                          ? "border border-destructive"
                          : "bg-muted/30"
                      }`}
                    >
                      {[...Array(q.maxRating - q.minRating + 1).keys()].map(
                        (i) => {
                          const ratingValue = q.minRating + i;
                          return (
                            <Button
                              type="button"
                              key={ratingValue}
                              variant={
                                responses[q.id] === ratingValue
                                  ? "default"
                                  : "outline"
                              }
                              size="icon"
                              className={`h-12 w-12 rounded-full text-lg transition-all duration-150 transform hover:scale-110 ${
                                responses[q.id] === ratingValue
                                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                  : ""
                              }`}
                              onClick={() =>
                                handleInputChange(q.id, ratingValue)
                              }
                              title={`Rate ${ratingValue}`}
                            >
                              {" "}
                              {ratingValue}{" "}
                            </Button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {formErrors[q.id] && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {formErrors[q.id]}
                  </p>
                )}
              </div>
            ))}

            <CardFooter className="mt-10 pt-8 flex flex-col items-center">
              {Object.keys(formErrors).length > 0 && (
                <Alert variant="destructive" className="mb-6 w-full">
                  <AlertTriangle className="h-4 w-4" />{" "}
                  <AlertTitle>Validation Errors</AlertTitle>
                  <AlertDescription>
                    {" "}
                    Please correct the highlighted fields above before
                    submitting.{" "}
                  </AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full max-w-xs text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    {" "}
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      {" "}
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>{" "}
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>{" "}
                    </svg>{" "}
                    Submitting...{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Send size={20} className="mr-2" /> Submit Responses{" "}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
