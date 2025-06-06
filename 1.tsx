import pandas as pd
import secrets

# Corrected file path
input_file = r'C:\Users\45425045\Downloads\mvp1_latest1.csv'
output_file = r'C:\Users\45425045\Downloads\masked_output.csv'

# Read the CSV
df = pd.read_csv(input_file)

# Remove the 'KEY' column if it exists
if 'KEY' in df.columns:
    df = df.drop(columns=['KEY'])

# Define masking function
def mask_model_name(name):
    if pd.isna(name):
        return name
    rand_suffix = secrets.token_hex(4)  # 8-character hex string
    if 'GLOBAL' in name:
        return f'MASKED_GLOBAL_{rand_suffix}'
    return f'MASKED_{rand_suffix}'

# Apply masking to MODEL_NAME
if 'MODEL_NAME' in df.columns:
    df['MODEL_NAME'] = df['MODEL_NAME'].apply(mask_model_name)

# Save masked output
df.to_csv(output_file, index=False)

print(f"Masked data saved to: {output_file}")
