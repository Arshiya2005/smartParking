# smartParking
A full-stack web app that helps users find nearby available parking spots using OpenStreetMap APIs.

Backend Setup: 

Create .env in root folder:

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

    # Session Secret for express-session
    SESSION_SECRET=your_session_secret
    ORS_API_KEY=your_openrouteservice_api_key

    #razorpay credentials
    KEY_ID="your_key_id"
    KEY_SECRET="your_key_secret"

    #to sign up as admin
    ADMIN_SECRET="your_admin_secret"



Start backend server : 
    npm i
    npm run dev


Frontend setup:
    cd ./frontend

Create .env in frontend folder
    VITE_BASE_URL="http://localhost:3000/api"

Start frontend server :
    npm i
    npm run dev


API Keys Setup

#openroute
ORS website: https://openrouteservice.org
Get API Key: https://openrouteservice.org/dev/#/signup
API Docs: https://openrouteservice.org/dev/#/api-docs

#arcjet
https://docs.arcjet.com/get-started/#:~:text=Set%20your%20key,-Section%20titled%20%E2%80%9C2&text=Create%20a%20free%20Arcjet%20account,file%20in%20your%20project%20root.

#razorpay
https://razorpay.com/docs/payments/dashboard/account-settings/api-keys//?preferred-country=IN