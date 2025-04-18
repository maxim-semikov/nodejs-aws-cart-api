# nodejs-aws-cart-api

### Create user and get auth token

register user with `POST` https://ax3gt6lrzqyks2f64frhbfn5oa0btjhw.lambda-url.eu-central-1.on.aws/api/auth/register

Body:

```json
{
  "email": "test@mail.com",
  "password": "TEST_PASSWORD"
}
```

**get token** with `POST` https://ax3gt6lrzqyks2f64frhbfn5oa0btjhw.lambda-url.eu-central-1.on.aws/api/auth/login

Body

```json
{
  "username": "your_github_login",
  "password": "TEST_PASSWORD"
}
```

Response

```json
{
  "token_type": "Basic",
  "access_token": "eW91ckdpdGh1YkxvZ2luOlRFU1RfUEFTU1dPUkQ="
}
```
