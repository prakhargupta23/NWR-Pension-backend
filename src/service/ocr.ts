import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

export async function runPythonScript(scriptPath: string): Promise<{ stdout: string, stderr: string }> {
    try {
        // Construct the command with proper path handling
        const command = `python "${path.resolve(scriptPath)}"`;
        
        console.log(`Executing: ${command}`);
        
        // Execute the command with timeout
        const { stdout, stderr } = await execAsync(command, { timeout: 100000 });
        
        console.log('Python Output:', stdout);
        if (stderr) console.warn('Python Warnings:', stderr);
        
        return { stdout, stderr };
    } catch (error: any) {
        if (error.code === 'ETIMEDOUT') {
            console.error('Python script timed out after 30 seconds');
        }
        console.error('Error executing Python script:', error.message);
        throw error;
    }
}

// Example usage
// (async () => {
//     try {
//         const scriptPath = './file.py';
        
//         await runPythonScript(scriptPath);
//         console.log('Python script executed successfully!');
//     } catch (error) {
//         console.error('Failed to run Python script:', error);
//         process.exit(1);
//     }
// })();