const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Function to read tags from Markdown files
function extractTags(content) {
    const match = content.match(/^---\n(?:tags: \[([^\]]+)\])\n---/);
    return match ? match[1].split(",").map(tag => tag.trim().replace(/"/g, "")) : [];
}

// API to get list of markdown files with tags
app.get("/api/docs", (req, res) => {
    const docsPath = path.join(__dirname, "docs");

    fs.readdir(docsPath, (err, files) => {
        if (err) return res.status(500).json({ error: "Failed to read files" });

        const mdFiles = files.filter(file => file.endsWith(".md"));
        let docsWithTags = [];

        mdFiles.forEach(file => {
            const filePath = path.join(docsPath, file);
            const content = fs.readFileSync(filePath, "utf-8");
            const tags = extractTags(content);

            docsWithTags.push({ file, tags });
        });

        res.json(docsWithTags);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
