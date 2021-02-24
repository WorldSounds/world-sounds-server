# WorldSound App
Application that provides million genres of song to explore, artists and generate playlist fiture
​
List of available endpoints:

- `POST /register`
- `POST /login`
- `GET /user`
​
Need an Authentication

- `GET /favgenre`
- `POST /favgenre`
- `DELETE /favgenre/:id`

### POST /register

Request:

- data:

```json
{
  "email": "string",
  "username": "string",
  "password": "string"
}
```

Response:

- status: 200
- body:
  ​

```json
{
    "id": "integer",
    "email": "string",
    "username": "string"
}
```

Errors:
```json
{
  "message": "Internal server error",
  "code": 500
}

```

### POST /login

Request:

- data:

```json
{
  "validator": "string",
  "password": "string"
}
```

Response:

- status: 200
- body:
  ​

```json
{
  "access_token": "jwt string"
}
```

Errors:
```json

{
  "name": "invalidLogin",
  "code": 401
},
{
  "message": "Internal server error",
  "code": 500
}

```

### GET /user

description: 
  get single user data based on its id

Request:

- headers: access_token (string)

Response:

- status: 200
- body:

```json

{
  "id": 1,
  "email": "example@mail.com",
  "username": "example",
  "createdAt": "timestampz",
  "updatedAt": "timestampz"
}

```

Errors:
```json

{
  "message": "Internal server error",
  "code": 500
}

```

### GET /favgenre

description: 
  get all favorite genres based on logged in user id

Request:

- headers: access_token (string)

- UserId (integer)

Response:

- status: 200
- body:

```json

{
  "id": 1,
  "UserId": 1,
  "Genre": "example",
  "createdAt": "timestampz",
  "updatedAt": "timestampz"
}

```

Errors:
```json

{
  "message": "Internal server error",
  "code": 500
}

```

### POST /favgenre

description: 
  add favorite genre based on logged in user id

Request:

- headers: access_token (string)

- UserdId (integer)

- body: 
```json

{
  "Genre": "string",
}

```

Response:

- status: 201
- body:

```json

{
  "id": 1,
  "genre": "example"
}

```

Errors:
```json

{
  "message": "Internal server error",
  "code": 500
},
{
  "message": "Item already exist",
  "code": 500
}

```

### DELETE /favgenre/:id

description: 
  delete single favorite genre based on logged in user id

Request:

- headers: access_token (string)

- params : id (integer)

Response:

- status: 200
- body:

```json

{
 "message": "Genre successfully deleted!"
}

```

Errors:
```json

{
  "message": "Internal server error",
  "code": 500
},
{
  "message": "item not found",
  "code": 401
}
```