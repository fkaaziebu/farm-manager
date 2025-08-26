# Backend Server Setup
## Creating server (an EC2 instance) for backend setup
* AMI: Amazon Linux 2023 (linux based)
* Architecture: 64bit (ARM)
* Instance Type: t3.micro (micro instance)
* Key Pair: Create a new key pair(rsa) and download the private key file to your local machine so we can later save it to github secrets
* Security Group: Allow SSH and HTTP traffic
* Default storage of 8GB is okay unless you have a specific requirement for more storage.

## Creating a postgres db server (RDS on aws)
* Instance Type: db.t3.micro (micro instance)
* Storage: 20GB
* Backup: Enable automatic backups
* Security Group: Allow PostgreSQL traffic
* VPC: Select the same VPC as the EC2 instance

## Creating a redis server (ElastiCache on aws)
* Instance Type: cache.t3.micro (micro instance)
* Storage: 1GB
* Backup: Enable automatic backups
* Security Group: Allow Redis traffic
* VPC: Select the same VPC as the EC2 instance

## Creating a s3 bucket (S3 on aws)
* Bucket Name: farm-manager-bucket
* Region: us-east-1
* Versioning: Enable versioning
* Logging: Enable logging
* Public Access Block: Allow all public access
* VPC: Select the same VPC as the EC2 instance

# CI/CD Structure
* Code is pushed to the repository
* CI pipeline is triggered
* Tests are run
* Docker image is built and pushed to the container registry
* SSH into the production environment
* update install/update docker and docker-compose
* Copy docker-compose.yml and .env to production environment
* Run the docker-compose up -d command to start the services

# CI/CD PIPELINE Breakdown

## CI/CD PIPELINE trigger options
```code
name: Farm Manager CI/CD

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]
```

## CI/CD PIPELINE workflow services
```code
services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: farm_manager_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd="pg_isready -U postgres"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5

      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd="redis-cli ping || exit 1"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
```

## CI/CD PIPELINE workflow steps (job 1 [infrastructure provisioning])
```code
infra:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./terraform

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init

      - name: Terraform Plan
        run: terraform plan -out=tfplan
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Terraform Apply
        run: terraform apply -auto-approve tfplan
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Save Terraform Outputs
        id: tf_outputs
        run: |
          terraform output -json > outputs.json
          echo "EC2_IP=$(jq -r .app_public_ip.value outputs.json)" >> $GITHUB_ENV
          echo "POSTGRES_ENDPOINT=$(jq -r .postgres_endpoint.value outputs.json)" >> $GITHUB_ENV
          echo "REDIS_ENDPOINT=$(jq -r .redis_endpoint.value outputs.json)" >> $GITHUB_ENV
```

## CI/CD PIPELINE workflow steps (job 2 [deployment])
### Checkout repo
```code
- name: Checkout code
uses: actions/checkout@v4
```

### Install Node and dependencies
```code
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20

- name: Install dependencies
  run: npm install
```

### Run NestJS tests against Postgres + Redis
```code
- name: Run tests
  env:
    DATABASE_URL: postgres://postgres:postgres@localhost:5432/farm_manager_test
    REDIS_URL: redis://localhost:6379
  run: npm run test
```

### Setup Docker
```code
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3

- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build and push Docker image (linux/arm64)
  run: |
    docker buildx build \
      --platform linux/arm64 \
      --tag ${{ secrets.DOCKER_USERNAME }}/farm-manager:latest \
      --push \
```

### Deploy on EC2
```code
- name: Deploy to EC2 via SSH
  uses: appleboy/ssh-action@v1.2.0
  with:
    host: ${{ secrets.EC2_HOST }}
    username: ${{ secrets.EC2_USER }}
    key: ${{ secrets.EC2_SSH_KEY }}
    script: |
      cd ~/farm-manager || mkdir ~/farm-manager && cd ~/farm-manager
      # Cleanup old files
      docker system prune -af
      docker volume prune -f
      # Write .env file from GitHub secret
      echo "${{ secrets.ENV_FILE }}" > .env
      # Copy docker-compose.yml from repo
      cat > docker-compose.yml << 'EOF'
      $(cat docker-compose.yml)
      EOF
      # Start containers
      docker-compose up -d --remove-orphans
```


## Areas for documentation
* Infrastructure provisioning
* Deployment to different environments
* Backend, ml, mcp server documentation

## Areas for improvement
* Logging and monitoring
* Database migrations
