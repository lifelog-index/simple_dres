import rich
import requests
from .schema import LoginQuery, SessionInformation
from .logger import dres_logger

def login(login_endpoint: str, input: LoginQuery) -> SessionInformation:
    response = requests.post(login_endpoint, json=input.model_dump())
    if response.status_code != 200:
        dres_logger().error(input.username, f"Failed to get login session: {response.status_code}\nLogin Endpoint: {login_endpoint}")
        assert False, f"Failed to get login session"
    output = SessionInformation.model_validate_json(response.content)
    return output