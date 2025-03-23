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
                
                for (let i = 0; i < pixels.length; i += 4) {
                    r += pixels[i];
                    g += pixels[i + 1];
                    b += pixels[i + 2];
                    count++;
                }
                r = Math.round(r / count);
                g = Math.round(g / count);
                b = Math.round(b / count);
                
                document.getElementById("colorResult").textContent = `Predicted Color: rgb(${r}, ${g}, ${b})`;
                document.getElementById("colorResult").style.color = `rgb(${r}, ${g}, ${b})`;
            };
        };
        reader.readAsDataURL(file);
    }
});
