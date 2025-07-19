import json
import boto3
import os
import logging
import uuid
import time
from datetime import datetime
from knowledge_base import get_enhanced_system_prompt, get_suggested_response

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Simple SSM parameter cache
_parameter_cache = {}

def get_ssm_parameter(parameter_name, default_value=None):
    """
    Get a parameter from SSM Parameter Store with caching
    
    Args:
        parameter_name: Full SSM parameter path
        default_value: Value to return if parameter cannot be retrieved
        
    Returns:
        Parameter value or default if not found
    """
    # Check cache first
    if parameter_name in _parameter_cache:
        return _parameter_cache[parameter_name]

    # Get region from environment variable
    region = os.environ.get('AWS_REGION', 'us-east-1')

    try:
        # Initialise SSM Client
        ssm_client = boto3.client('ssm', region_name=region)

        # Get parameter from SSM
        response = ssm_client.get_parameter(Name=parameter_name)
        value = response['Parameter']['Value']

        # Cache the parameter
        _parameter_cache[parameter_name] = value
        logger.info(f"Retrieved parameter {parameter_name} from SSM")

        return value
    except Exception as e:
        logger.warning(f"Failed to retrieve {parameter_name} from SSM: {str(e)}. Using default value.")
        return default_value

# Get environment from Lambda environment variable
ENV = os.environ.get('ENVIRONMENT', 'dev')
ALLOWED_ORIGIN = get_ssm_parameter(f"/cfx/{ENV}/allowed_origin", 'https://www.jarredthomas.cloud')
AWS_REGION = get_ssm_parameter(f"/cfx/{ENV}/region", os.environ.get('AWS_REGION', 'us-east-1'))
DYNAMODB_TABLE = get_ssm_parameter(f"/cfx/{ENV}/dynamodb_table", 'cfx-chatbot-logs')



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

def log_chat_interaction(user_input, ai_response, response_source, processing_time_ms):
    """Log chat interaction to DynamoDB"""
    try:
        dynamodb = boto3.client('dynamodb', region_name=AWS_REGION)
        
        item = {
            'chat_id': {'S': str(uuid.uuid4())},
            'timestamp': {'S': datetime.utcnow().isoformat() + 'Z'},
            'user_input': {'S': user_input},
            'ai_response': {'S': ai_response},
            'response_source': {'S': response_source},
            'processing_time_ms': {'N': str(processing_time_ms)},
            'ttl': {'N': str(int(time.time()) + (30 * 24 * 60 * 60))}  # 30 days
        }
        
        dynamodb.put_item(TableName=DYNAMODB_TABLE, Item=item)
        logger.info(f"Chat logged successfully: {response_source}")
        
    except Exception as e:
        logger.error(f"Failed to log chat: {str(e)}")

def get_ai_response(user_message):
    """Generate AI response using AWS Bedrock Claude Instant"""
    # Rate limit for user inputs 
    if len(user_message) > 1000:
        return "Sorry, that message is too long. Please keep it under 1000 characters.", "error"
    if len(user_message) < 5:
        return "Hmm, that message is a bit too short. Try asking something specific about Jarred so I can help you better.", "error"
    
    # Check for wasteful patterns
    if contains_wasteful_patterns(user_message):
        return "I'd love to help! Try asking something specific about Jarred's projects, skills, or experience.", "error"
    
    # Check for predefined suggested responses first
    suggested_response = get_suggested_response(user_message)
    if suggested_response:
        logger.info(f"Returning predefined response for: {user_message[:50]}...")
        return suggested_response, "suggested"
    
    logger.info(f"Processing legitimate request: {len(user_message)} chars")
    try:
        # Initialise Bedrock client
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
        
        # Get model ID from SSM
        model_id = get_ssm_parameter(f"/cfx/{ENV}/bedrock_model", 'anthropic.claude-instant-v1')
        
        # Call Bedrock with model from SSM
        response = bedrock.invoke_model(
            modelId=model_id,
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

        return ai_response, "ai"

    except Exception as e:
        # Log error and return a fallback message
        logger.error(f"AI response error: {str(e)}")
        return "I'm having trouble connecting to my AI service right now. Please try again in a moment.", "error"

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
    start_time = time.time()
    ai_response, response_source = get_ai_response(message)
    processing_time = int((time.time() - start_time) * 1000)

    # Log the interaction
    log_chat_interaction(message, ai_response, response_source, processing_time)
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'response': ai_response,
            'status': 'success'
        })
    }
