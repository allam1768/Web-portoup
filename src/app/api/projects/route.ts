import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const GITHUB_USERNAME = 'allam1768';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/portfolio-data.json');
    let localData = { projectData: [] };

    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      localData = JSON.parse(fileContent);
    }

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
      {
        headers: {
          'User-Agent': 'NextJS-Portfolio-App',
        },
        next: { revalidate: 60 }, // Revalidate cache every 60 seconds
      }
    );

    if (!res.ok) {
      // Fallback to local JSON if GitHub API fails or rate limited
      return NextResponse.json(localData.projectData || []);
    }

    const repos = await res.json();

    // Filter repos with topic 'portfolio-project' or non-fork repos with description
    let portfolioRepos = repos.filter(
      (repo: any) => Array.isArray(repo.topics) && repo.topics.includes('portfolio-project')
    );

    if (portfolioRepos.length === 0) {
      portfolioRepos = repos.filter((repo: any) => !repo.fork && repo.name !== GITHUB_USERNAME);
    }

    // Map existing images by project name to preserve custom uploaded images
    const existingImageMap = new Map();
    if (Array.isArray(localData.projectData)) {
      localData.projectData.forEach((item: any) => {
        if (item.projectName && item.image) {
          existingImageMap.set(item.projectName.toLowerCase(), item.image);
        }
      });
    }

    const projects = portfolioRepos.map((repo: any) => {
      const nameKey = repo.name.toLowerCase();
      const existingImage = existingImageMap.get(nameKey);

      const repoDate = new Date(repo.updated_at || repo.pushed_at || repo.created_at);
      const day = String(repoDate.getDate()).padStart(2, '0');
      const month = String(repoDate.getMonth() + 1).padStart(2, '0');
      const year = repoDate.getFullYear();
      const formattedDate = `${day},${month},${year}`;

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

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    const dataPath = path.join(process.cwd(), 'src/data/portfolio-data.json');
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      const localData = JSON.parse(fileContent);
      return NextResponse.json(localData.projectData || []);
    }
    return NextResponse.json([]);
  }
}
