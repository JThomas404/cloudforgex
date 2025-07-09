import json
import boto3
import os
import logging
from knowledge_base import get_enhanced_system_prompt, get_suggested_response

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Environment variables with defaults (best security practices)
ALLOWED_ORIGIN = os.environ.get('ALLOWED_ORIGIN', 'https://www.jarredthomas.cloud')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')

# Cost protection implementation - prevent token waste
BANNED_PATTERNS = {
    "test", "testing", "hello", "hi", "hey", "yo", "wassup", # Meaningless prompts
    "can you talk", "just checking", "are you real", "what's up", "blah blah", 
    "spam", "flood", "ddos" # Abuse attempts
}

def contains_wasteful_patterns(message: str) -> bool:
    """Check if message contains patterns that waste tokens"""
    lowered = message.lower().strip()
    words = lowered.split()

    # Legitimate messages are usually longer than 3 words
    if len(words) > 3:
        return False

    # Block messages that are too short and contain junk words
    if any(word in BANNED_PATTERNS for word in words):
        logger.info(f"Blocked wasteful pattern: {len(words)} words")
        return True
    
    return False

def get_ai_response(user_message):
    """Generate AI response using AWS Bedrock Claude Instant"""
    # Rate limit for user inputs 
    if len(user_message) > 1000:
        return "Sorry, that message is too long. Please keep it under 1000 characters."
    if len(user_message) < 5:
        return "Hmm, that message is a bit too short. Try asking something specific about Jarred so I can help you better."
    
    # Check for wasteful patterns
    if contains_wasteful_patterns(user_message):
        return "I'd love to help! Try asking something specific about Jarred's projects, skills, or experience."
    
    # Check for predefined suggested responses first
    suggested_response = get_suggested_response(user_message)
    if suggested_response:
        logger.info(f"Returning predefined response for: {user_message[:50]}...")
        return suggested_response
    
    logger.info(f"Processing legitimate request: {len(user_message)} chars")


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
                'body': json.dumps({'error': "Hmm, it looks like your request was empty. Please try sending a message again."})
            }
        data = json.loads(body)

        message = data.get('message')
        if not message or not message.strip():
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': "Oops! I didn't catch your question. Try typing something specific so I can help you better."})

            }

    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': "Sorry, I couldn't understand that. Please try again or refresh the page if the issue continues."})
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
