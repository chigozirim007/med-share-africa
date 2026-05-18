import { auth } from "@/auth";
import UploadClient from "./upload";
import { redirect } from "next/navigation";

export default async function Upload () {
    const session = await auth()
    if (!session) {
        redirect("/signin")
    }
    return (
        <main>
            <UploadClient session={session} />
        </main>
    )
}