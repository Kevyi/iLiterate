# Set Up Guide
1. Open client folder
    >cd client <br/>
    >npm install<br/>
    >npm run dev<br/>
2. Open a different terminal to set up server
    >cd server <br/>
    >Windows: py -3 -m venv .venv  <br/>
    >Windows: .venv\Scripts\activate  <br/>
    
    >Mac: python3 -m venv .venv  <br/>
    >Mac: source .venv/bin/activate  <br/>
    
    *Note that for Windows, you might run into an error where you don't have permissions to activate the Virtual Environment. If so, then you will have to open a Command Prompt and activate it there instead of using VSCode terminal.
 7. Install from requirements.txt
    >Make sure your virtual environment is active<br/>
    >pip install -r requirements.txt
 8. Set up .env files in client folder and server fold
 9. Set up MongoDB Atlas
 10. Run the backend server
    >python main.py <br/>
    OR<br/>
    >python3 main.py<br/>
    

 
