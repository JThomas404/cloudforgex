import json
import os

# Cache optimisation for knowledge base data
_cached_data = None

def load_project_data():
    global _cached_data
    
    # Return cached data if already loaded
    if _cached_data is not None:
        return _cached_data
    
    try:
        # Get the directory where this script is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Build the full path to the JSON file
        json_path = os.path.join(current_dir, 'project_knowledge_base.json')
        
        # Open and load the JSON file (in Read-only mode)
        with open(json_path, 'r', encoding='utf-8') as file:
            _cached_data = json.load(file)
            return _cached_data
        
    except Exception as e:
        print(f"Oops! I'm having trouble accessing my knowledge base right now: {e}")
        _cached_data = {
            "projects": [],
            "personal_profile": {},
            "suggested_responses": {}
        }
        return _cached_data


def get_suggested_response(user_message):
    """Check for predefined suggested responses"""
    knowledge_data = load_project_data()
    suggested_responses = knowledge_data.get('suggested_responses', {})
    return suggested_responses.get(user_message.strip())

def get_enhanced_system_prompt():
    # Get complete knowledge base data
    knowledge_data = load_project_data()
    personal_profile = knowledge_data.get('personal_profile', {})
    projects = knowledge_data.get('projects', [])

    # Build personal context from JSON data
    personal_context = f"""
JARRED THOMAS - VERIFIED PROFILE:

BACKGROUND:
• Location: {personal_profile.get('location', 'Not specified')}
• Education: {personal_profile.get('education', 'Not specified')}
• Tech Journey Started: {personal_profile.get('tech_journey_start', 'Not specified')} ({personal_profile.get('experience_years', 'Not specified')} years experience)
• Current Role: {personal_profile.get('career_timeline', [{}])[-1].get('role', 'Not specified')}
• Current Company: {personal_profile.get('career_timeline', [{}])[-1].get('company', 'Not specified')}

CERTIFICATIONS:
• CCNA: February 27, 2024
• AWS Cloud Practitioner: August 2024
• AWS Solutions Architect Associate: January 2025
• Microsoft Azure Fundamentals: July 2024

SPECIALIZATIONS:
• {', '.join(personal_profile.get('specializations', []))}

CAREER GOALS:
• {personal_profile.get('career_goals', 'Not specified')}
• Currently Learning: {', '.join(personal_profile.get('currently_learning', []))}
"""

    # Create project summary (limit to avoid token limits)
    project_summary = "\n\nKEY PROJECTS:\n"
    for project in projects[:10]:  # Limit to top 10 projects
        title = project.get('title', 'Unknown Project')
        summary = project.get('summary', 'No description available')
        project_summary += f"• {title}: {summary}\n"

    # Combine all sections
    enhanced_prompt = SYSTEM_PROMPT + personal_context + project_summary

    return enhanced_prompt
    

SYSTEM_PROMPT = """You are EVE, Jarred Thomas's portfolio assistant. Answer questions based ONLY on the verified information provided below.

ABOUT YOU (EVE):
• You are built using AWS Lambda, API Gateway, Amazon Bedrock (Claude), and DynamoDB
• You help visitors learn about Jarred's cloud engineering work and projects
• You are part of Jarred's CloudForgeX portfolio project

CRITICAL ACCURACY RULES:
• Jarred started his tech journey in 2022 (3 years experience, NOT 5 years)
• CCNA obtained February 27, 2024 (NOT 2017)
• Currently works at SEIDOR Networks as Technical Support Engineer
• Based in Johannesburg, South Africa
• Self-taught through certifications and practical experience
• NEVER invent dates, experience lengths, or assume information not provided
• If specific details aren't available, say "I don't have that specific information"

RESPONSE GUIDELINES:
• Speak in first person as EVE (e.g. "I can show you...")
• Refer to Jarred in third person
• Use clean paragraph formatting with occasional **bold** for emphasis
• Focus on verified facts from the knowledge base
• Use bullet points when helpful
• Be friendly, confident, and factually accurate (e.g. "I love this question... Jarred's vision is one of continuous evolution.")

CONTACT INFORMATION:
• Email: jarredthomas101@gmail.com
• LinkedIn: https://linkedin.com/in/jarred-thomas
• GitHub: https://github.com/JThomas404

Answer based only on the verified facts provided below:"""
