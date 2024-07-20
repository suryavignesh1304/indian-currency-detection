from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import numpy as np
import cv2
import base64

from yolo_detection import run_model

app = Flask(__name__)
CORS(app)


@app.route('/detectObject', methods=['POST'])
def mask_image():
    try:
        if 'image' not in request.files:
            app.logger.error("No image file found in the request.")
            return jsonify({'error': 'No image file found in the request'}), 400

        file = request.files['image']
        if file.filename == '':
            app.logger.error("No selected file.")
            return jsonify({'error': 'No selected file'}), 400

        file_stream = io.BytesIO(file.read())
        npimg = np.frombuffer(file_stream.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)[:, :, ::-1]  # OpenCV image (BGR to RGB)

        img, text = run_model(img)
        app.logger.info(f"{text} This is from app.py")

        if text.lower() == "image contains":
            text = ""

        if len(text) == 0:
            text = "Reload the page and try with another better image"

        bufferedBytes = io.BytesIO()
        img_base64 = Image.fromarray(img)
        img_base64.save(bufferedBytes, format="JPEG")
        img_base64 = base64.b64encode(bufferedBytes.getvalue())

        return jsonify({'status': str(img_base64), 'englishmessage': text})
    except Exception as e:
        app.logger.error(f"Error processing image: {e}")
        return jsonify({'error': 'Failed to process the image'}), 500


@app.route('/test', methods=['GET', 'POST'])
def test():
    app.logger.info("log: got at test")
    return jsonify({'status': 'success'})


@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True, threaded=True)
