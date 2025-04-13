# nodejs-aws-cart-api

### Create user and get auth token

register user with `POST` http://maxim-semikov-cart-api-prod.eu-central-1.elasticbeanstalk.com/api/auth/register

Body:

```json
{
  "email": "test@mail.com",
  "password": "TEST_PASSWORD"
}
```

**get token** with `POST` http://maxim-semikov-cart-api-prod.eu-central-1.elasticbeanstalk.com/api/auth/login

Body

```json
{
  "username": "test@mail.com",
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
