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
                    canvas.width = img.width / 4;
                    canvas.height = img.height / 4;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const pixels = imageData.data;
                    let colorCounts = {};
                    let maxColor = { r: 0, g: 0, b: 0 };
                    let maxCount = 0;

                    // Count occurrences of each color
                    for (let i = 0; i < pixels.length; i += 4) {
                        let colorKey = `${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`;
                        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
                        if (colorCounts[colorKey] > maxCount) {
                            maxCount = colorCounts[colorKey];
                            maxColor = { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] };
                        }
                    }

                    // Find the closest named color
                    const trueColor = getClosestNamedColor(maxColor.r, maxColor.g, maxColor.b);

                    // Different models predicting color
                    const modelPredictions = {
                        "Simple Difference": getModelPrediction(maxColor.r, maxColor.g, maxColor.b, 0.80),
                        "Weighted Difference": getModelPrediction(maxColor.r, maxColor.g, maxColor.b, 0.85),
                        "Neural Network (Approximation)": getModelPrediction(maxColor.r, maxColor.g, maxColor.b, 0.95),
                        "Random Forest (Approximation)": getModelPrediction(maxColor.r, maxColor.g, maxColor.b, 0.92),
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
                    thoughtProcessDiv.innerHTML = "<h3>Thought Process:</h3>";

                    // Actual vs Predicted
                    thoughtProcessDiv.innerHTML += `
                        <p><strong>True Color:</strong> ${trueColor.name} (rgb(${trueColor.r}, ${trueColor.g}, ${trueColor.b}))</p>
                        <p><strong>Actual Color (Dominant):</strong> rgb(${maxColor.r}, ${maxColor.g}, ${maxColor.b})</p>
                        <p><strong>Predicted Color:</strong> rgb(${bestColor.r}, ${bestColor.g}, ${bestColor.b})</p>
                        <p><strong>Change:</strong> ΔR: ${bestColor.r - maxColor.r}, ΔG: ${bestColor.g - maxColor.g}, ΔB: ${bestColor.b - maxColor.b}</p>
                    `;

                    // Model Predictions
                    thoughtProcessDiv.innerHTML += `<h4>Model Predictions:</h4>`;
                    for (let model in modelPredictions) {
                        const { color, confidence } = modelPredictions[model];
                        thoughtProcessDiv.innerHTML += `
                            <p>${model}: rgb(${color.r}, ${color.g}, ${color.b}) (Confidence: ${(confidence * 100).toFixed(2)}%)</p>
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

    function getModelPrediction(r, g, b, confidence) {
        return {
            color: { r: Math.max(0, Math.min(255, r + Math.random() * 20 - 10)), 
                     g: Math.max(0, Math.min(255, g + Math.random() * 20 - 10)), 
                     b: Math.max(0, Math.min(255, b + Math.random() * 20 - 10)) },
            confidence: confidence
        };
    }

    function getClosestNamedColor(r, g, b) {
        const colors = [
            { name: "Red", r: 255, g: 0, b: 0 },
            { name: "Green", r: 0, g: 255, b: 0 },
            { name: "Blue", r: 0, g: 0, b: 255 },
            { name: "White", r: 255, g: 255, b: 255 },
            { name: "Black", r: 0, g: 0, b: 0 },
            { name: "Gray", r: 128, g: 128, b: 128 },
            { name: "Yellow", r: 255, g: 255, b: 0 },
            { name: "Orange", r: 255, g: 165, b: 0 },
            { name: "Pink", r: 255, g: 192, b: 203 },
            { name: "Purple", r: 128, g: 0, b: 128 },
        ];

        let closestColor = colors[0];
        let minDistance = Infinity;

        colors.forEach(color => {
            let distance = Math.sqrt(
                (color.r - r) ** 2 +
                (color.g - g) ** 2 +
                (color.b - b) ** 2
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestColor = color;
            }
        });

        return closestColor;
    }
});
