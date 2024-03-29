import { selectFiles } from "select-files-cli";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";


/**
 * @description Ready the body data for mails
 * @param {*} option 
 * @returns 
 */
export const getBodyData = async (option) => {

    console.log(option);
    let body = "";
    if (option === "Enter your message here") {
        const res = await inquirer.prompt({
            type: "editor",
            name: "body",
        });
        body = res.body;

    } else {
        const bodyFile = await selectFiles({
            startingPath: "./assets",
            directoryFilter: () => false,
            fileFilter: (fileName) => fileName.endsWith(".txt"),
            multi: false
        })

        // console.log(fs.readFileSync(path.resolve(bodyFile.selectedFiles[0]),"utf8"));

        if (bodyFile.selectedFiles.length > 0) {
            body = fs.readFileSync(path.resolve(`./${bodyFile.selectedFiles[0]}`), "utf8");
        }
    }

    return body;

}

/**
 * @description Gets Mail Prompts
 * @param {json} csv 
 * @param {boolean} isCertificate 
 * @returns {json}
 */
export const getMailPrompts = async (csv) => {
    const res = await inquirer.prompt([
        {
            type: "list",
            name: "filepath",
            choices: [...Object.keys(csv[0]), "I don't want to attach any file"],
        },
        {
            type: "list",
            name: "file_name",
            choices: [...Object.keys(csv[0]), "I don't want to attach any file"],
        },
        {
            type: "list",
            name: "name",
            choices: Object.keys(csv[0]),
        },
        {
            type: "list",
            name: "email",
            choices: Object.keys(csv[0]),
        },
        {
            type: "input",
            name: "subject",
            message: "Subject",
        },
        {
            type: "list",
            name: "bodyOption",
            choices: [
                "Enter your message here",
                "Fetch from a .txt file",
            ]
        }
    ]);

    return res;
}

export const parseBody = (body, data) => {    
    const regex = /{{(.*?)}}/g;

    const matches = body.match(regex);

    if (matches) {
        matches.forEach(match => {
            const key = match.replace(/{{|}}/g, "").trim();
            body = body.replace(match, data[key]);
        })
    }

    return body;
}



