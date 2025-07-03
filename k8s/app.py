# Kubernetes Application for EVE AI Assistant
# This will be implemented in future iterations

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    """Health check endpoint"""
    return 'EVE AI Assistant K8s App - Coming Soon'

@app.route('/health')
def health():
    """Health check endpoint"""
    return {'status': 'healthy'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)