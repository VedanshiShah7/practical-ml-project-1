from flask import Flask, request, jsonify
import numpy as np
import cv2
import pandas as pd
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.ensemble import RandomForestRegressor

app = Flask(__name__)

# Load your trained models (Modify paths if needed)
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
nn_model = keras.models.load_model("neural_network_model.h5")  # Load NN model

# Sample function to simulate predictions (Replace with real logic)
def get_predictions(image_array):
    r, g, b = image_array.mean(axis=(0, 1))  # Extract average color

    # Simple Difference Model
    simple_r, simple_g, simple_b = r + 10, g + 5, b - 5
    simple_confidence = 0.8

    # Weighted Difference Model
    weighted_r, weighted_g, weighted_b = r + 5, g + 10, b - 2
    weighted_confidence = 0.85

    # Neural Network Model
    nn_pred = nn_model.predict(np.array([[r, g, b]]))  # Simulate NN
    nn_r, nn_g, nn_b = nn_pred[0]
    nn_confidence = 0.95

    # Random Forest Model
    rf_pred = rf_model.predict(np.array([[r, g, b]]))
    rf_r, rf_g, rf_b = rf_pred[0]
    rf_confidence = 0.92

    # Return all predictions
    predictions = {
        "Simple Difference": {"rgb": [simple_r, simple_g, simple_b], "confidence": simple_confidence},
        "Weighted Difference": {"rgb": [weighted_r, weighted_g, weighted_b], "confidence": weighted_confidence},
        "Neural Network": {"rgb": [nn_r, nn_g, nn_b], "confidence": nn_confidence},
        "Random Forest": {"rgb": [rf_r, rf_g, rf_b], "confidence": rf_confidence}
    }
    
    return predictions

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["image"]
    image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    predictions = get_predictions(image)

    # Choose the best prediction based on confidence
    best_model = max(predictions, key=lambda m: predictions[m]["confidence"])
    best_prediction = predictions[best_model]

    response = {
        "predictions": predictions,
        "best_model": best_model,
        "best_prediction": best_prediction
    }
    
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
