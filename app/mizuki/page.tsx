import { redirect } from "next/navigation";

export default function MizukiPage() {
  redirect("/archive?season=3");
}
