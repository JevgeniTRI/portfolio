import urllib.request
import urllib.parse
import json
import urllib.error

API_URL = "http://127.0.0.1:8000"

def test_login_and_create():
    # 1. Login
    print("Attempting login...")
    login_data = urllib.parse.urlencode({
        "username": "admin",
        "password": "admin123"
    }).encode("utf-8")
    
    try:
        req = urllib.request.Request(f"{API_URL}/token", data=login_data, method="POST")
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                print(f"Login failed: {response.status}")
                return
            
            data = json.loads(response.read().decode("utf-8"))
            token = data["access_token"]
            print("Login successful. Token received.")
    except urllib.error.HTTPError as e:
        print(f"Login request failed: {e.code} {e.reason}")
        print(e.read().decode("utf-8"))
        return
    except Exception as e:
        print(f"Login request failed: {e}")
        return

    # 2. Create Project
    print("Attempting to create project...")
    project_data = json.dumps({
        "title": "Test Project",
        "description": "This is a test project created by script.",
        "github_link": "https://github.com/test/test",
        "image_url": "https://placehold.co/600x400",
        "tags": ["test", "script"]
    }).encode("utf-8")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        req = urllib.request.Request(f"{API_URL}/projects/", data=project_data, headers=headers, method="POST")
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                print("Project created successfully!")
                print(response.read().decode("utf-8"))
            else:
                print(f"Create project failed: {response.status}")
    except urllib.error.HTTPError as e:
        print(f"Create project failed: {e.code} {e.reason}")
        print(e.read().decode("utf-8"))
    except Exception as e:
        print(f"Create project request failed: {e}")

if __name__ == "__main__":
    test_login_and_create()
