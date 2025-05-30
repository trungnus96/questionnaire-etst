export function processQuestionnaireData({ questionnaire = {} }) {
  const { sections = [] } = questionnaire;

  const questions = [];

  const mapped_sections = sections.map((section) => {
    const { items = [] } = section;

    const mapped_items = items.map((item) => {
      const { reference_id = "", g_id } = item;
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
