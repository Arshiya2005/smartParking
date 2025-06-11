# smartParking
A full-stack web app that helps users find nearby available parking spots using OpenStreetMap APIs.

Install dependencies : 

    npm i


Create .env :

    # Server Configuration
    PORT=your_desired_port

    # PostgreSQL Database Configuration
    PGUSER=your_postgres_username
    PGPASSWORD=your_postgres_password
    PGHOST=your_postgres_host_url
    PGDATABASE=your_database_name

    # Arcjet Configuration
    ARCJET_KEY=your_arcjet_api_key
    ARCJET_ENV=development

    # Google OAuth Configuration
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # Session Secret for express-session
    SESSION_SECRET=your_session_secret

Start server : 

    npm run dev