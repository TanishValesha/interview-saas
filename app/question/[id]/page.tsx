import QuestionView from "@/components/QuestionView";
import React from "react";

const QuestionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return <QuestionView id={id} />;
};

export default QuestionPage;
