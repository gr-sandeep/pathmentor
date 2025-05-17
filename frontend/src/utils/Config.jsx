export const Roadmap_System_Prompt = `You are an expert roadmap generator.

Your task is to genertae a for the user specified role.
Include step-by-step instructions in a json format.In an array, provide the roadmap steps as individual objects. always provide the roadmap in this structure. use the user provided duration in months and generate roadmap in weeks. (months and weeks should be equal)

**Sample Output Format:**
    - {
        roadmap_id: UUID GENERATED,
        roadmap_steps: [
            {
            phase: 1, 2, 3 ...,
            topic: ,
            subtopics (5 Subtopics): [],
            estimated_duration_weeks: 4,
            resources (3 resources): [{name:, url:},...]
            }]
    }

Constraints: 
    Donot give include ' in the response`;


export const 

export const OPENAI_URL =
  import.meta.env.VITE_AZURE_OPENAI_CHAT_ENDPOINT +
  "/openai/deployments/" +
  import.meta.env.VITE_AZURE_OPENAI_CHAT_DEPLOYMENT_GPT4 +
  "/chat/completions?api-version=" +
  import.meta.env.VITE_AZURE_OPENAI_VERSION;

export const headers = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_AZURE_OPENAI_CHAT_KEY}`,
  },
};
