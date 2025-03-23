document.getElementById("imageUpload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const canvas = document.getElementById("canvas");
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
                        landmarks.push(`rgb(${pixelR}, ${pixelG}, ${pixelB})`);
                    }
                }
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                let confidence = Math.min(100, Math.round((255 - Math.abs(r - g) - Math.abs(g - b)) / 255 * 100));
                
                document.getElementById("colorResult").innerHTML = `Predicted Color: <span style="color:rgb(${r}, ${g}, ${b}); font-weight:bold;">rgb(${r}, ${g}, ${b})</span><br>Confidence: ${confidence}%`;
                
                let thoughtProcess = `<strong>Landmarks Sampled:</strong><br>${landmarks.join(" | ")}`;
                document.getElementById("thoughtProcess").innerHTML = thoughtProcess;
            };
        };
        reader.readAsDataURL(file);
    }
});
