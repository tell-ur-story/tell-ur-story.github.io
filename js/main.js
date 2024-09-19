// main.js

async function createRepoAndPR() {
    const token =
      "VJ0cxlWam9mSFZUVQhFRWZ3Uxknbi9URDV2Zh5WZTJ3MxYDZwIHRysUOPtkTsllM4kjYClkR0VFSoF2XPhXMyJTc3sUO5gDawkFUWpUTMJUMx8FdhB3XiVHa0l2Z"; // GitHub token (encrypted)
  
    const repoName = document.getElementById("repoName").value; // Get repository name
  
    if (!repoName) {
      alert("Please enter a repository name.");
      return;
    }
  
    // Repository details
    const repoData = {
      name: repoName,
      description: "This is my new repository",
      private: false,
    };
  
    // Create the repository
    try {
      const repoResponse = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `token ${atob(token.split("").reverse().join(""))}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify(repoData),
      });
  
      const repoResult = await repoResponse.json();
  
      if (repoResponse.ok) {
        console.log("Repository created:", repoResult);
  
        const content = `<html>
                            <head><title>${repoName}</title></head>
                            <body>
                              <h1>${repoName}</h1>
                              <p>This is a placeholder page for the ${repoName} repository.</p>
                            </body>
                          </html>`;
  
        const fileData = {
          message: "initial commit",
          content: btoa(content),
          branch: "main",
        };
  
        // Push the index.html file to the repository
        const fileResponse = await fetch(
          `https://api.github.com/repos/${repoResult.full_name}/contents/index.html`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${atob(token.split("").reverse().join(""))}`,
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify(fileData),
          }
        );
        console.log("File pushed:", await fileResponse.json());
  
        // Enable GitHub Pages
        const pagesData = {
          source: {
            branch: "main",
            path: "/",
          },
        };
  
        const pagesResponse = await fetch(
          `https://api.github.com/repos/${repoResult.full_name}/pages`,
          {
            method: "POST",
            headers: {
              Authorization: `token ${atob(token.split("").reverse().join(""))}`,
              Accept: "application/vnd.github.v3+json",
            },
            body: JSON.stringify(pagesData),
          }
        );
        console.log("GitHub Pages enabled:", await pagesResponse.json());
  
        // Display the GitHub Pages URL
        const repoUrl = `https://my-story-teller.github.io/${repoName}/`;
        document.getElementById(
          "repoUrl"
        ).innerHTML = `Your site URL: <a href="${repoUrl}" target="_blank">Visit your site</a>`;
      } else {
        console.error("Failed to create repository:", repoResult);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  // Add click event listener for the button
  document.getElementById("createBtn").addEventListener("click", createRepoAndPR);
  