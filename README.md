
# ⭐ Starwars API

Serverless API built with Node.js that integrates data from [SWAPI](https://swapi.dev) and [OpenWeatherMap](https://openweathermap.org), allowing you to fetch, enrich, store, and query Star Wars characters along with the weather of their home planets. It uses AWS Lambda, Redis, and DynamoDB as a scalable and distributed backend.

---

## 🚀 Features

- Fetch Star Wars characters via SWAPI.
- Enrich character data with current weather using OpenWeatherMap.
- Store enriched results in DynamoDB with Redis caching (30 minutes).
- RESTful API deployed on AWS Lambda using Serverless Framework.

---

## 📦 Technologies

- [Node.js](https://nodejs.org/)
- [Serverless Framework](https://www.serverless.com/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)
- [Amazon ElastiCache Redis](https://aws.amazon.com/elasticache/)
- SWAPI and OpenWeatherMap as public external APIs

---

## 📂 Local Setup

1. Clone the repository:

```bash
git clone https://github.com/O-Al-O/starwars.git
cd starwars-api
```

2. Install dependencies:

```bash
npm install
```

3. Ensure Redis is running locally on port `6379`.

4. Set environment variables directly in `serverless.yml` under `provider.environment`:

```yaml
provider:
  environment:
    REDIS_HOST_URL: redis://localhost:6379
    WEATHER_API_KEY: your_openweathermap_api_key
    QUERY_PARAM_SIGNATURE_SECRET: your_signature_secret
```

5. Start the application:

```bash
npm run start
```

---

## ☁️ Deployment to AWS

Deploy using [Serverless Framework](https://www.serverless.com/):

```bash
serverless deploy
```

### 🛠 Required Infrastructure:

- Existing VPC with at least two private subnets
- Security Group allowing access to port `6379` (Redis)
- Pre-provisioned Redis instance accessible from Lambda
- IAM permissions to deploy Lambda, API Gateway, and DynamoDB

### 📄 Required Configuration in `serverless.yml`

Make sure to define in `provider.environment`:

```yaml
provider:
  environment:
    REDIS_HOST_URL: redis://<your-redis-endpoint>:6379
    WEATHER_API_KEY: <your_openweathermap_api_key>
    QUERY_PARAM_SIGNATURE_SECRET: <your_signature_secret>
```

Also configure:

```yaml
vpc:
  securityGroupIds:
    - sg-xxxxxxxx
  subnetIds:
    - subnet-xxxxxx1
    - subnet-xxxxxx2
```

---

## 🔌 Sample Endpoints

- `POST /almacenar`  
  Stores custom data.  
  [`https://rhlrm7juth.execute-api.us-east-2.amazonaws.com/dev/almacenar`](https://rhlrm7juth.execute-api.us-east-2.amazonaws.com/dev/almacenar)

- `GET /historial`  
  Lists stored records with signed pagination.  
  [`https://rhlrm7juth.execute-api.us-east-2.amazonaws.com/dev/historial`](https://rhlrm7juth.execute-api.us-east-2.amazonaws.com/dev/historial)

- `GET /fusionados?id=1`  
  Combines character and weather data, caches and stores it.  
  [`https://rhlrm7juth.execute-api.us-east-2.amazonaws.com/dev/fusionados?id=1`](https://rhlrm7juth.execute-api.us-east-2.amazonaws.com/dev/fusionados?id=1)

---

## 🛡 Security

- A signature secret is used to secure pagination parameters in `/historial`.
- API keys and sensitive values should be set in `serverless.yml` or injected securely via CI/CD.

---

## 📖 License

MIT © O-Al-O
