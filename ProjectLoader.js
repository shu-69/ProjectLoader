const readline = require('readline');
const { createCanvas } = require('canvas');
const fs = require('fs');
const util = require('util');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const { execSync } = require('child_process');
const path = require('path');

const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';

const loader = ['-', '\\', '|', '/'];
let projects = [];
let selectedIndex = 0;

let lineCount = 0;

const originalLog = console.log;
console.log = function () {
    lineCount++;
    originalLog.apply(console, arguments);
};

console.clear()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.input.on('keypress', (_, key) => {
    if (key.name === 'end') {
        rl.close();
        process.exit(0)
    }
});

initApp()

async function initApp() {
    await loadProjects();
    generateWelcomeText();
    initProjects();
}

function generateWelcomeText() {
    const userName = process.env.USERNAME || process.env.USER || '';
    const text = `Hii, \n`; lineCount++;
    console.log(text);
    printNameArt(userName.toUpperCase());
    console.log();
    console.log(`Ready to get things done?`);
    console.log();
    console.log(`Which project would you like to work on? Or press 'end' if feeling lazy 😴.`);
    console.log();

    return text;
}

function printNameArt(text) {
    try {

        const width = 80;
        const height = 20;

        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        context.font = '16px monospace';
        // context.font = 'monospace';
        context.textAlign = 'left';
        context.textBaseline = 'middle';

        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);

        context.fillStyle = 'black';
        context.fillText(text, 0, (height / 2));

        for (let y = 0; y < height; y++) {
            let line = '';
            for (let x = 0; x < width; x++) {
                const pixel = context.getImageData(x, y, 1, 1).data;
                const isWhite = pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255;
                line += isWhite ? ' ' : '*';
            }

            if (line.trim().length === 0) {
                continue;
            }

            console.log(line);
        }

        // const width = 80;
        // const height = 20;

        // const canvas = createCanvas(width, height);
        // const context = canvas.getContext('2d');
        // //context.font = '10px SansSerif';
        // context.font = 'SansSerif';
        // context.fillStyle = 'white';
        // context.fillRect(0, 0, width, height);
        // context.fillStyle = 'black';
        // context.fillText(text, 0, 10);

        // let x = 0; // Initialize the x-coordinate for drawing each letter
        // const letterSpacing = 10; // Adjust the letter spacing here

        // for (let i = 0; i < text.length; i++) {
        //   const letter = text[i];
        //   context.fillText(letter, x, 10);
        //   x += letterSpacing; // Move the x-coordinate by the letter spacing
        //   context.fillText(' ', x, 10); // Add an extra space after each letter
        //   x += letterSpacing; // Move the x-coordinate by the letter spacing plus the space width
        // }


        // for (let y = 0; y < height; y++) {
        //     let line = '';
        //     for (let x = 0; x < width; x++) {
        //         const pixel = context.getImageData(x, y, 1, 1).data;
        //         const isWhite = pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255;
        //         line += isWhite ? ' ' : '%';
        //     }

        //     if (line.trim().length === 0) {
        //         continue;
        //     }

        //     console.log(line);
        // }
    } catch (error) {
        console.error(error)
        console.log(text.toUpperCase());
    }
}

async function loadProjects() {

    projects = []

    const readFileAsync = util.promisify(fs.readFile);

    try {
        const data = await readFileAsync('D:\\work\\personal\\ProjectLoader\\projects.json', 'utf8');
        projects = JSON.parse(data);

    } catch (err) {
        console.error('Error reading/parsing JSON file:', err);
    }

}

function initProjects() {

    displayProjects();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.input.on('keypress', (_, key) => {
        if (key.name === 'up') {
            selectedIndex = Math.max(selectedIndex - 1, 0);
            displayProjects();
        } else if (key.name === 'down') {
            selectedIndex = Math.min(selectedIndex + 1, projects.length - 1);
            displayProjects();
        } else if (key.name === 'return') {
            runCommands(projects[selectedIndex]['project-title'], projects[selectedIndex].path, projects[selectedIndex].commands, projects[selectedIndex].open_new_project_terminal)
            rl.close();
        }
    });
}

async function displayProjects() {

    readline.cursorTo(process.stdout, 0, 17); // 17
    readline.clearScreenDown(process.stdout);
    // readline.moveCursor(process.stdout, -columns, 0);
    projects.forEach((element, index) => {
        if (index === selectedIndex) {
            process.stdout.write(GREEN + '(*) ');
        } else {
            process.stdout.write('( ) ');
        }
        console.log(element['project-title'] + RESET);
    });

}

