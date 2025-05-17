export async function getInterviewDetails(slug: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/interview/${slug}`
  );
  if (response.ok) {
    const data = await response.json();
    return data.data;
  } else {
    console.error("Failed to fetch questions");
  }
}
