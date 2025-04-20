from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import os
import google.generativeai as genai
import json
import string


app = Flask(__name__)
CORS(app)

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
mongodb_password = os.getenv("MONGODB_PASSWORD")
genai.configure(api_key=api_key)


generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 65536,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
)

@app.route("/api/generate-sentence", methods=["POST"])
def generate_sentence():
    user_prompt = request.json.get("prompt")
    response = model.generate_content(
        f"""You are an AI that always returns output in clean JSON format.
        When given a prompt, you must:
        1. Generate a creative sentence related to the prompt.
        2. Replace two key words with blanks.
        3. Give three options for each blank (one correct, two distractors). It should be clear to a user reading the sentece which option is the right answer 
        and which two options are incorrect. This could mean making the other two options not make grammatical sense.
        Format like this:
        {{
        "actual_sentence": "...",
        "sentence_with_blanks": "...",
        "blank_options_1": ["...", "...", "..."],
        "blank_options_2": ["...", "...", "..."]
        }}

        Prompt: {user_prompt}
        """
    )
    raw = response.text.strip()
    if raw.startswith("```json"):
        raw = raw.lstrip("```json").rstrip("```").strip()
    elif raw.startswith("```"):
        raw = raw.lstrip("```").rstrip("```").strip()
    return jsonify(json.loads(raw))

@app.route("/api/get-definition", methods=["POST"])
def get_definition():
    word = request.json.get("word")
    word = word.strip(string.punctuation+string.digits)
    print(word)
    client = MongoClient(f"mongodb+srv://bhuvaneshsel:{mongodb_password}@cluster0.q6o5ufo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    db = client["iLiterate_Database"]
    collection = db["definitions"]
    word_exists = collection.find_one({"word": word})
    if word_exists:
        print("definition found")
        client.close()
        return jsonify({"word":word, "definition":word_exists["definition"]})
    else:
        word_with_definition = generate_definition(word)
        word, definition = list(word_with_definition.items())[0]
        document = {"word":word, "definition":definition }
        collection.insert_one(document)
        document.pop("_id", None)
        client.close()
        return jsonify(document)



def generate_definition(word):
    response = model.generate_content(
        f"""You are an AI that always returns output in clean JSON format.
        When given a prompt, you must:
        1. Generate a definition of the given word. Try to keep the definition simple as the user is 
        someone who is learning English.
        Format like this:
        {{
        "word":"definition"
        }}
        word: {word}
        """
    )
    raw = response.text.strip()
    print(f"RAW FROM GEMINI:\n{raw}\n") 
    if raw.startswith("```json"):
        raw = raw.lstrip("```json").rstrip("```").strip()
    elif raw.startswith("```"):
        raw = raw.lstrip("```").rstrip("```").strip()
    response_dict = json.loads(raw)
    return response_dict



if __name__ == "__main__":
    app.run(debug=True)