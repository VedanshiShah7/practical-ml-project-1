document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("imageUpload");
    const canvas = document.getElementById("canvas");
    const bestModelText = document.getElementById("bestModel");
    const colorBox = document.getElementById("colorBox");
    const confidenceText = document.getElementById("confidence");
    const thoughtProcessDiv = document.getElementById("thoughtProcess");
    const toggleButton = document.getElementById("toggleThoughtProcess");

    if (!imageUpload || !canvas || !colorBox || !confidenceText || !thoughtProcessDiv || !toggleButton) {
        console.error("One or more elements are missing from the HTML.");
        return;
    }

    imageUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function () {
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

                        if (i % (canvas.width * 4 * 10) === 0) {
                            landmarks.push({ r: pixelR, g: pixelG, b: pixelB });
                        }
                    }

                    r = Math.round(r / count);
                    g = Math.round(g / count);
                    b = Math.round(b / count);

                    // Different models predicting color
                    const modelPredictions = {
                        "Simple Difference": getModelPrediction(r, g, b, 0.80),
                        "Weighted Difference": getModelPrediction(r, g, b, 0.85),
                        "Neural Network (Approximation)": getModelPrediction(r, g, b, 0.95),
                        "Random Forest (Approximation)": getModelPrediction(r, g, b, 0.92),
                    };

                    // Determine the highest confidence prediction
                    let bestModel = "";
                    let highestConfidence = 0;
                    let bestColor = { r: 0, g: 0, b: 0 };

                    for (let model in modelPredictions) {
                        const { color, confidence } = modelPredictions[model];
                        if (confidence > highestConfidence) {
                            highestConfidence = confidence;
                            bestModel = model;
                            bestColor = color;
                        }
                    }

                    // Update UI
                    bestModelText.innerText = bestModel;
                    colorBox.style.backgroundColor = `rgb(${bestColor.r}, ${bestColor.g}, ${bestColor.b})`;
                    confidenceText.innerHTML = `Confidence: ${(highestConfidence * 100).toFixed(2)}%`;

                    // Thought Process Visualization
                    thoughtProcessDiv.innerHTML = "<strong>Landmarks Sampled:</strong><br>";
                    landmarks.forEach(color => {
                        let div = document.createElement("div");
                        div.className = "landmark";
                        div.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
                        div.title = `rgb(${color.r}, ${color.g}, ${color.b})`;
                        thoughtProcessDiv.appendChild(div);
                    });

                    thoughtProcessDiv.classList.remove("hidden");
                    toggleButton.innerText = "Hide Thought Process";
                };
            };
            reader.readAsDataURL(file);
        }
    });

    toggleButton.addEventListener("click", function () {
        thoughtProcessDiv.classList.toggle("hidden");
        toggleButton.innerText = thoughtProcessDiv.classList.contains("hidden") ? "Show Thought Process" : "Hide Thought Process";
    });

    // Simulated function for different model predictions
    function getModelPrediction(r, g, b, confidence) {
        return {
            color: { r: Math.min(255, r + Math.random() * 20 - 10), 
                     g: Math.min(255, g + Math.random() * 20 - 10), 
                     b: Math.min(255, b + Math.random() * 20 - 10) },
            confidence: confidence
        };
    }
});
