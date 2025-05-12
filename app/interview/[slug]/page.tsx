import ListView from "@/components/ListView";
import React from "react";

const QuestionsListPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <ListView slug={slug} />;
};

export default QuestionsListPage;
