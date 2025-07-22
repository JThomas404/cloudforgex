import os
import json
import sys
sys.path.append('/app')
from app import lambda_handler

def app(environ, start_response):
    # Handle health check endpoint
    if environ['PATH_INFO'] == '/health':
        status = '200 OK'
        response_headers = [('Content-type', 'application/json')]
        start_response(status, response_headers)
        return [json.dumps({'status':'healthy'}).encode('utf-8')]
    
    # CORS support
    if environ['REQUEST_METHOD'] =='OPTIONS' and environ['PATH_INFO'] == '/chat':
        status = '200 OK'
        allowed_origin = os.environ.get('ALLOWED_ORIGIN', '*')
        response_headers = [
            ('Content-type', 'application/json'),
            ('Access-Control-Allow-Origin', allowed_origin),
            ('Access-Control-Allow-Headers', 'Content-Type'),
            ('Access-Control-Allow-Methods', 'OPTIONS, POST')
        ]
        start_response(status, response_headers)
        return [b'']

    # Handle chat endpoint
    if environ['REQUEST_METHOD'] == 'POST' and environ['PATH_INFO'] == '/chat':
        # Get request body
        try:
            request_body_size = int(environ.get('CONTENT_LENGTH', 0))
            request_body = environ['wsgi.input'].read(request_body_size).decode('utf-8')

            # Create a mock API Gateway event
            event = {
                'httpMethod': 'POST',
                'path': '/chat',
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': request_body
            }

            # Call the lambda handler with the mock event
            result = lambda_handler(event, None)

            # Convert Lambda response to WSGI response format
            status = f"{result['statusCode']} {'OK' if result['statusCode'] == 200 else 'Error'}"
            response_headers = [(k, v) for k, v in result.get('headers', {}).items()]

            start_response(status, response_headers)

            # Return the response body as a list of bytes
            return [result.get('body', '').encode('utf-8')]

        except Exception as e:
            # Handle any errors that occur during processing
            status = '500 Internal Server Error'
            response_headers = [('Content-type', 'application/json')]
            start_response(status, response_headers)
            return [json.dumps({'error': str(e)}).encode('utf-8')]
        
    # Handle 404 for all other paths
    status = '404 Not Found'
    response_headers = [('Content-type', 'application/json')]
    start_response(status, response_headers)
    return [json.dumps({'error': 'Not Found'}).encode('utf-8')]