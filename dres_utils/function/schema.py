from pydantic import BaseModel

class LoginQuery(BaseModel):
    username: str
    password: str

    
class SessionInformation(BaseModel):
    id: str
    username: str 
    role: str
    sessionId: str


class SubmitResult(BaseModel):
    id: str
    success: bool
    message: str 
    submission: str | None

