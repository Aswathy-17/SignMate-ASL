document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById("audioFile");
    const formData = new FormData();
    formData.append("audioFile", fileInput.files[0]);

    try {
        const response = await fetch('http://127.0.0.1:5000/api/transcribe', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        document.getElementById("output").innerHTML = `<h3>Transcription:</h3><p>${data.transcription}</p>`;

        // Call the function to send transcribed text to sign language translation
        translateToSign(data.transcription);

    } catch (error) {
        console.error("Error:", error);
    }
});

// Define the function to send text to the sign language module
async function translateToSign(transcribedText) {
    try {
        // Convert text into an array of video paths (words & letters)
        const { videoList, displayText } = window.getVideosFromInput(transcribedText);

        if (videoList.length === 0) {
            console.error("No matching videos found for input:", transcribedText);
            return;
        }

        document.getElementById("displayText").innerText = displayText;

        // Send video paths to the backend for stitching
        const response = await fetch('http://127.0.0.1:3000/stitch', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videos: videoList })  // Ensuring array format
        });

        // Log the response before parsing
        const textResponse = await response.text();
        console.log("Raw server response:", textResponse);

        // Parse JSON response
        const data = JSON.parse(textResponse);

        if (data.url) {
            const videoElement = document.getElementById("signVideo");
            videoElement.src = data.url;
            videoElement.load();
            videoElement.play();
        }
    } catch (error) {
        console.error("Error translating to sign:", error);
    }
}
