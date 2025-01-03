#!/bin/bash

# Create main project directories
mkdir -p frontend/src/{components/{Dashboard,Gauges,Controls,Indicators},services,types,utils} frontend/public
mkdir -p backend/{functions/{connectionHandler,simulationHandler,stateHandler},lib/{dynamodb,websocket},types}
mkdir -p infrastructure docs

# Create basic README files
echo "# Vehicle Dashboard Project" > README.md
echo "# Frontend Documentation" > frontend/README.md
echo "# Backend Documentation" > backend/README.md
echo "# Infrastructure Documentation" > infrastructure/README.md

# Create basic package.json for frontend (React + TypeScript)
cat > frontend/package.json << EOL
{
  "name": "vehicle-dashboard-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^4.9.5",
    "d3": "^7.8.5",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/d3": "^7.4.0"
  }
}
EOL

# Create basic package.json for backend
cat > backend/package.json << EOL
{
  "name": "vehicle-dashboard-backend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "aws-sdk": "^2.1450.0",
    "typescript": "^4.9.5"
  }
}
EOL

# Create basic TypeScript configuration
cat > frontend/tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
EOL

# Create basic AWS CloudFormation template
cat > infrastructure/template.yaml << EOL
AWSTemplateFormatVersion: '2010-09-09'
Description: Vehicle Dashboard Infrastructure

Resources:
  # S3 bucket for frontend
  FrontendBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub vehicle-dashboard-frontend-\${AWS::AccountId}
      WebsiteConfiguration:
        IndexDocument: index.html

  # DynamoDB table for vehicle state
  VehicleStateTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: vehicle-state
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: connectionId
          AttributeType: S
      KeySchema:
        - AttributeName: connectionId
          KeyType: HASH
EOL

# Make script executable
chmod +x setup.sh

echo "Project structure created successfully!" 