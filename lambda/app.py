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
    # Extract the parameter name without the path
    param_parts = parameter_name.split('/')
    env_var_name = param_parts[-1].upper() if len(param_parts) > 1 else parameter_name.upper()

    # Check environment variables first
    env_value = os.environ.get(env_var_name)
    if env_value is not None:
        logger.info(f"Using environment variable {env_var_name}")
        return env_value
    
    # Check the cache
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
ENV = os.environ.get('ENVIRONMENT', 'Dev')
SSM_PREFIX = os.environ.get('SSM_PREFIX', 'cfx')

# Support multiple allowed origins for cross-browser compatibility
ALLOWED_ORIGINS = [
    'https://www.jarredthomas.cloud',
    'https://jarredthomas.cloud'
]

AWS_REGION = get_ssm_parameter(f"/{SSM_PREFIX}/{ENV}/region", os.environ.get('AWS_REGION', 'us-east-1'))
DYNAMODB_TABLE = get_ssm_parameter(f"/{SSM_PREFIX}/{ENV}/dynamodb_table", 'cloudforgex-eve-logs')



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


def _is_model_fallback_error(error_message):
    """Return True when the Bedrock error suggests a deprecated or unavailable model."""
    lowered = str(error_message).lower()
    return any(marker in lowered for marker in [
        'deprecated',
        'not available',
        'model is unavailable',
        'model not found',
        'does not exist',
        'validationexception',
        'unknown model',
        'not supported',
        'unrecognized',
        'not found'
    ])


def get_model_candidates(configured_model_id):
    """Build a Bedrock model candidate list starting from the configured value."""
    candidates = []
    seen_models = set()

    if configured_model_id:
        candidates.append(configured_model_id)
        seen_models.add(configured_model_id)

    fallback_models = [
        'anthropic.claude-sonnet-4-20250514-v1:0',
        'anthropic.claude-haiku-4-5-20251001-v1:0',
    ]

    for model_id in fallback_models:
        if model_id not in seen_models:
            candidates.append(model_id)
            seen_models.add(model_id)

    return candidates


def invoke_bedrock_model(bedrock, model_id, system_prompt, user_message):
    """Invoke Bedrock with the appropriate Claude payload format."""
    if 'claude-3' in model_id:
        response = bedrock.invoke_model(
            modelId=model_id,
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 500,
                'temperature': 0.7,
                'top_p': 0.9,
                'system': system_prompt,
                'messages': [
                    {
                        'role': 'user',
                        'content': user_message
                    }
                ]
            })
        )
        response_body = json.loads(response['body'].read())
        return response_body.get('content', [{}])[0].get('text', '').strip()

    full_prompt = f"{system_prompt}\n\nHuman: {user_message}\n\nAssistant:"
    response = bedrock.invoke_model(
        modelId=model_id,
        body=json.dumps({
            'prompt': full_prompt,
            'max_tokens_to_sample': 500,
            'temperature': 0.7,
            'top_p': 0.9
        })
    )
    response_body = json.loads(response['body'].read())
    return response_body.get('completion', '').strip()


def get_ai_response(user_message):
    """Generate AI response using AWS Bedrock with fallback support"""
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
        
        # Get model ID from SSM and try a newer fallback chain if needed
        configured_model_id = get_ssm_parameter(
            f"/{SSM_PREFIX}/{ENV}/bedrock_model",
            'us.anthropic.claude-3-5-haiku-20241022-v1:0'
        )
        model_candidates = get_model_candidates(configured_model_id)
        last_error = None

        for model_id in model_candidates:
            try:
                logger.info(f"Trying Bedrock model: {model_id}")
                ai_response = invoke_bedrock_model(bedrock, model_id, system_prompt, user_message)
                if ai_response:
                    logger.info(f"Bedrock request succeeded with model: {model_id}")
                    return ai_response, "ai"
                last_error = RuntimeError(f"Bedrock returned an empty response for {model_id}")
            except Exception as exc:
                last_error = exc
                logger.warning(f"Bedrock request failed for model {model_id}: {str(exc)}")

        if last_error is not None:
            raise last_error

        return "I'm having trouble connecting to my AI service right now. Please try again in a moment.", "error"

    except Exception as e:
        # Log error and return a fallback message
        logger.error(f"AI response error: {str(e)}")
        return "I'm having trouble connecting to my AI service right now. Please try again in a moment.", "error"

def lambda_handler(event, context):
    # Log incoming requests for monitoring
    logger.info(f"request received: {event.get('httpMethod')} from {event.get('sourceIp', 'unknown')}")

    # Get the origin from the request and validate it
    request_origin = event.get('headers', {}).get('origin', '')
    if request_origin in ALLOWED_ORIGINS:
        cors_origin = request_origin
    else:
        cors_origin = ALLOWED_ORIGINS[0]  # Default to first allowed origin
    
    logger.info(f"Request origin: {request_origin}, Using CORS origin: {cors_origin}")

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': cors_origin,
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
