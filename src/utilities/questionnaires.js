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
} = {}) {
  const { answers = [] } = questionnaire_response;

  let submitted_answers = {};
  answers.forEach((answer) => {
    const { reference_id = "", value = [] } = answer;
    submitted_answers[reference_id] = value.filter((v) => v);
  });

  return { submitted_answers };
}
