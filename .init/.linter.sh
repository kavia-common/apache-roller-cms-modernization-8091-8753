#!/bin/bash
cd /home/kavia/workspace/code-generation/apache-roller-cms-modernization-8091-8753/NotificationService
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

