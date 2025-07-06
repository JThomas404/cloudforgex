import json
import boto3
import os
import logging
from knowledge_base import get_enhanced_system_prompt

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Environment variables with defaults (best security practices)
ALLOWED_ORIGIN = os.environ.get('ALLOWED_ORIGIN', 'https://www.jarredthomas.cloud')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')

def get_ai_response(user_message):
    """Generate AI response using AWS Bedrock Claude Instant"""
    # Rate limit for user inputs 
    if len(user_message) > 1000:
        return "Please keep your message under 1000 characters."

    try:
        # Initialize Bedrock client
        bedrock = boto3.client(
            'bedrock-runtime',
            region_name=AWS_REGION,
            config=boto3.session.Config(
                read_timeout=30,
                retries={'max_attempts': 2}
            )
        )

        # Get enhanced system prompt
        system_prompt = get_enhanced_system_prompt()

        # Format prompt for Claude's conversation format
        full_prompt = f"{system_prompt}\n\nHuman: {user_message}\n\nAssistant:"
        
        # Call Bedrock with Claude Instant
        response = bedrock.invoke_model(
            modelId='anthropic.claude-instant-v1',
            body=json.dumps({
                'prompt': full_prompt,
                'max_tokens_to_sample': 500,
                'temperature': 0.7,
                'top_p': 0.9
            })
        )

        # Parse Bedrock response
        response_body = json.loads(response['body'].read())
        ai_response = response_body.get('completion', '').strip()

        return ai_response

    except Exception as e:
        # Log error and return a fallback message
        logger.error(f"AI response error: {str(e)}")
        return "I'm having trouble connecting to my AI service right now. Please try again in a moment."

def lambda_handler(event, context):
    # Log incoming requests for monitoring
    logger.info(f"request received: {event.get('httpMethod')} from {event.get('sourceIp', 'unknown')}")

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS, POST'
    }

    http_method = event.get('httpMethod')

    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers
        }
    
    try:
        body = event.get('body')
        if not body:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Request body is required'})
            }
        data = json.loads(body)

        message = data.get('message')
        if not message or not message.strip():
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Message field is required and cannot be empty'})
            }

    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid JSON format'})
        }

    # Get AI response
    ai_response = get_ai_response(message)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'response': ai_response,
            'status': 'success'
        })
    }
