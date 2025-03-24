from ultralytics import YOLO
import cv2
import matplotlib.pyplot as plt
import os
import numpy as np
from PIL import Image

# Load the YOLOv8 models
model_first = YOLO('/Users/vedanshi/Documents/GitHub/practical_ml/project-1/model_first.pt')
model_second = YOLO('/Users/vedanshi/Documents/GitHub/practical_ml/project-1/model_second.pt')

# Function to load and process an image
def load_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        try:
            pil_image = Image.open(image_path).convert("RGB")
            image = np.array(pil_image)
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            print(f"Successfully converted {image_path}")
        except Exception as e:
            print(f"Failed to convert {image_path}: {e}")
            return None
    return image

# Function to detect objects using YOLO model
def detect_objects(image, model):
    results = model(image)
    return results[0]

# Function to visualize detection results
def visualize_detection(image, results, title):
    annotated_image = results.plot()
    plt.figure(figsize=(6, 6))
    plt.imshow(cv2.cvtColor(annotated_image, cv2.COLOR_BGR2RGB))
    plt.axis("off")
    plt.title(title)
    plt.show()

# Example Usage
if __name__ == "__main__":
    image_path = "test/2001-6C_1.jpg"
    image = load_image(image_path)
    if image is not None:
        results1 = detect_objects(image, model_first)
        visualize_detection(image, results1, "YOLOv8 Recognized")
