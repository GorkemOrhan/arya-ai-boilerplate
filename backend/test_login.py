import requests
import json

def test_admin_login():
    """Test logging in as admin and getting user information."""
    # Admin credentials
    admin_data = {
        "email": "admin@example.com",
        "password": "adminpassword"
    }
    
    # Login endpoint
    login_url = "http://localhost:5000/api/auth/login"
    
    try:
        # Attempt login
        login_response = requests.post(login_url, json=admin_data)
        print(f"Login Status Code: {login_response.status_code}")
        login_data = login_response.json()
        
        # Print login response
        print("\nLogin Response:")
        print(json.dumps(login_data, indent=2))
        
        if login_response.status_code == 200 and 'access_token' in login_data:
            # Get token
            token = login_data.get('access_token')
            
            # Validate token
            validate_url = "http://localhost:5000/api/auth/validate-token"
            headers = {"Authorization": f"Bearer {token}"}
            
            validate_response = requests.get(validate_url, headers=headers)
            print(f"\nToken Validation Status Code: {validate_response.status_code}")
            validate_data = validate_response.json()
            
            # Print token validation response
            print("\nToken Validation Response:")
            print(json.dumps(validate_data, indent=2))
            
            # Get current user
            me_url = "http://localhost:5000/api/auth/me"
            me_response = requests.get(me_url, headers=headers)
            print(f"\nCurrent User Status Code: {me_response.status_code}")
            me_data = me_response.json()
            
            # Print current user response
            print("\nCurrent User Response:")
            print(json.dumps(me_data, indent=2))
            
            return login_data, validate_data, me_data
        else:
            print("Login failed")
            return None, None, None
    except Exception as e:
        print(f"Error: {e}")
        return None, None, None

if __name__ == "__main__":
    print("Testing admin login...")
    test_admin_login() 