document.addEventListener("DOMContentLoaded", () => {
    let lastVideoUrl = null; // Variable to store the last video URL

    const videoMaps = {
        asl:{
        // Words
        "hello": "assets/videos/asl/hello.mp4",

        // Alphabets
        "a": "assets/videos/asl/A.mp4",
        "b": "assets/videos/asl/B.mp4",
        "c": "assets/videos/asl/C.mp4",
        "d": "assets/videos/asl/D.mp4",
        "e": "assets/videos/asl/E.mp4",
        "f": "assets/videos/asl/F.mp4",
        "g": "assets/videos/asl/G.mp4",
        "h": "assets/videos/asl/H.mp4",
        "i": "assets/videos/asl/I.mp4",
        "j": "assets/videos/asl/J.mp4",
        "k": "assets/videos/asl/K.mp4",
        "l": "assets/videos/asl/L.mp4",
        "m": "assets/videos/asl/M.mp4",
        "n": "assets/videos/asl/N.mp4",
        "o": "assets/videos/asl/O.mp4",
        "p": "assets/videos/asl/P.mp4",
        "q": "assets/videos/asl/Q.mp4",
        "r": "assets/videos/asl/R.mp4",
        "s": "assets/videos/asl/S.mp4",
        "t": "assets/videos/asl/T.mp4",
        "u": "assets/videos/asl/U.mp4",
        "v": "assets/videos/asl/V.mp4",
        "w": "assets/videos/asl/W.mp4",
        "x": "assets/videos/asl/X.mp4",
        "y": "assets/videos/asl/Y.mp4",
        "z": "assets/videos/asl/Z.mp4", 

        // Numbers
        "1": "assets/videos/asl/1.mp4",
        "2": "assets/videos/asl/2.mp4",
        "3": "assets/videos/asl/3.mp4",
        "4": "assets/videos/asl/4.mp4",
        "5": "assets/videos/asl/5.mp4",
        "6": "assets/videos/asl/6.mp4",
        "7": "assets/videos/asl/7.mp4",
        "8": "assets/videos/asl/8.mp4",
        "9": "assets/videos/asl/9.mp4",
        "10": "assets/videos/asl/10.mp4",
        },


        isl:{

        // Words
        "hello": "assets/videos/isl/hello.mp4",

        // Alphabets
        "a": "assets/videos/isl/A.mp4",
        "b": "assets/videos/isl/B.mp4",
        "c": "assets/videos/isl/C.mp4",
        "d": "assets/videos/isl/D.mp4",
        "e": "assets/videos/isl/E.mp4",
        "f": "assets/videos/isl/F.mp4",
        "g": "assets/videos/isl/G.mp4",
        "h": "assets/videos/isl/H.mp4",
        "i": "assets/videos/isl/I.mp4",
        "j": "assets/videos/isl/J.mp4",
        "k": "assets/videos/isl/K.mp4",
        "l": "assets/videos/isl/L.mp4",
        "m": "assets/videos/isl/M.mp4",
        "n": "assets/videos/isl/N.mp4",
        "o": "assets/videos/isl/O.mp4",
        "p": "assets/videos/isl/P.mp4",
        "q": "assets/videos/isl/Q.mp4",
        "r": "assets/videos/isl/R.mp4",
        "s": "assets/videos/isl/S.mp4",
        "t": "assets/videos/isl/T.mp4",
        "u": "assets/videos/isl/U.mp4",
        "v": "assets/videos/isl/V.mp4",
        "w": "assets/videos/isl/W.mp4",
        "x": "assets/videos/isl/X.mp4",
        "y": "assets/videos/isl/Y.mp4",
        "z": "assets/videos/isl/Z.mp4", 

        // Numbers
        "1": "assets/videos/isl/1.mp4",
        "2": "assets/videos/isl/2.mp4",
        "3": "assets/videos/isl/3.mp4",
        "4": "assets/videos/isl/4.mp4",
        "5": "assets/videos/isl/5.mp4",
        "6": "assets/videos/isl/6.mp4",
        "7": "assets/videos/isl/7.mp4",
        "8": "assets/videos/isl/8.mp4",
        "9": "assets/videos/isl/9.mp4",
        "10": "assets/videos/isl/10.mp4",
        }

    };

    function getVideosFromInput(input,language) {

        if (!input || typeof input !== "string") {
            console.error("Invalid input:", input);
            return { videoList: [], displayText: "" };
        }

        const videoMap = videoMaps[language]; // Use the selected language's videoMap
        
        const words = input.toLowerCase().trim().split(/\s+/); // Split on spaces
        
        const videoList = [];
        let displayText = "";

        words.forEach((word) => {
            if (videoMap[word]) {
                videoList.push(videoMap[word]);
                displayText += word + " ";
            } else {
                const letters = word.split("");                
                letters.forEach((letter) => {
                    if (videoMap[letter]) {
                        videoList.push(videoMap[letter]);
                    }
                });

                // // Remove trailing dash and add a space
                // if (displayText.endsWith("-")) {
                //     displayText = displayText.slice(0, -1);
                // }
                // displayText += " ";
            }
        });

        console.log("Final video list:", videoList);
        console.log("Final display text:", displayText);

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

    window.getVideosFromInput = getVideosFromInput;

 });
