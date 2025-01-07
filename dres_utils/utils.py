import urllib.request

def health_check(endpoint: str) -> bool:
    try:
        response = urllib.request.urlopen(endpoint)
        return response.status == 200
    except Exception as e:
        return False