import { redirect } from "next/navigation";

export default function SamiPage() {
  redirect("/archive?season=4,5");
}
