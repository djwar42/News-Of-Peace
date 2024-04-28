#!/bin/bash

# Create a virtual environment
python -m venv lambda_env

# Activate the virtual environment
source lambda_env/bin/activate

# Install required packages
pip install requests boto3

# Deactivate the virtual environment
deactivate

# Navigate to the site-packages directory
cd lambda_env/lib/python3.9/site-packages/

# Copy your Python files to the site-packages directory
cp ../../../../{ApiHandler.py,FetchNews.py,GetSentiment.py,GetCategory.py,GetImportance.py} .

# Create a zip file for the Lambda function
zip -r ../../../../lambda_function.zip .

# Navigate back to the original directory
cd ../../../../

# Remove the virtual environment
rm -rf lambda_env

# Turn of AWS pagination
export AWS_PAGER=""

# Name of the Lambda function
LAMBDA_FUNCTION_NAME="FetchNews"

# Role ARN for the Lambda function
AWS_ROLE_ARN="arn:aws:iam::402692462524:role/FetchNewsRole"

# Check if the Lambda function already exists
if aws lambda get-function --function-name $LAMBDA_FUNCTION_NAME; then
    # Update the existing Lambda function
    aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --zip-file fileb://lambda_function.zip
else
    # Create a new Lambda function
    aws lambda create-function --function-name $LAMBDA_FUNCTION_NAME \
        --zip-file fileb://lambda_function.zip \
        --handler FetchNews.lambda_handler \
        --runtime python3.9 \
        --role $AWS_ROLE_ARN
fi

rm lambda_function.zip
