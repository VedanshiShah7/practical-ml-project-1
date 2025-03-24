import cv2
import numpy as np
import matplotlib.pyplot as plt

# Function to extract RGB values from image segments
def extract_rgb_values(patterns, pattern_labels):
    observed_colors = []
    for pattern, label in zip(patterns, pattern_labels):
        pattern_rgb = cv2.cvtColor(pattern, cv2.COLOR_BGR2RGB)
        mask = np.all(pattern_rgb < [250, 250, 250], axis=-1)
        mean_color = np.mean(pattern_rgb[mask], axis=0) if np.any(mask) else np.array([255, 255, 255])
        observed_colors.append(mean_color)
        print(f"Pattern: {label}, Mean Color: {mean_color}")
    return np.array(observed_colors)

# Function to plot RGB histograms
def plot_rgb_histograms(observed_colors):
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    colors = ['red', 'green', 'blue']
    labels = ['Red Channel', 'Green Channel', 'Blue Channel']
    
    for i in range(3):
        axes[i].hist(observed_colors[:, i], bins=20, color=colors[i], alpha=0.7)
        axes[i].set_title(labels[i])
        axes[i].set_xlabel("Pixel Intensity")
        axes[i].set_ylabel("Frequency")
    
    plt.show()

# Example usage (assumes `patterns` and `pattern_labels` are available)
if __name__ == "__main__":
    observed_colors = extract_rgb_values(patterns, pattern_labels)
    plot_rgb_histograms(observed_colors)
