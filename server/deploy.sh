#!/usr/bin/env bash
# Builds the package and updates the dogpages stack (region us-east-2). Run from the repo root with AWS credentials.
set -euo pipefail
REGION=us-east-2
ACC=$(aws sts get-caller-identity --query Account --output text)
B=7sistersgreatdanes-dogpages-artifacts-$ACC
TMP=$(mktemp -d)
H=$(python3 server/build-zip.py "$TMP/dogpages.zip")
aws s3 cp "$TMP/dogpages.zip" "s3://$B/dogpages-$H.zip" --only-show-errors
aws cloudformation deploy --region $REGION --stack-name dogpages --template-file server/template.yaml \
  --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset \
  --parameter-overrides PoolId=us-east-2_IpNuUxIUm ClientId=15rsm9p997ljumjs3p69d7nn42 AdminUsers=dmj \
  CodeBucket="$B" CodeKey="dogpages-$H.zip" MonthlyBudgetUsd=5
aws cloudformation describe-stacks --region $REGION --stack-name dogpages --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text
