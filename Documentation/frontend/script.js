document.addEventListener("DOMContentLoaded", () => {
    const docsList = document.getElementById("docs-list");
    const searchBar = document.getElementById("search-bar");

    let allDocs = [];

    // Fetch markdown files
    fetch("/api/docs")
        .then(response => response.json())
        .then(docs => {
            allDocs = docs;
            displayDocs(docs);
        })
        .catch(err => console.error("Error fetching markdown files:", err));

    function displayDocs(docs) {
        docsList.innerHTML = "";
        docs.forEach(doc => {
            let listItem = document.createElement("li");
            listItem.textContent = doc.file.replace(".md", "");
            listItem.onclick = () => loadMarkdown(doc.file);
            docsList.appendChild(listItem);
        });
    }

    searchBar.addEventListener("input", () => {
        let query = searchBar.value.toLowerCase();
        let filteredDocs = allDocs.filter(doc =>
            doc.file.toLowerCase().includes(query)
        );
        displayDocs(filteredDocs);
    });
});

function loadMarkdown(filename) {
    fetch(`/docs/${filename}`)
        .then(response => response.text())
        .then(text => {
            const contentDiv = document.getElementById("content");
            contentDiv.innerHTML = marked.parse(text);

            // Improve code block styling
            document.querySelectorAll("pre code").forEach(block => {
                block.classList.add("hljs");
            });
        })
        .catch(err => console.error("Error loading markdown:", err));
}