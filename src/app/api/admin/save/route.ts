import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get("type") as string;
    const file = formData.get("image") as File | null;

    if (!type) {
      return NextResponse.json(
        { error: "Type is required" },
        { status: 400 }
      );
    }

    const dataPath = path.join(process.cwd(), "src/data/portfolio-data.json");
    const fileContent = await readFile(dataPath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    let imagePath = "";

    // 1. Handle Image Upload
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Determine upload directory based on type
      let uploadDir = "public/assets/images/general"; // fallback

      switch (type) {
        case "project":
          uploadDir = "public/assets/images/projects";
          break;
        case "education":
          uploadDir = "public/assets/images/education";
          break;
        case "certificate": // Explicit type for certificates
          uploadDir = "public/assets/images/certificates";
          break;
        case "skills":
          uploadDir = "public/assets/images/skills";
          break;
        case "gallery":
          uploadDir = "public/assets/images/gallery";
          break;
      }

      // Ensure directory exists
      const absoluteUploadDir = path.join(process.cwd(), uploadDir);
      if (!fs.existsSync(absoluteUploadDir)) {
        fs.mkdirSync(absoluteUploadDir, { recursive: true });
      }

      // Save file
      // Use original name or timestamp to avoid collisions? User said "save file to public", simpler is better for now.
      // Let's prepend timestamp to ensure uniqueness if needed, or just use name.
      // Using name as user might want to control it.
      const filename = file.name;
      const filepath = path.join(absoluteUploadDir, filename);
      await writeFile(filepath, buffer);

      // Set public URL path for JSON
      imagePath = uploadDir.replace("public", ""); // e.g. /assets/images/projects/foo.png
      if (!imagePath.startsWith("/")) imagePath = "/" + imagePath;
      imagePath = path.join(imagePath, filename); // joins with backslash on windows, need forward slash
      imagePath = imagePath.split(path.sep).join("/"); // Force forward slashes for web URL
    }

    // 2. Update JSON Data
    // We only update if we have data fields. If it's just an image upload, we might need more logic,
    // but the request implies sending data + image together.

    if (type === "education") {
      const newEntry = {
        level: formData.get("level")?.toString() || "",
        period: formData.get("period")?.toString() || "",
        school: formData.get("school")?.toString() || "",
        isActive: formData.get("isActive") === "true",
        image: imagePath || "", // Add image field support
      };
      jsonData.educationData.push(newEntry);
    } else if (type === "project") {
      const newEntry = {
        projectName: formData.get("projectName")?.toString() || "",
        image: imagePath || "",
        date: formData.get("date")?.toString() || "",
        link: formData.get("link")?.toString() || "",
        description: formData.get("description")?.toString() || "",
      };
      jsonData.projectData.push(newEntry);
    } else if (type === "skills") {
        const newEntry = {
            title: formData.get("title")?.toString() || "",
            image: imagePath || "",
            linkTo: formData.get("linkTo")?.toString() || "",
        };
        jsonData.skillsData.push(newEntry);
     } else if (type === "gallery") {
        // Find max ID to increment
        const maxId = jsonData.galleryItems.reduce((max: number, item: any) => Math.max(max, item.id), 0);
        const newEntry = {
            id: maxId + 1,
            image: imagePath || "",
            text: formData.get("text")?.toString() || "",
        };
        jsonData.galleryItems.push(newEntry);
    } else if (type === "certificate") {
        // Assuming certificates might be a new array or part of something else.
        // If it's a new section entirely:
        if (!jsonData.certificatesData) jsonData.certificatesData = [];
        const newEntry = {
            title: formData.get("title")?.toString() || "",
            image: imagePath || "",
            date: formData.get("date")?.toString() || "",
            credentialUrl: formData.get("credentialUrl")?.toString() || "",
        };
        jsonData.certificatesData.push(newEntry);
    } else {
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Write updated JSON back to file
    await writeFile(dataPath, JSON.stringify(jsonData, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Data saved successfully", imagePath });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
