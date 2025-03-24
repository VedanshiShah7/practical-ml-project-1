import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
df = pd.read_csv('your_data.csv').dropna()

# Extract relevant columns
true_r, true_g, true_b = df['True R'].values, df['True G'].values, df['True B'].values
observed_r, observed_g, observed_b = df['Observed R'].values, df['Observed G'].values, df['Observed B'].values

# Compute color differences
true_rgb_all = np.column_stack((true_r, true_g, true_b))
observed_rgb_all = np.column_stack((observed_r, observed_g, observed_b))
color_diff = np.linalg.norm(true_rgb_all - observed_rgb_all, axis=1)

# Plot color difference histogram
plt.figure(figsize=(10, 6))
plt.hist(color_diff, bins=20, color='purple', edgecolor='black', alpha=0.7)
plt.title("Histogram of Color Differences (True vs. Observed)")
plt.xlabel("Color Difference (Euclidean Distance)")
plt.ylabel("Frequency")
plt.show()

# Correlation matrix heatmap
df_combined = pd.DataFrame({
    'True R': true_r, 'True G': true_g, 'True B': true_b,
    'Observed R': observed_r, 'Observed G': observed_g, 'Observed B': observed_b
})
plt.figure(figsize=(10, 8))
sns.heatmap(df_combined.corr(), annot=True, cmap="coolwarm", fmt=".2f", cbar=True)
plt.title("Correlation Matrix of True vs. Observed RGB Channels")
plt.show()
