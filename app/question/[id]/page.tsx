import QuestionView from "@/components/QuestionView";
import React from "react";

const QuestionPage = ({ params }: { params: { id: string } }) => {
  return <QuestionView id={params.id} />;
};

export default QuestionPage;
