# Import configuration settings
from config import config_file

# Uvicorn aur os modules import kar rahe hain
import uvicorn
import os
import sys

# 'backend' folder ko Python ke path mein add kar rahe hain
# Taki Python 'app.py' aur 'my_app' ko dhoondh sake
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

# Ensure boolean type
testing = bool(config_file.get("testing", False))

if __name__ == "__main__":
    if testing:
        # Test mode
        from tests.all_tests import run_all_tests
        run_all_tests()
    else:
        # Normal backend mode
        uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)