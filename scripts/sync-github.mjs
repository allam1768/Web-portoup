import fs from 'fs';
import path from 'path';

const GITHUB_USERNAME = 'allam1768';
const PORTFOLIO_JSON_PATH = path.join(process.cwd(), 'src/data/portfolio-data.json');

async function syncGithubProjects() {
  try {
    console.log(`fetching repos from github for ${GITHUB_USERNAME}...`);
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
      headers: {
        'User-Agent': 'Node.jsPortfolioSync',
      },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const repos = await res.json();

    // Filter repos with topic 'portfolio-project' or non-fork repos with description
    let portfolioRepos = repos.filter((repo) => Array.isArray(repo.topics) && repo.topics.includes('portfolio-project'));

    if (portfolioRepos.length === 0) {
      portfolioRepos = repos.filter((repo) => !repo.fork && repo.name !== GITHUB_USERNAME);
    }

    // Read current portfolio-data.json
    const jsonContent = fs.readFileSync(PORTFOLIO_JSON_PATH, 'utf-8');
    const portfolioData = JSON.parse(jsonContent);

    // Map existing images by project name to preserve custom uploaded images
    const existingImageMap = new Map();
    if (Array.isArray(portfolioData.projectData)) {
      portfolioData.projectData.forEach((item) => {
        if (item.projectName && item.image) {
          existingImageMap.set(item.projectName.toLowerCase(), item.image);
        }
      });
    }

    // Format new project data
    const updatedProjects = portfolioRepos.map((repo) => {
      const nameKey = repo.name.toLowerCase();
      const existingImage = existingImageMap.get(nameKey);

      // Format date (DD,MM,YYYY)
      const repoDate = new Date(repo.updated_at || repo.pushed_at || repo.created_at);
      const day = String(repoDate.getDate()).padStart(2, '0');
      const month = String(repoDate.getMonth() + 1).padStart(2, '0');
      const year = repoDate.getFullYear();
      const formattedDate = `${day},${month},${year}`;

      // Default image using GitHub OpenGraph card if no local image exists
      const image = existingImage || `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repo.name}`;

      return {
        projectName: repo.name,
        image,
        date: formattedDate,
        link: repo.html_url,
        githubUrl: repo.html_url,
        description: repo.description || `${repo.name} repository on GitHub`,
      };
    });

    // Save back to portfolio-data.json
    portfolioData.projectData = updatedProjects;
    fs.writeFileSync(PORTFOLIO_JSON_PATH, JSON.stringify(portfolioData, null, 2), 'utf-8');

    console.log(`Successfully synced ${updatedProjects.length} projects to src/data/portfolio-data.json!`);
  } catch (err) {
    console.error('Failed to sync with GitHub:', err);
  }
}

syncGithubProjects();
