import { auth } from "@/auth";
import MedicalResources from "./tips";


export default async function Tips() {
const session = await auth()
  return (
    <main>
      <MedicalResources session={session} />   
      </main>
  );
}