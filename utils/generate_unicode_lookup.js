// Required modules: fetch is built-in from Node.js v18+, fs/promises for file system access
import { writeFile } from 'fs/promises';
import { EOL } from 'os'; // To handle different line endings robustly

const url = "https://www.unicode.org/Public/UCD/latest/ucd/UnicodeData.txt";
const outputFilename = "unicode_data.json";

async function generateUnicodeDataJson() {
    console.log(`Workspaceing data from ${url}...`);
    const unicodeData = [];

    try {
        // Fetch the data from the URL
        const response = await fetch(url);

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        // Get the response body as text
        const textData = await response.text();
        console.log("Data fetched successfully. Processing...");

        // Split the text into lines, handling different OS line endings
        const lines = textData.split(EOL);

        // Process each line
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) {
                continue; // Skip empty lines
            }

            const fields = trimmedLine.split(';');

            // Ensure we have at least the code and name fields
            // Ignore lines representing ranges (e.g., <..., First>, <..., Last>)
            if (fields.length >= 2 && !fields[1].startsWith('<') && !fields[1].endsWith('Last>')) {
                const code = fields[0];
                const name = fields[1];
                unicodeData.push({ code: code, name: name });
            }
        }

        console.log(`Processed ${unicodeData.length} character entries.`);

        // Convert the array to a JSON string with pretty printing
        const jsonData = JSON.stringify(unicodeData, null, 2); // null, 2 for indentation

        // Write the JSON data to the output file
        await writeFile(outputFilename, jsonData, 'utf8');

        console.log(`Successfully created ${outputFilename}`);

    } catch (error) {
        console.error("An error occurred:", error);
        if (error instanceof TypeError && error.message.includes('fetch is not defined')) {
             console.error("\nHint: Make sure you are running Node.js version 18 or newer, or install a fetch polyfill like 'node-fetch'.");
        } else if (error.code === 'ENOENT') {
             console.error("\nHint: Check if the directory exists or if you have write permissions.");
        }
    }
}

// Run the function
generateUnicodeDataJson();