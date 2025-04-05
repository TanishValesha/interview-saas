import { apiUrl } from "../libs/apiUrl";

export async function getInterviewDetails(slug: string) {
  const response = await fetch(`${apiUrl}/interview/${slug}`);
  if (response.ok) {
    const data = await response.json();
    return data.data;
  } else {
    console.error("Failed to fetch questions");
  }
}