function runCommands(projectTitle, projectPath, commands, open_new_project_terminal) {

    process.chdir(projectPath);
    console.log("Project working directory: " + process.cwd());

    let index = 0;

    function runNextCommand() {
        if (index >= commands.length) {

            if (open_new_project_terminal) {

                const windowsCommand = `start cmd.exe /K`;

                exec(windowsCommand, (error, stdout, stderr) => {
                    if (error) {

                    } else if (stderr) {

                    } else {
                        // If window is closed or task is finished
                        //clearInterval(loaderInterval);
                    }
                });

                console.log(`${GREEN}\u2713 Project opened in new terminal window. ${RESET}`);

            }

            console.log(`All commands executed. ${projectTitle} is ready to work on! ✌️`);

            // console.log()
            // console.log('Do you want to change the current directory to project directory?')

            // const rl = readline.createInterface({
            //     input: process.stdin,
            //     output: process.stdout,
            // });

            // selectedOptionIndex = 0;

            // let options = ['yes', 'no'];

            // rl.input.on('keypress', (_, key) => {
            //     if (key.name === 'up') {
            //         selectedOptionIndex = Math.max(selectedOptionIndex - 1, 0);
            //     } else if (key.name === 'down') {
            //         selectedOptionIndex = Math.min(selectedOptionIndex + 1, options.length - 1);
            //     } else if (key.name === 'return') {
            //         rl.close();
            //     }
            // });

            // options.forEach((element, index) => {
            //     if (index === selectedOptionIndex) {
            //         process.stdout.write(GREEN + '> ');
            //     } else {
            //         process.stdout.write('> ');
            //     }
            //     console.log(element + RESET);
            // });

            process.exit(0)
            return;
        }

        const command = commands[index].cmd;

        if (commands[index].new_window) {

            // let currentFrame = 0;
            // const loaderInterval = setInterval(() => {

            //     process.stdout.clearLine();

            //     process.stdout.cursorTo(0);

            //     process.stdout.write(`${loader[currentFrame]} Executing command: ${command}`);

            //     currentFrame = (currentFrame + 1) % loader.length;
            // }, 100);

            const windowsCommand = `start cmd.exe /K "${command}"`;

            exec(windowsCommand, (error, stdout, stderr) => {
                if (error) {

                } else if (stderr) {

                } else {
                    // If window is closed or task is finished
                    //clearInterval(loaderInterval);
                }
            });

            console.log(`${GREEN}\u2713 Command '${command}' started in new terminal window. ${RESET}`);
            index++;
            runNextCommand();

        } else {

            let currentFrame = 0;
            const loaderInterval = setInterval(() => {

                process.stdout.clearLine();

                process.stdout.cursorTo(0);

                process.stdout.write(`${loader[currentFrame]} Executing command: ${command}`);

                currentFrame = (currentFrame + 1) % loader.length;
            }, 100);

            const childProcess = spawn(command, { shell: true });

            childProcess.on('exit', (code) => {
                if (code === 0) {
                    clearInterval(loaderInterval);
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    console.log(`${GREEN}\u2713 Command '${command}' completed successfully.${RESET}`);
                } else {
                    console.log(`Command '${command}' failed with exit code ${code}.`);
                }

                index++;
                runNextCommand();
            });

        }

    }

    runNextCommand()

}

function startLoader() {

    const loader = ['-', '\\', '|', '/']; // Loader animation frames
    let currentFrame = 0;

    // Start the loader animation
    const loaderInterval = setInterval(() => {

        process.stdout.clearLine();

        // Move the cursor to the beginning of the line
        process.stdout.cursorTo(0);

        // Display the current frame
        process.stdout.write(`Loading ${loader[currentFrame]}`);

        // Move to the next frame
        currentFrame = (currentFrame + 1) % loader.length;
    }, 100);

    // Simulate a long-running task
    setTimeout(() => {
        // Stop the loader animation
        clearInterval(loaderInterval);

        // // Clear the console
        // console.clear();

        // // Display a completion message
        console.log('Loading completed');
    }, 5000);

}

function clearLines(count) {
    process.stdout.write(`\x1b[${count}A\x1b[0J`);
}

function getTotalLines() {
    const [columns, rows] = process.stdout.getWindowSize();
    return rows;
}