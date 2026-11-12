#!/usr/bin/env bash
# Create one beta-tester account in the dog-pages user pool (the pool is closed to self-sign-up).
# Usage: make-tester-account.sh <username> "<Real Name>" "<temporary password>"
# The person is asked to choose their own password at first sign-in. Run by the administrator; this changes AWS.
set -euo pipefail
[ $# -eq 3 ] || { echo 'usage: make-tester-account.sh <username> "<Real Name>" "<temporary password>"'; exit 1; }
aws cognito-idp admin-create-user --region us-east-2 --user-pool-id us-east-2_IpNuUxIUm \
  --username "$1" --user-attributes Name=name,Value="$2" --temporary-password "$3" --message-action SUPPRESS \
  --query 'User.Username' --output text
