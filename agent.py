import requests
from langchain.chat_models import ChatOpenAI
from langchain.agents import Tool, initialize_agent
from langchain.agents.agent_types import AgentType
from langchain.tools import tool
import os
from dotenv import load_dotenv

load_dotenv()

API_URL = "http://localhost:5000/api/posts"

# ============ Tool Definitions ============

@tool
def get_posts(topic: str) -> str:
    """Fetches all posts from the social media API."""
    try:
        response = requests.get(API_URL)
        return response.json()
    except Exception as e:
        return f"Error fetching posts: {e}"

@tool
def generate_post_content(topic: str) -> str:
    """Generates a short post based on a given topic."""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
    response = llm.predict(f"Write a short, opinionated social media post about: {topic}")
    return response.strip()

@tool
def submit_post(author_and_content: str) -> str:
    """Submits a post to the social media API. Input should be 'Author: Content'."""
    try:
        author, content = author_and_content.split(":", 1)
        payload = {"author": author.strip(), "content": content.strip()}
        response = requests.post(API_URL, json=payload)
        return response.json()
    except Exception as e:
        return f"Error submitting post: {e}"

# ============ Initialize Agents ============

tools = [get_posts, generate_post_content, submit_post]

agent = initialize_agent(
    tools,
    llm=ChatOpenAI(model="gpt-4o-mini", temperature=0),
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
)

# ============ Natural Language CLI ============

if __name__ == "__main__":
    instruction = input("Enter some instructions: ")
    print(f"\n🧠 Running agent with instruction: {instruction}\n")

    result = agent.run(instruction)
    print("\n✅ Final Result:", result)
