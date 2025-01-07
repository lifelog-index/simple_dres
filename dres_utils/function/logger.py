import json
import requests
from datetime import datetime
from threading import Lock
import rich
from enum import Enum 

class LogLevel(Enum):
    ERROR = 0
    INFO = 1
    DEBUG = 2

class SingletonLogger:
    _instance = None
    _lock = Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(SingletonLogger, cls).__new__(cls)
                    cls._instance.system_name = "default_system"
                    cls._instance.service_name = "default_service"
                    cls._instance.level = 1
        return cls._instance
    
    def set(self, system_name, service_name, level=2):
        self.system_name = system_name
        self.service_name = service_name
        self.level = level

    def log(self, username, interaction_type, value, verbose=True):
        data = {
            "timestamp": datetime.now().isoformat() + "Z",
            "system_name": self.system_name,
            "username": username,
            "service_name": self.service_name,
            "interaction_type": interaction_type,
            "value": value
        }
        if verbose:
            interaction_color = {
                "info": "green",
                "error": "red",
                "debug": "yellow"
            }[interaction_type.lower()] 
            if self.level >= LogLevel[interaction_type.upper()].value:
                rich.print(
                    f"[green][bold]\[{data['service_name']}][/bold][/green][{interaction_color}][bold]\[{data['interaction_type']}][/bold][/{interaction_color}][yellow][bold]\[{data['username']}][/bold][/yellow][bold]{data['value']}[/bold]"
                )
        try:
            response = requests.post("http://0.0.0.0:3000/log", data=json.dumps(data))
        except:
            print("Failed to connect to the logging server")
            return 500, "Failed to connect to the logging server"
        return response.status_code, response.text
    
    def info(self, username, value, verbose=True):
        return self.log(username, "INFO", value, verbose)
    
    def error(self, username, value, verbose=True):
        return self.log(username, "ERROR", value, verbose)
    
    def debug(self, username, value, verbose=True):
        return self.log(username, "DEBUG", value, verbose)

def dres_logger(system_name='EAGLE', service_name='DRES'):
    l = SingletonLogger()
    l.set(system_name, service_name)
    return l

def test():
    # curl -X POST http://localhost:3000 -d '{
    #     "timestamp": "2021-01-01T00:00:00Z",
    #     "system_name": "example_system",
    #     "username": "test_user",
    #     "service_name": "example_service",
    #     "interaction_type": "test_interaction",
    #     "value": {"key": "A very long string here that exceeds 5MB to test artifact separation"}
    # }'

    # Usage
    logger = SingletonLogger()
    status_code, response_text = logger.log("test_user", "test_interaction", {"key": "A very long string here that exceeds 5MB to test artifact separation"})
    print(status_code, response_text)
    logger.set("example_system2", "example_service2")
    logger2 = SingletonLogger()
    status_code, response_text = logger2.log("test_user", "test_interaction", {"key": "A very long string here that exceeds 5MB to test artifact separation"})
    print(status_code, response_text)

if __name__ == "__main__":
    test()