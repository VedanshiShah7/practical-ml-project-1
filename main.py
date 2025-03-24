import data_preprocessing
import object_detection
import color_extraction
import data_analysis
import model_training

def main():
    print("Starting Data Preprocessing...")
    data_preprocessing
    print("Data Preprocessing Complete.")
    
    print("Starting Object Detection...")
    object_detection
    print("Object Detection Complete.")
    
    print("Starting Color Extraction...")
    color_extraction
    print("Color Extraction Complete.")
    
    print("Starting Data Analysis...")
    data_analysis
    print("Data Analysis Complete.")
    
    print("Starting Model Training...")
    model_training
    print("Model Training Complete.")

if __name__ == "__main__":
    main()
