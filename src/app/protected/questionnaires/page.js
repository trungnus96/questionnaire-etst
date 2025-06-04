// components
import QuestionnairePage from "@/components/questionnaires/QuestionnairePage";

export default async function Page(props = {}) {
  // extra props
  const extra_props = {
    include_staff_only_items: true,
  };

  return <QuestionnairePage {...props} {...extra_props} />;
}
