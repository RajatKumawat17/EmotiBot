# EmotiBot

EmotiBot is a sentiment analysis application that processes text data and provides sentiment insights through a modern web interface.

## Project Structure
```
EmotiBot/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── auth.py
│   │   └── sentiment.py
│   ├── requirements.txt
│   └── .env
├── frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── .env.local
└── README.md
```

## Setup Instructions

1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Unix/MacOS
# OR
.\venv\Scripts\activate   # On Windows
pip install -r requirements.txt
```

2. Frontend Setup
```bash
cd frontend
npm install
```

3. Environment Configuration
- Copy `.env.example` to `.env` in the backend directory
- Copy `.env.local.example` to `.env.local` in the frontend directory
- Update the environment variables as needed

4. Running the Application
Backend:
```bash
cd backend
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm run dev
```

5. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Test Credentials
- Username: testuser
- Password: testpassword

## Features
- Text sentiment analysis
- CSV file processing
- Interactive data visualization
- Secure authentication
- RESTful API
