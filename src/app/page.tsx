import HomePage from "@/components/layout/homepage";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log(">>> check session")
  return (
    <div>
      <HomePage />
    </div>
  );
}
