import { auth } from "@/auth";
import ProfileClient from "./profile";
import { redirect} from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();
    // Auth Guard - Redirect to signin if user is not authenticated
    if (!session) {
        redirect("/signin");
    }

    return (
        <main>
            <ProfileClient session={session} />
        </main>
    );
}
