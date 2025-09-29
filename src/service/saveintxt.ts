
import * as fs from 'fs/promises'; // Note we're using the promises version now
import * as path from 'path';

// The text you want to save
const textToSave: string = 'Hello, this is a sample text to save to a file.';

// Async function to save text to a file
export async function saveTextToFile(text: string, fileName: string = 'output.txt'): Promise<void> {
    try {
        // Get the current directory
        const currentDir: string = __dirname;

        // Create the full path to the file
        const filePath: string = path.join('./src/service/', fileName);
        // const filePath: string = "C:/Users/walka/OneDrive/Desktop/output.txt"
        
        // Write the file using await
        await fs.writeFile(filePath, text);
        console.log(`Text has been saved to ${filePath} successfully.`);
    } catch (err) {
        console.error('An error occurred while writing to the file:', err);
        // Re-throw the error if you want calling code to handle it
        throw err;
    }
}

// // IIFE (Immediately Invoked Function Expression) to use async/await at top level
// (async () => {
//     try {
//         await saveTextToFile(textToSave);
//     } catch (err) {
//         console.error('Failed to save file:', err);
//     }
// })();






























// import * as fs from 'fs';
// import * as path from 'path';

// // The text you want to save
// const textToSave: string = 'Hello, this is a sample text to save to a file.';

// // The name of the file you want to save to


// // Function to save text to a file
// export function saveTextToFile(text: string): void {

//     const fileName: string = 'output.txt';

//     // Get the current directory
//     const currentDir: string = __dirname;

//     // Create the full path to the file
//     const filePath: string = path.join(currentDir, fileName);
//     console.log("here",text[0],filePath)
//     fs.writeFile(filePath, text, (err) => {
//         if (err) {
//             console.error('An error occurred while writing to the file:', err);
//         } else {
//             console.log('Text has been saved to the file successfully.');
//         }
//     });
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('An error occurred while reading the file:', err);
//             return;
//         }
//         console.log('File content:', data);
//     })
// }

// // Call the function to save the text
// saveTextToFile(textToSave);
