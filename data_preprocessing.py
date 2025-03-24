import os
import shutil
import random
from collections import defaultdict

# Define the path to your images directory
dataset_dir = '/Users/vedanshi/Documents/GitHub/practical_ml/project-1'
train_dir = os.path.join(dataset_dir, 'train')
val_dir = os.path.join(dataset_dir, 'val')
test_dir = os.path.join(dataset_dir, 'test')

# Create the directories for train, val, and test if they don't exist
os.makedirs(train_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)
os.makedirs(test_dir, exist_ok=True)

# Get a list of all image files in the dataset directory
all_images = [f for f in os.listdir(dataset_dir) if f.endswith(('.jpg', '.png'))]

# Group images by their common prefix (before the first '_')
image_groups = defaultdict(list)
for image in all_images:
    prefix = image.split('_')[0]  # Extract the common prefix
    image_groups[prefix].append(image)

# Shuffle the groups to ensure randomness
groups = list(image_groups.values())
random.shuffle(groups)

# Define the split ratios
train_ratio = 0.8
val_ratio = 0.1
test_ratio = 0.1

# Calculate the number of groups for each set
total_groups = len(groups)
num_train_groups = int(train_ratio * total_groups)
num_val_groups = int(val_ratio * total_groups)
num_test_groups = total_groups - num_train_groups - num_val_groups

# Split the groups into train, val, and test sets
train_groups = groups[:num_train_groups]
val_groups = groups[num_train_groups:num_train_groups + num_val_groups]
test_groups = groups[num_train_groups + num_val_groups:]

# Function to move images to respective folders
def move_images(groups, target_dir):
    for group in groups:
        for image in group:
            shutil.move(os.path.join(dataset_dir, image), os.path.join(target_dir, image))

move_images(train_groups, train_dir)
move_images(val_groups, val_dir)
move_images(test_groups, test_dir)

print(f"Split {total_groups} image groups into:")
print(f" - {len(train_groups)} groups for training")
print(f" - {len(val_groups)} groups for validation")
print(f" - {len(test_groups)} groups for testing")
