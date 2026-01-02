from flask import Flask, jsonify
import os
import time

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint returning system status."""
    return jsonify({
        'status': 'healthy',
        'timestamp': time.time(),
        'service': 'CareerMate API',
        'version': '1.0.0'
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint."""
    return jsonify({
        'message': 'CareerMate API - Your AI-Powered Job Companion',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
