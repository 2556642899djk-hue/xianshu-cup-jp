import { redirect } from "next/navigation";

export default function SarkazPage() {
  redirect("/archive?season=6,7");
}
