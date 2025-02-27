const express = require("express");
const cors = require("cors");  // Import CORS
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.use(cors());


// Serve static files (HTML, CSS, JS, and videos)
app.use(express.static(path.join(__dirname, "../frontend")));  // Serve frontend folder
app.use(express.json());  // Parse JSON requests

const videoFolderPath = path.join(__dirname, "assets/videos");
const outputFolderPath = path.join(__dirname, "output");



app.use("/output", express.static(outputFolderPath));


// Serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Endpoint to delete a video
app.post("/delete", (req, res) => {
    const { videoPath } = req.body;
    const fullPath = path.join(__dirname, videoPath);

    fs.unlink(fullPath, (err) => {
        if (err) {
            console.error(`Error deleting video: ${err.message}`);
            return res.status(500).json({ error: "Failed to delete video" });
        }
        console.log(`Deleted video: ${fullPath}`);
        res.json({ message: "Video deleted successfully" });
    });
});



// Endpoint to stitch videos using FFmpeg
app.post("/stitch", (req, res) => {
    const { videos, language } = req.body; // Add language to the request body

    // Check if videos array is empty or missing
    if (!videos || !Array.isArray(videos) || videos.length === 0) {
        return res.status(400).json({ error: "No videos received for stitching" });
    }

    console.log("Received videos for stitching:", videos);
    console.log("Selected language:", language);


    // Create a temporary file to store the video list for FFmpeg
    const videoListPath = path.join(__dirname, "videoList.txt");
    fs.writeFileSync(videoListPath, videos.map(video => `file '${video}'`).join('\n'));

    const languageFolderPath = path.join(videoFolderPath, language);

    const fullVideoPaths = videos.map(video => path.join(languageFolderPath, path.basename(video)));

    // Check if all video files exist
    const missingVideos = fullVideoPaths.filter(videoPath => !fs.existsSync(videoPath));
    if (missingVideos.length > 0) {
        console.error("Missing video files:", missingVideos);
        return res.status(400).json({ error: "Missing video files", missingVideos });
    }


    const outputDir = path.join(__dirname, "output");
    const timestamp = Date.now();
    const outputVideoPath = path.join(outputDir, `stitched_${timestamp}.mp4`);

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Delete the existing output video if it exists
    if (fs.existsSync(outputVideoPath)) {
        fs.unlinkSync(outputVideoPath);
    }

    // Example command (make sure FFmpeg is installed and in your PATH)
    const command = `ffmpeg -f concat -safe 0 -i ${videoListPath} -c copy -preset ultrafast ${outputVideoPath}`;
    console.log("Executing command:", command);


    exec(command, (error) => {

        // Clean up the video list file after FFmpeg has finished
        if (fs.existsSync(videoListPath)) {
            fs.unlinkSync(videoListPath);
        }

        if (error) {
            console.error(`Error stitching videos: ${error.message}`);
            return res.status(500).json({ error: "Failed to stitch videos" });
        }

        console.log("Stitched video created at:", outputVideoPath);
        res.json({ url: `/output/${path.basename(outputVideoPath)}` });
    });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and visit http://localhost:${PORT}`);
});
