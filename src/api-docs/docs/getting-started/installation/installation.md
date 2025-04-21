# For Developers

## Installation

While performing installation, ensure that you have Node.js and npm installed on your system. Follow these steps to install Farm Manager:

```code
npm install
```

## Setup
### .env File
Add the following environment variables to your `.env` file:

```
APP_PORT=3007
DB_HOST=localhost
DATABASE_URL=postgres_connection_url
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=farm-manager-db
DB_NAME=farm-manager-db
DB_NAME_TEST=farm-manager-db-test
JWT_SECRET=secret
REDIS_URL=redis_connection_url
REDIS_PASSWORD=password
GMAIL_USER=example@gmail.com
GMAIL_APP_PASSWORD=password
```

### Configuration
Configure the application by editing the `.env` file as per your requirements.


## Testing
For running tests, use the following command:

```code
npm run test
```

## Deployment
To deploy Farm Manager, follow these steps:

1. Build the application using the following command:

```code
npm run build
```

2. Start the application using the following command:

```code
npm start
```

## Production
To deploy Farm Manager in production, follow these steps:

1. Build the application using the following command:

```code
npm run build
```

2. Start the application using the following command:

```code
npm start
```

```Make sure you have separate env's for every environment```
