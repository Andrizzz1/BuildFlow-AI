import type { Dispatch, SetStateAction } from "react";
import type{ Worker } from "@/types/types";
export async function Fetch_workers(
    setMemberdets: Dispatch<SetStateAction<Worker[]>>
) {
    try {
        const res = await fetch('http://localhost:3000/total_worker');
        const data = await res.json();
        console.log(data);

        if (!Array.isArray(data)) {
            console.error("Expected an array, got:", data);
            return;
        }
        setMemberdets(data);
    } catch (err) {
        console.error("Failed to fetch members:", err);
    }
}