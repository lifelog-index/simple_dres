
from endpoints import DRES
from function.login import login
from function.submit import _getActiveEvaluationID, submit_text, submit_image
from function.schema import LoginQuery

from utils import health_check

if __name__ == "__main__":
    server_endpoint = "https://vbs.videobrowsing.org"
    # account info
    account = [("15eagle1","kKSY8CRbuxp6")]

    login_endpoint = DRES.LOGIN.format(root_url=server_endpoint)
    sessionInfo = login(login_endpoint,
                        LoginQuery(username=account[0][0],password=account[0][1]))

    list_endpoint = DRES.LIST.format(root_url=server_endpoint)
    submit_endpoint = DRES.SUBMIT.format(root_url=server_endpoint)
    submit_text(interaction_id='a',
                submit_endpoint=submit_endpoint,
                list_endpoint=list_endpoint,
                sessionInfo=sessionInfo,
                content="test", 
                collection_name=None)
    
    
    submit_image(interaction_id='a',
                 submit_endpoint=submit_endpoint,
                 list_endpoint=list_endpoint,
                 sessionInfo=sessionInfo,
                 image_path="test", 
                 collection_name="v3c")