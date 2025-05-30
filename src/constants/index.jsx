export const MOCK_QUESTIONNAIRE = {
  _id: "ikou_spa_booking_v2",
  title: "iKOU Spa - Pre-Treatment Questionnaire",
  description: "Welcome to iKOU Spa!",
  corresponding_gid: "",
  is_active: true,
  service: "APPOINTMENT",
  associated_booking_types: ["virtual"],
  associated_gids: [],
  associated_entities: ["booking_service", "booking_category"],
  group_gid: "",
  customer_email: "",
  is_submitted: false,
  sections: [
    {
      id: "section-1",
      title: "Personal Information",
      group_gid: "",
      questions: [
        {
          id: "personal_full_name",
          name: "personal_full_name",
          description:
            "Please provide your full name as it appears on your ID.",
          label: "Full Name",
          type: "INPUT",
          is_required: true,
          validation: { min_length: 2, max_length: 100, type: null },
          third_party_id: "full_name",
          clear_value_on_customer_edit: true,
          is_staff_only: false,
          group_gid: "",
        },
        {
          id: "personal_dob",
          label: "Date of Birth",
          type: "DATE_PICKER",
          placeholder: "DD/MM/YYYY",
          is_required: true,
        },
        {
          id: "personal_phone",
          label: "Phone Number",
          type: "INPUT",
          is_required: true,

          validation: {
            // pattern:
            //   "^(\\+61\\s?|0)([23478])(\\s?\\d){8}$|^1[38]00(\\s?\\d){6}$|^13(\\s?\\d){4}$",
            // patternMessage:
            //   "Please enter a valid Australian phone number (e.g., 04XX XXX XXX or 0X XXXX XXXX).",
          },
        },
        {
          id: "personal_email",
          label: "Email Address",
          type: "INPUT",
          is_required: true,
          validation: { type: "email" },
        },
        {
          id: "emergency_contact_name",
          label: "Emergency Contact - Name",
          type: "INPUT",
          is_required: true,

          validation: { min_length: 2 },
        },
        {
          id: "emergency_contact_phone",
          label: "Emergency Contact - Phone Number",
          type: "INPUT",
          is_required: true,

          validation: {
            // pattern:
            //   "^(\\+61\\s?|0)([23478])(\\s?\\d){8}$|^1[38]00(\\s?\\d){6}$|^13(\\s?\\d){4}$",
            // patternMessage: "Please enter a valid Australian phone number.",
          },
        },
        // {
        //   id: "health_skin_type",
        //   label: "How would you describe your skin type?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "oily", label: "Oily" },
        //     { value: "dry", label: "Dry" },
        //     { value: "combination", label: "Combination" },
        //     { value: "sensitive", label: "Sensitive" },
        //     { value: "normal", label: "Normal" },
        //   ],
        // },
        // {
        //   id: "health_skin_concerns_bool",
        //   label: "Do you have any specific skin concerns or conditions (e.g., eczema, acne, rosacea)?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        {
          id: "health_skin_concerns_details",
          label: "If yes, please specify your skin concerns or conditions:",
          type: "TEXTAREA",
          is_required: false,

          validation: { max_length: 500 },
        },
        // {
        //   id: "health_skincare_regimen",
        //   label: "Please list any skincare products you are currently using:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 1000 },
        // },
        // {
        //   id: "health_recent_treatments_bool",
        //   label: "Have you had any recent skin treatments or procedures (e.g., chemical peels, laser treatments)?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_recent_treatments_details",
        //   label: "If yes, please provide details of recent skin treatments:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_allergies_bool",
        //   label: "Do you have any known allergies (e.g., skincare ingredients, nuts, essential oils, latex)?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_allergies_details",
        //   label: "If yes, please list your known allergies:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_chronic_conditions_bool",
        //   label: "Do you have any chronic conditions we should be aware of (e.g., diabetes, heart disease, high blood pressure)?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_chronic_conditions_details",
        //   label: "If yes, please specify your chronic conditions:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_recent_surgeries_bool",
        //   label: "Have you had any recent surgeries or injuries?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_recent_surgeries_details",
        //   label: "If yes, please provide details of recent surgeries or injuries:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_blood_clots_bool",
        //   label: "Do you have a history of blood clots or varicose veins?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_medications_bool",
        //   label: "Are you currently taking any medications, including topical treatments?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_medications_details",
        //   label: "If yes, please list your current medications:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_pregnancy_status",
        //   label: "Are you currently pregnant or trying to conceive?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //     { value: "prefer_not_to_say", label: "Prefer not to say" },
        //   ],
        // },
        // {
        //   id: "lifestyle_sun_exposure",
        //   label: "How often are you exposed to the sun?",
        //   type: "RADIO",
        //   is_required: true,

        //   options: [
        //     { value: "daily", label: "Daily" },
        //     { value: "occasionally", label: "Occasionally" },
        //     { value: "rarely", label: "Rarely" },
        //   ],
        // },
        // {
        //   id: "lifestyle_sunscreen_use",
        //   label: "Do you regularly use sunscreen?",
        //   type: "RADIO",
        //   is_required: true,

        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "lifestyle_smoking",
        //   label: "Do you smoke?",
        //   type: "RADIO",
        //   is_required: true,

        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        {
          id: "lifestyle_alcohol",
          label: "Do you consume alcohol regularly?",
          type: "RADIO",
          is_required: true,

          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
        },
        {
          id: "confirmation_agreement",
          label:
            "By selecting this checkbox, I confirm that I have read and understand the above statements and agree to proceed with my treatment.",
          type: "CHECKBOX",
          is_required: true,

          options: [
            { value: "agreed", label: "I confirm and agree" },
            { value: "oh no", label: "I confirm and agree" },
          ],
        },
        {
          id: "trung_dep_trai",
          label:
            "By signing my name below, I confirm that I have read and understand the above statements and agree to proceed with my treatment.",
          type: "SIGNATURE",
          is_required: true,
        },
        // {
        //   id: "confirmation_client_name",
        //   label: "Client Name (Digital Signature)",
        //   type: "INPUT",
        //   is_required: true,
        //
        //   validation: { min_length: 2 },
        // },
        // {
        //   id: "confirmation_date",
        //   label: "Date (DD/MM/YYYY)",
        //   type: "INPUT",
        //   placeholder: "DD/MM/YYYY",
        //   is_required: true,
        //
        //   validation: {
        //     pattern: "^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[012])\\/\\d{4}$",
        //     patternMessage: "Please enter date in DD/MM/YYYY format.",
        //   },
        // },
      ],
    },
    {
      id: "section-2",
      title: "Personal Information 2",
      description: "Please provide your personal information.",
      questions: [
        {
          id: "personal_full_name",
          description:
            "Please provide your full name as it appears on your ID.",
          label: "Full Name",
          type: "INPUT",
          is_required: true,

          validation: { min_length: 2, max_length: 100 },
        },
        {
          id: "personal_dob",
          label: "Date of Birth",
          type: "DATE_PICKER",
          placeholder: "DD/MM/YYYY",
          is_required: true,
        },
        {
          id: "personal_phone",
          label: "Phone Number",
          type: "INPUT",
          is_required: true,

          validation: {
            // pattern:
            //   "^(\\+61\\s?|0)([23478])(\\s?\\d){8}$|^1[38]00(\\s?\\d){6}$|^13(\\s?\\d){4}$",
            // patternMessage:
            //   "Please enter a valid Australian phone number (e.g., 04XX XXX XXX or 0X XXXX XXXX).",
          },
        },
        {
          id: "personal_email",
          label: "Email Address",
          type: "INPUT",
          is_required: true,

          validation: { type: "email" },
        },
        {
          id: "emergency_contact_name",
          label: "Emergency Contact - Name",
          type: "INPUT",
          is_required: true,

          validation: { min_length: 2 },
        },
        {
          id: "emergency_contact_phone",
          label: "Emergency Contact - Phone Number",
          type: "INPUT",
          is_required: true,

          validation: {
            // pattern:
            //   "^(\\+61\\s?|0)([23478])(\\s?\\d){8}$|^1[38]00(\\s?\\d){6}$|^13(\\s?\\d){4}$",
            // patternMessage: "Please enter a valid Australian phone number.",
          },
        },
        // {
        //   id: "health_skin_type",
        //   label: "How would you describe your skin type?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "oily", label: "Oily" },
        //     { value: "dry", label: "Dry" },
        //     { value: "combination", label: "Combination" },
        //     { value: "sensitive", label: "Sensitive" },
        //     { value: "normal", label: "Normal" },
        //   ],
        // },
        // {
        //   id: "health_skin_concerns_bool",
        //   label: "Do you have any specific skin concerns or conditions (e.g., eczema, acne, rosacea)?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        {
          id: "health_skin_concerns_details",
          label: "If yes, please specify your skin concerns or conditions:",
          type: "TEXTAREA",
          is_required: false,

          validation: { max_length: 500 },
        },
        // {
        //   id: "health_skincare_regimen",
        //   label: "Please list any skincare products you are currently using:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 1000 },
        // },
        // {
        //   id: "health_recent_treatments_bool",
        //   label: "Have you had any recent skin treatments or procedures (e.g., chemical peels, laser treatments)?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_recent_treatments_details",
        //   label: "If yes, please provide details of recent skin treatments:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_allergies_bool",
        //   label: "Do you have any known allergies (e.g., skincare ingredients, nuts, essential oils, latex)?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_allergies_details",
        //   label: "If yes, please list your known allergies:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_chronic_conditions_bool",
        //   label: "Do you have any chronic conditions we should be aware of (e.g., diabetes, heart disease, high blood pressure)?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_chronic_conditions_details",
        //   label: "If yes, please specify your chronic conditions:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_recent_surgeries_bool",
        //   label: "Have you had any recent surgeries or injuries?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_recent_surgeries_details",
        //   label: "If yes, please provide details of recent surgeries or injuries:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_blood_clots_bool",
        //   label: "Do you have a history of blood clots or varicose veins?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_medications_bool",
        //   label: "Are you currently taking any medications, including topical treatments?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "health_medications_details",
        //   label: "If yes, please list your current medications:",
        //   type: "textarea",
        //   is_required: false,
        //
        //   validation: { max_length: 500 },
        // },
        // {
        //   id: "health_pregnancy_status",
        //   label: "Are you currently pregnant or trying to conceive?",
        //   type: "RADIO",
        //   is_required: true,
        //
        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //     { value: "prefer_not_to_say", label: "Prefer not to say" },
        //   ],
        // },
        // {
        //   id: "lifestyle_sun_exposure",
        //   label: "How often are you exposed to the sun?",
        //   type: "RADIO",
        //   is_required: true,

        //   options: [
        //     { value: "daily", label: "Daily" },
        //     { value: "occasionally", label: "Occasionally" },
        //     { value: "rarely", label: "Rarely" },
        //   ],
        // },
        // {
        //   id: "lifestyle_sunscreen_use",
        //   label: "Do you regularly use sunscreen?",
        //   type: "RADIO",
        //   is_required: true,

        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        // {
        //   id: "lifestyle_smoking",
        //   label: "Do you smoke?",
        //   type: "RADIO",
        //   is_required: true,

        //   options: [
        //     { value: "yes", label: "Yes" },
        //     { value: "no", label: "No" },
        //   ],
        // },
        {
          id: "lifestyle_alcohol",
          label: "Do you consume alcohol regularly?",
          type: "RADIO",
          is_required: true,

          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
        },
        {
          id: "confirmation_agreement",
          label:
            "By selecting this checkbox, I confirm that I have read and understand the above statements and agree to proceed with my treatment.",
          type: "CHECKBOX",
          is_required: true,

          options: [
            { value: "agreed", label: "I confirm and agree" },
            { value: "oh no", label: "I confirm and agree" },
          ],
        },
        {
          id: "trung_dep_trai",
          label:
            "By signing my name below, I confirm that I have read and understand the above statements and agree to proceed with my treatment.",
          type: "SIGNATURE",
          is_required: true,
        },
        // {
        //   id: "confirmation_client_name",
        //   label: "Client Name (Digital Signature)",
        //   type: "INPUT",
        //   is_required: true,
        //
        //   validation: { min_length: 2 },
        // },
        // {
        //   id: "confirmation_date",
        //   label: "Date (DD/MM/YYYY)",
        //   type: "INPUT",
        //   placeholder: "DD/MM/YYYY",
        //   is_required: true,
        //
        //   validation: {
        //     pattern: "^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[012])\\/\\d{4}$",
        //     patternMessage: "Please enter date in DD/MM/YYYY format.",
        //   },
        // },
      ],
    },
  ],
};
