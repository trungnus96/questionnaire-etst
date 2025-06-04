export function processQuestionnaireData({ questionnaire = {} }) {
  const { sections = [] } = questionnaire;

  const questions = [];

  const mapped_sections = sections.map((section) => {
    const { items = [] } = section;

    const mapped_items = items.map((item) => {
      const { reference_id = "" } = item;
      return {
        ...item,
        // for form
        id: reference_id,
        name: reference_id,
      };
    });

    questions.push(...mapped_items);

    return {
      ...section,
      items: mapped_items,
    };
  });

  return {
    questionnaire,
    sections: mapped_sections,
    questions,
  };
}

export function processSubmittedQuestionnaireResponse({
  questionnaire_response = {},
  related_submitted_answer,
} = {}) {
  const { answers = [] } = questionnaire_response;

  const submitted_answers = new Map();

  for (const answer of answers) {
    const { reference_id = "", value = [] } = answer;
    submitted_answers.set(reference_id, {
      value: value.filter((v) => v),
      related_submitted_answer,
    });
  }

  return { submitted_answers };
}
