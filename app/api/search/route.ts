import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import stringSimilarity from 'string-similarity';

/**
 * Types in order to help with extracting threads
 */
export interface Thread {
    title: string;
    answers: Answer[];
}

export interface Answer {
    user: string;
    timestamp: string;
    content: string;
}

/**
 * Threshold of Similarity
 * The threshold determines the minimum degree of similarity required for the result to be included
 * A lower threshold means that results with a lower degree of similarity will be included
 */
const WEIGHT_THRESHOLD = 0.2;

/**
 * GET Request handler for retrieving threads
 * @param request 
 * @returns NextResponse 
 */
export async function GET(request: NextRequest) {
    try {
        // Extract the query from the URL search parameters
        const url = new URL(request.url);
        const query = url.searchParams.get('query') || '';

        // Read the JSON file
        const jsonFilePath = path.join(process.cwd(), 'data', 'data.json');
        const fileData = fs.readFileSync(jsonFilePath, 'utf8');
        const data = JSON.parse(fileData);

        // Extract threads from the JSON data
        const threads: Thread[] = data.threads || [];

        if (threads.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Compute similarity scores and filter
        const results = threads.map(thread => {
            // Use the 'stringSimilarity' dependency to compute a number between 0-1 on the degree of similarity
            const titleSimilarity = stringSimilarity.compareTwoStrings(query, thread.title);
            
            // Additional context similarity (e.g. first answer) could be considered
            const firstAnswerContent = thread.answers[0]?.content || '';
            const contentSimilarity = stringSimilarity.compareTwoStrings(query, firstAnswerContent);

            // Combine the similarities for better matching
            const combinedSimilarity = (titleSimilarity + contentSimilarity) / 2;

            return { thread, similarity: combinedSimilarity };
        })
        // Filter based on the threshold, sort from high similarity to low and return only the threads.
        .filter(result => result.similarity > WEIGHT_THRESHOLD)
        .sort((a, b) => b.similarity - a.similarity)
        .map(result => result.thread);

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Failed to process request', details: error }, { status: 500 });
    }
}
