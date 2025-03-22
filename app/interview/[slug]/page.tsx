import ListView from "@/components/ListView";
import React from "react";

const QuestionsListPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  return <ListView slug={slug} />;
};

export default QuestionsListPage;
