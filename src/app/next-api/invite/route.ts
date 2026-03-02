import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface SurveyRequestBody {
    survey: string; // JSON string
}

export async function POST(req: NextRequest) {
    try {
        // Parse the JSON body
        const body: SurveyRequestBody = await req.json();

        // Validate the input
        if (!body.survey) {
            return NextResponse.json(
                { error: "Survey body is required" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db("rustDB"); // Replace with your DB name
        const invitesCollection = db.collection("invite");

        const existingEntry = await invitesCollection.findOne({
            survey: body.survey,
        });
        if (existingEntry) {
            return NextResponse.json(
                { error: "Survey already exists" },
                { status: 409 }, // Conflict
            );
        }

        const result = await invitesCollection.insertOne({
            survey: body.survey,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: "Survey added successfully", id: result.insertedId },
            { status: 201 },
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 },
        );
    }
}
