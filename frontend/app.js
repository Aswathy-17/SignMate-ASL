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

        // Call the function to send transcribed text to sign language translation
        translateToSign(data.transcription);

    } catch (error) {
        console.error("Error:", error);
    }
});

// Define the function to send text to the sign language module
async function translateToSign(transcribedText) {

    if (!transcribedText || typeof transcribedText !== "string") {
        console.error("Invalid or empty transcription:", transcribedText);
        return;
    }


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
        } else {
            console.error("No video URL returned from the server.");
            alert("Failed to generate sign language video. Please try again.");
        }
    } catch (error) {
        console.error("Error translating to sign:", error);
    }
}

// Live Speech Recognition
let isListening = false;

document.getElementById("liveSpeechButton").addEventListener("click", () => {
    if (isListening) {
        console.log("Speech recognition is already active.");
        return;
    }

    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        console.error("Speech recognition not supported in this browser.");
        alert("Your browser does not support speech recognition. Please use Chrome or Edge.");
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    isListening = true;

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        if (!transcript.trim()) {
            console.log("No speech detected.");
            return;
        }
        document.getElementById("liveOutput").innerHTML = `<h3>Live Transcription:</h3><p>${transcript}</p>`;
        translateToSign(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        isListening = false;
    };

    recognition.onend = () => {
        console.log("Speech recognition ended.");
        isListening = false;
    };
});