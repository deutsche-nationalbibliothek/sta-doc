import fs from "fs";

const inputFile = fs.readFileSync ("CSS-PATHS.md", "utf-8");
const lines = inputFile.split("\n"); // array

const csvHeader = "Kategorie,Pfad";
const csvRows = [];

let category = "";

lines.forEach((line) => {
    const singleLine = line.trim();
    if (!singleLine) return;

    const mdHeading = singleLine.startsWith("##") // boolean
    const mdComment = singleLine.startsWith("<!--")
    const mdPath = singleLine.endsWith(".tsx") || singleLine.endsWith(".css")

    if (mdHeading) {
        category = singleLine.replace("## ", "");
    }
    else if (mdPath) {
        csvRows.push(`${category},${singleLine}`)
    }
    else if (mdComment) return
    else return
})

const data = [csvHeader, ...csvRows].join(",\n"); 

fs.writeFileSync("css-overview.csv", data, "utf-8") // file, data, options