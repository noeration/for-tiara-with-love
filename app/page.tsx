import { BirthdayExperience } from "@/components/experience/birthday-experience";
import { getPublished } from "@/lib/content-store";

export const instant = false;

export default async function Home() {
  const { config } = await getPublished();
  return <BirthdayExperience content={config} />;
}
