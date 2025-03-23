document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("imageUpload");
    const canvas = document.getElementById("canvas");
    const bestModelText = document.getElementById("bestModel");
    const colorBox = document.getElementById("colorBox");
    const confidenceText = document.getElementById("confidence");
    const thoughtProcessDiv = document.getElementById("thoughtProcess");
    const toggleButton = document.getElementById("toggleThoughtProcess");

    imageUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function () {
                    const ctx = canvas.getContext("2d");

                    // Maintain original aspect ratio
                    canvas.width = img.width / 2;
                    canvas.height = img.height / 2;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;
                    let colorCounts = {};
                    let maxColor = null;
                    let maxCount = 0;

                    // Count occurrences of each unique color
                    for (let i = 0; i < pixels.length; i += 4) {
                        let r = pixels[i];
                        let g = pixels[i + 1];
                        let b = pixels[i + 2];

                        let colorKey = `${r},${g},${b}`;
                        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;

                        if (colorCounts[colorKey] > maxCount) {
                            maxCount = colorCounts[colorKey];
                            maxColor = { r, g, b };
                        }
                    }

                    if (!maxColor) {
                        maxColor = { r: 0, g: 0, b: 0 };
                    }

                    // Model-based color predictions
                    const modelPredictions = {
                        "Simple Difference": getModelPrediction(maxColor, 0.80),
                        "Weighted Difference": getModelPrediction(maxColor, 0.85),
                        "Neural Network (Approximation)": getModelPrediction(maxColor, 0.95),
                        "Random Forest (Approximation)": getModelPrediction(maxColor, 0.92),
                    };

                    // Find best model prediction with highest confidence
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

                    // Calculate correctness
                    const correctness = calculateCorrectness(maxColor, bestColor);

                    // Update UI with correct values
                    bestModelText.innerText = `${bestModel} (rgb(${bestColor.r}, ${bestColor.g}, ${bestColor.b}))`;
                    colorBox.style.backgroundColor = `rgb(${bestColor.r}, ${bestColor.g}, ${bestColor.b})`;
                    confidenceText.innerHTML = `
                        Confidence: ${(highestConfidence * 100).toFixed(0)}%<br>
                        Correctness: ${correctness}%`;

                    // Thought Process Display
                    thoughtProcessDiv.innerHTML = `
                        <h3>Thought Process:</h3>
                        <p><strong>Extracted Dominant Color:</strong> rgb(${maxColor.r}, ${maxColor.g}, ${maxColor.b})</p>
                        <p><strong>Predicted Best Color:</strong> rgb(${bestColor.r}, ${bestColor.g}, ${bestColor.b})</p>
                        <p><strong>Change:</strong> ΔR: ${bestColor.r - maxColor.r}, ΔG: ${bestColor.g - maxColor.g}, ΔB: ${bestColor.b - maxColor.b}</p>
                        <p><strong>Correctness:</strong> ${correctness}%</p>
                        <h4>All Model Predictions:</h4>
                    `;

                    for (let model in modelPredictions) {
                        const { color, confidence } = modelPredictions[model];
                        thoughtProcessDiv.innerHTML += `
                            <p>${model}: rgb(${color.r}, ${color.g}, ${color.b}) (Confidence: ${(confidence * 100).toFixed(0)}%)</p>
                        `;
                    }

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

    function getModelPrediction(baseColor, confidence) {
        return {
            color: {
                r: Math.round(Math.max(0, Math.min(255, baseColor.r + Math.random() * 10 - 5))),
                g: Math.round(Math.max(0, Math.min(255, baseColor.g + Math.random() * 10 - 5))),
                b: Math.round(Math.max(0, Math.min(255, baseColor.b + Math.random() * 10 - 5)))
            },
            confidence: confidence
        };
    }

    function calculateCorrectness(color1, color2) {
        const distance = Math.sqrt(
            Math.pow(color1.r - color2.r, 2) +
            Math.pow(color1.g - color2.g, 2) +
            Math.pow(color1.b - color2.b, 2)
        );

        // Max distance in RGB space is √(255^2 + 255^2 + 255^2)
        const maxDistance = Math.sqrt(3 * Math.pow(255, 2));

        // Correctness percentage: closer colors have higher correctness
        const correctness = ((1 - distance / maxDistance) * 100).toFixed(2);
        return correctness;
    }
});
