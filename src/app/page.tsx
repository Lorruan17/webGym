import { redirect } from "next/navigation";

export default function Home() {
  redirect("/init");
  return null;
}
