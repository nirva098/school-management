# school-management
School management system APIs

## Setup Steps

1. Install dependencies:
    ```sh
    npm i
    ```
2. Ensure MongoDB database cluster is created, and populate the appropriate connection string with user and password in `DB_CONNECTION` env variable.

3. Start the development server:
    ```sh
    npm run dev
    ```
4. Verify the setup by making a GET request to `/test` endpoint. You should receive the response:
    ```
    Hello there!
    ```

## Running Unit Tests

To run tests, use the following command:
```sh
npm run test
```

### User Registration and Authentication

1. **Register a new user:**

    Endpoint: `POST /api/auth/register`

    Request body:
    ```json
    {
        "email": "your_email",
        "password": "your_password",
        "role": "super_admin OR school_admin" 
    }
    ```

    Response:
    ```json
    {
        "message": "User registered successfully"
    }
    ```

2. **Login to obtain a token:**

    Endpoint: `POST /api/auth/login`

    Request body:
    ```json
    {
        "email": "your_email",
        "password": "your_password"
    }
    ```

    Response:
    ```json
    {
        "token": "your_jwt_token"
    }
    ```

3. **Accessing endpoints based on user role:**

    Use the obtained token in the `Authorization` header as follows:
    ```
    Authorization: Bearer your_jwt_token
    ```

    Depending on the user's role, they can access different endpoints. For example:
    
    - **super_admin role** can: 
        - Create Manage schools, i.e. Create, Update, Delete, Get All. They can do all operations for all the schools. 
    
    - **school_admin** can:
        - Can manage classRooms and Students and can view their own school info. 

## Hosting

The APIs have been deployed on Render and can be accessed via the following URL:

[https://school-management-zh5e.onrender.com](https://school-management-zh5e.onrender.com)


## API Documentation

The API documentation, including all available endpoints and their details, is hosted at the following URL:

[https://app.swaggerhub.com/apis-docs/NIRAV20298/school-management_system_api/1.0.0#/](https://app.swaggerhub.com/apis-docs/NIRAV20298/school-management_system_api/1.0.0#/)