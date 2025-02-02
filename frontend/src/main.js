document.addEventListener("DOMContentLoaded", () => {
    let lastVideoUrl = null; // Variable to store the last video URL

    const videoMap = {
        "hello": "assets/videos/Hello.mp4",
        "a": "assets/videos/A.mp4",
        "b": "assets/videos/B.mp4",
        "c": "assets/videos/C.mp4",
        "d": "assets/videos/D.mp4",
        "e": "assets/videos/E.mp4",
        "f": "assets/videos/F.mp4",
        "g": "assets/videos/G.mp4",
        "h": "assets/videos/H.mp4",
        "i": "assets/videos/I.mp4",
        "j": "assets/videos/J.mp4",
        "k": "assets/videos/K.mp4",
        "l": "assets/videos/L.mp4",
        "m": "assets/videos/M.mp4",
        "n": "assets/videos/N.mp4",
        "o": "assets/videos/O.mp4",
        "p": "assets/videos/P.mp4",
        "q": "assets/videos/Q.mp4",
        "r": "assets/videos/R.mp4",
        "s": "assets/videos/S.mp4",
        "t": "assets/videos/T.mp4",
        "u": "assets/videos/U.mp4",
        "v": "assets/videos/V.mp4",
        "w": "assets/videos/W.mp4",
        "x": "assets/videos/X.mp4",
        "y": "assets/videos/Y.mp4",
        "z": "assets/videos/Z.mp4",       
        "apple": "assets/videos/apple.mp4",
        "bus": "assets/videos/bus.mp4"
    };

    function getVideosFromInput(input) {
        const words = input.toLowerCase().trim().split(/\s+/); // ✅ Split on spaces
        const videoList = [];
        let displayText = "";

        words.forEach((word) => {
            if (videoMap[word]) {
                videoList.push(videoMap[word]);
                displayText += word + " ";
            } else {
                word.split("").forEach((letter) => {
                    if (videoMap[letter]) {
                        videoList.push(videoMap[letter]);
                        displayText += letter + "-";
                    }
                });

                if (displayText.endsWith("-")) {
                    displayText = displayText.slice(0, -1);
                }
                displayText += " ";
            }
        });

        return { videoList, displayText: displayText.trim() };
    }

    async function deleteOldVideo(videoPath) {
        try {
            const response = await fetch("/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoPath }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete old video");
            }

            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function stitchVideos(videoList) {
        try {
            const response = await fetch("/stitch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videos: videoList }),
            });

            if (!response.ok) {
                throw new Error("Failed to stitch videos");
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Ensure the button exists before adding event listener
    // const translateButton = document.getElementById("translateButton");

    // if (!translateButton) {
    //     console.error("Error: Translate button not found!");
    //     return;
    // }


    // if (translateButton) {
    //     translateButton.addEventListener("click", async () => {
    //         const input = document.getElementById("textInput").value.toLowerCase().trim();
    //         if (!input) {
    //             alert("Please enter some text.");
    //             return;
    //         }

    //         const { videoList, displayText } = getVideosFromInput(input);
    //         document.getElementById("displayText").innerText = displayText;

    //         if (lastVideoUrl) {
    //             await deleteOldVideo(lastVideoUrl);
    //         }

    //         const stitchedVideoUrl = await stitchVideos(videoList);

    //         if (stitchedVideoUrl) {
    //             const videoElement = document.getElementById("signVideo");
    //             videoElement.src = stitchedVideoUrl;
    //             videoElement.load();
    //             videoElement.play();
    //             lastVideoUrl = stitchedVideoUrl;
    //         }
    //     });
    // } else {
    //     console.error("Error: Translate button not found!");
    // }

    window.getVideosFromInput = getVideosFromInput;

});
