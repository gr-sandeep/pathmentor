from fastapi import FastAPI, status, APIRouter, Depends
from pydantic import BaseModel, Field
from fastapi.responses import JSONResponse
# generateroadmap.py
from fastapi import HTTPException
import openai
import os
from dotenv import load_dotenv
import json
from database import db_operation

# Load environment variables from .env file
load_dotenv()

# Azure OpenAI configuration
AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_CHAT_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_CHAT_ENDPOINT")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_VERSION")
AZURE_OPENAI_ENGINE = os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT_GPT4o")

# Configure OpenAI API
openai.api_type = "azure"
openai.api_key = AZURE_OPENAI_API_KEY
openai.api_base = AZURE_OPENAI_ENDPOINT
openai.api_version = AZURE_OPENAI_API_VERSION 


router = APIRouter(prefix="/api")


system_prompt = """
You are an expert roadmap generator.

Your task is to genertae a for the user specified role.
Include step-by-step instructions in a json format.In an array, provide the roadmap steps as individual objects. always provide the roadmap in this structure 

**Sample Output Format:**
    - {
        roadmap_id: UUID GENERATED,
        roadmap_steps: [
            {
            phase (6-8 Phases): 1, 2, 3 ...,
            topic: ,
            subtopics (5 Subtopics): [],
            estimated_duration_weeks: 4,
            resources: [{name:, url:},...]
            }]
    }

Constraints: 
    Donot give include ' in the response 

"""

# Define the request body model
class RoadmapRequest(BaseModel):
    role: str = Field(..., description="The role for which to generate the learning roadmap.")

@router.post("/generate-roadmap")
def generate_roadmap(request: RoadmapRequest):
    """
    Generate a learning roadmap for the given role using Azure OpenAI.
    """
    try:
        # Call Azure OpenAI using ChatCompletion
        response = openai.ChatCompletion.create(
            engine=AZURE_OPENAI_ENGINE,  # Use the engine from the environment variable
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate a detailed learning roadmap for the role: {request.role}."}
            ],
            max_tokens=2048,
            response_format={"type":"json_object"},
            temperature=0.7
        )
        
        roadmap = json.loads(response.choices[0].message["content"])
        
        roadmap_steps = json.dumps(roadmap["roadmap_steps"], indent=2)
        
        values = (roadmap["roadmap_id"],request.role,roadmap_steps)
        
        db_operation("INSERT INTO roadmaps_table (roadmap_id, roadmap_role, roadmap_json) VALUES(%s, %s, %s)",values)
    
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating roadmap: {str(e)}")  
     
     
     
     
