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

            // Get the selected language (ASL or ISL)
            const language = window.location.pathname.includes("asl") ? "asl" : "isl";

            // Call the function to send transcribed text to sign language translation
            translateToSign(data.transcription, language);

            alert("Audio uploaded successfully!");


    } catch (error) {
        console.error("Error:", error);
    }
});

// Define the function to send text to the sign language module
async function translateToSign(input, language) {
    try {
        const { videoList, displayText } = getVideosFromInput(input, language); // Pass language

        if (videoList.length === 0) {
            console.error("No matching videos found for input:", input);
            return;
        }

        // Display the formatted text
        document.getElementById("displayText").innerText = displayText;


        // Send video paths and language to the backend for stitching
        const response = await fetch('http://127.0.0.1:3000/stitch', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videos: videoList, language }), // Include language
        });

        // Log the response before parsing
        const textResponse = await response.text();
        console.log("Raw server response:", textResponse);

        // Parse JSON response
        const data = JSON.parse(textResponse);

        if (data.url) {
            const videoElement = document.getElementById("signVideo");
            videoElement.src = data.url;

            // Force the video element to load the new source
            videoElement.load(); // Load the new video source
            videoElement.play(); // Play the new video

            // Update the last video URL
        } else {
            console.error("No video URL returned from the server.");
            alert("Failed to generate sign language video. Please try again.");
        }
    } catch (error) {
        console.error("Error translating to sign:", error);
    }
}

// Handle manual text input
document.getElementById("translateTextButton").addEventListener("click", () => {
    const textInput = document.getElementById("textInput").value.trim();

    if (!textInput) {
        alert("Please enter some text.");
        return;
    }

    // Get the selected language (ASL or ISL)
    const language = window.location.pathname.includes("asl") ? "asl" : "isl";

    // Call the function to send entered text to sign language translation
    translateToSign(textInput, language);
});


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

        const language = window.location.pathname.includes("asl") ? "asl" : "isl";

        translateToSign(transcript, language);

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