import os
import json
import pandas as pd
from azure.ai.evaluation import evaluate, TaskAdherenceEvaluator, OpenAIModelConfiguration
from compliance_evaluator import ComplianceEvaluator
from dotenv import load_dotenv

load_dotenv()

# 1. Setup Model Configuration
# Replace these with actual environment variables or configuration
model_config = OpenAIModelConfiguration(
    type="openai",
    model=os.getenv("OPENAI_MODEL", "gpt-4"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
    api_key=os.getenv("OPENAI_API_KEY", "YOUR_API_KEY")
)

# 2. Define the target (The agent we are evaluating)
def mock_safety_agent(query: str):
    # This is a placeholder for the actual agent logic
    # In a real scenario, this would import your agent code and call it.
    if "PPE" in query:
        return "You should wear safety glasses and gloves."
    return "Please refer to the site safety manual for specific instructions."

# 3. Load Data
with open("data/queries.json", "r") as f:
    data = json.load(f)
df = pd.DataFrame(data)

# 4. Initialize Evaluators
task_adherence = TaskAdherenceEvaluator(model_config)
compliance_eval = ComplianceEvaluator(model_config)

# 5. Run Evaluation
print("Starting evaluation...")
result = evaluate(
    data="data/queries.json",
    target=mock_safety_agent,
    evaluators={
        "task_adherence": task_adherence,
        "compliance": compliance_eval
    },
    evaluator_config={
        "task_adherence": {
            "column_mapping": {
                "query": "${data.query}",
                "response": "${target.response}"
            }
        },
        "compliance": {
            "column_mapping": {
                "query": "${data.query}",
                "response": "${target.response}",
                "ground_truth": "${data.ground_truth}"
            }
        }
    }
)

# 6. Output Results
print("Evaluation Complete!")
print(f"Results saved to: {result.studio_url}") # If using Foundry, otherwise prints metrics
print(result.metrics)
df_results = pd.DataFrame(result.rows)
df_results.to_csv("evaluation_results.csv", index=False)
print("Detailed results saved to evaluation_results.csv")
