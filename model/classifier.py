# # Load model directly
# from transformers import AutoTokenizer, AutoModelForTokenClassification

# tokenizer = AutoTokenizer.from_pretrained("jjzha/jobbert_skill_extraction")
# model = AutoModelForTokenClassification.from_pretrained("jjzha/jobbert_skill_extraction")

import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification

# Point to your local model directory where the model is cached
model_name = './models'  # Path to the folder containing the model (e.g., ./models or absolute path)

# Load the tokenizer and model from the local path
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

# Example text for skill extraction
text = "The candidate should have experience in Python, Java, and project management."

# Tokenize the input text
inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
inputs = {k: v.to("cpu") for k, v in inputs.items()}  # Send inputs to the device (use "cuda" if using GPU)

# Get the model's predictions (no gradient calculation during inference)
with torch.no_grad():
    outputs = model(**inputs)

# Process the output to extract skills
predictions = outputs.logits.argmax(dim=-1)

# Get the predicted labels from the model
labels = [model.config.id2label[prediction.item()] for prediction in predictions[0]]

# Extract skills using BIO tagging
skills = []
current_skill = ""
for token, label in zip(tokenizer.convert_ids_to_tokens(inputs["input_ids"][0]), labels):
    if token.startswith("##"):  # Handle subword tokenization
        current_skill += token[2:]  # Skip the "##" prefix
    elif label.startswith("B-"):  # Beginning of a new skill
        if current_skill:
            skills.append(current_skill)  # Append previous skill if any
        current_skill = token  # Start new skill
    elif label.startswith("I-"):  # Inside the same skill
        current_skill += " " + token
    else:  # Label is "O" (outside, non-skill word)
        if current_skill:
            skills.append(current_skill)  # Append previous skill if any
        current_skill = ""  # Reset for the next skill

# Add the last skill if any
if current_skill:
    skills.append(current_skill)

# Output the results
print("Text:", text)
print("Extracted Skills:", skills)
