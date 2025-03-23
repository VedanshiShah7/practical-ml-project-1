document.addEventListener("DOMContentLoaded", function() {
    const imageUpload = document.getElementById("imageUpload");
    const canvas = document.getElementById("canvas");
    const colorResult = document.getElementById("colorResult");
    const colorBox = document.getElementById("colorBox");
    const confidenceText = document.getElementById("confidence");
    const thoughtProcessDiv = document.getElementById("thoughtProcess");
    const toggleButton = document.getElementById("toggleThoughtProcess");

    // Ensure elements exist before using them
    if (!imageUpload || !canvas || !colorResult || !colorBox || !confidenceText || !thoughtProcessDiv || !toggleButton) {
        console.error("One or more elements are missing from the HTML.");
        return;
    }

    imageUpload.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width / 4;
                    canvas.height = img.height / 4;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;
                    let r = 0, g = 0, b = 0, count = 0;
                    let landmarks = [];

                    for (let i = 0; i < pixels.length; i += 4) {
                        let pixelR = pixels[i];
                        let pixelG = pixels[i + 1];
                        let pixelB = pixels[i + 2];
                        r += pixelR;
                        g += pixelG;
                        b += pixelB;
                        count++;

                        if (i % (canvas.width * 4 * 10) === 0) { // Sample landmarks
                            landmarks.push({ r: pixelR, g: pixelG, b: pixelB });
                        }
                    }

                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);
                    let confidence = Math.min(100, Math.round((255 - Math.abs(r - g) - Math.abs(g - b)) / 255 * 100));

                    colorResult.innerHTML = `Predicted Color: <span style="font-weight:bold;">rgb(${r}, ${g}, ${b})</span>`;
                    confidenceText.innerHTML = `Confidence: ${confidence}%`;
                    colorBox.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

                    // Thought Process Visualization
                    thoughtProcessDiv.innerHTML = "<strong>Landmarks Sampled:</strong><br>";
                    if (landmarks.length === 0) {
                        thoughtProcessDiv.innerHTML += "No landmarks detected.";
                    } else {
                        landmarks.forEach(color => {
                            let div = document.createElement("div");
                            div.className = "landmark";
                            div.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
                            div.title = `rgb(${color.r}, ${color.g}, ${color.b})`;
                            thoughtProcessDiv.appendChild(div);
                        });
                    }

                    // Show thought process section
                    thoughtProcessDiv.classList.remove("hidden");
                    toggleButton.innerText = "Hide Thought Process";
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Toggle Thought Process Visibility
    toggleButton.addEventListener("click", function() {
        if (thoughtProcessDiv.classList.contains("hidden")) {
            thoughtProcessDiv.classList.remove("hidden");
            toggleButton.innerText = "Hide Thought Process";
        } else {
            thoughtProcessDiv.classList.add("hidden");
            toggleButton.innerText = "Show Thought Process";
        }
    });
});
