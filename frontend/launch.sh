#!/bin/bash

npm run build

# Set the S3 bucket name
BUCKET="newsofpeace"

# Define the build directory path
BUILD_DIR="./build"

# Empty the S3 bucket
aws s3 rm "s3://$BUCKET" --recursive

# Navigate to the build directory
cd "$BUILD_DIR"

# Upload files to the S3 bucket
aws s3 sync . "s3://$BUCKET"

# Invalidate the CloudFront distribution
aws cloudfront create-invalidation --distribution-id E3JJ6CCDEYBZBY --paths "/*"
