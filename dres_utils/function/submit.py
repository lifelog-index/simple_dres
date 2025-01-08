


import os
import requests
import rich
import os 
from .logger import dres_logger

from .template import create_text_submission, create_image_submission
from .schema import SubmitResult, SessionInformation
from .dataset import datasetFactory


def urljoin(*args):
    return os.path.join(*args)

def _getActiveEvaluationID(evaluate_endpoint: str, sessInfo: SessionInformation ):
    
    sessid = sessInfo.sessionId
    usrname = sessInfo.username

    response = requests.get(evaluate_endpoint, params={'session': sessid})
    assert response.status_code == 200, f"Failed to get eval ID, DRES server response: {response.status_code}"
    response = response.json()
    IDS = {}

    for track in response:
        if track['status'] == 'ACTIVE':
            IDS[track['name']] = track['id']
    if len(IDS) == 0:
        dres_logger().error(usrname, "No active evaluations, please check the server status or account info.")
        return "", None
    elif len(IDS) == 1:
        dres_logger().info(usrname, f"Only one active evaluation, {list(IDS.keys())[0]} selected")
        return IDS[list(IDS.keys())[0]], list(IDS.keys())[0]
    else:
        # TODO: add parameter for default task
        default_task = os.environ.get('DEFAULT_TASK', '')
        # default_task = "QA"        
        dres_logger().info(usrname, f"Multiple active evaluations, selecting default task: {default_task}")
        for task in IDS.keys():
            if task.find(default_task) != -1:
                dres_logger().info(usrname, f"Found default task: {default_task}, {IDS[task]}")
                return IDS[task], task
        else:
            dres_logger().error(usrname, f"Failed to get active evaluation ID. No evaluation found for default task: {default_task}, {[(k, v) for v, k in IDS.items()]}")

    
def submit_text(interaction_id:str, submit_endpoint: str, list_endpoint: str, sessionInfo: SessionInformation, content: str, collection_name: str) -> SubmitResult:
    dres_logger().info(sessionInfo.username, "SUBMIT ANS TYPE: TEXT")
    try:
        evalID, taskName = _getActiveEvaluationID(list_endpoint, sessionInfo)
    except:
        dres_logger().error(sessionInfo.username, "Failed to get active evaluation ID, please check the server status or account info.")
        return SubmitResult(
            id=interaction_id,
            success=False,
            submission=None,
            message="Failed to get active evaluation ID, please check the server status or account info.",
        )
    
    sessionid = sessionInfo.sessionId
    dres_logger().debug(sessionInfo.username, f"Submit Text Ans: {content}")
    body = create_text_submission(text=content, collection_name=None)

    submit_endpoint = urljoin(submit_endpoint, evalID)
    dres_logger().debug(sessionInfo.username, f"Submit Endpoint: {submit_endpoint}")
    response = requests.post(
        submit_endpoint, # + f"?evaluationId={evalID}&sessionId={sessionid}",
        params={"evaluationId": evalID, "sessionId": sessionid},
        json=body,
        # add cookies
        headers={"Content-Type": "application/json", "Cookie": f"SESSIONID={sessionid}"}
    )
    dres_logger().debug(sessionInfo.username,
                        f"""Submit Response: {response.status_code}
                        Request URL: {response.request.url}
                        Request Body: {response.request.body}
                        Request Headers: {response.request.headers}""")
    
    dres_logger().debug(sessionInfo.username, f"Submit to '{taskName}'; evaluation ID: {evalID}")
    res = response.json()

    if res['status'] == 404:
        # {
        #     'title': 'Endpoint POST /api/v2/submit//9c59f752-654b-453a-82fe-6bac9c8d03ad not found',
        #     'status': 404,
        #     'type': 'https://javalin.io/documentation#endpointnotfound',
        #     'details': {}
        # }
        dres_logger().error(sessionInfo.username, f"Failed to submit text: {res['title']}")
        output = SubmitResult(
            id=interaction_id,
            success=False,
            submission=res.get('submission', None),
            message=res['title'],
        )
    else:
        # {
        #     "status": false,
        #     "description": "Submission 0652034b-0f1b-4052-9342-c0cd1d37d526 was rejected by filter: Duplicate submission received."
        # }
        dres_logger().info(sessionInfo.username, f"Submit Result: {res['status']} | {res['description']}")
        output = SubmitResult(
            id=interaction_id,
            success=res['status'],
            submission=res.get('submission', None),
            message=res['description'],
        )
    return output

def submit_image(interaction_id:str, submit_endpoint: str, list_endpoint: str, sessionInfo: SessionInformation, image_path: str, collection_name: str) -> SubmitResult:
    dres_logger().info(sessionInfo.username, "SUBMIT ANS TYPE: IMAGE")
    # collection_name = collection_name.lower()
    # datasetHandler = datasetFactory[collection_name]()
    # vid = datasetHandler.get_video(image_path)
    # start, end = datasetHandler.get_timestamp(image_path)
    # image_path = 'LHE1212/12121'
    vid = image_path.split('/')[0]
    start = image_path.split('/')[1]
    end = start

    body = create_image_submission(
        mediaItemName=vid,
        start=start, 
        end=end,
        collection_name=None,
    )
    
    sessionid = sessionInfo.sessionId
    dres_logger().debug(sessionInfo.username, f"Submit Image: {vid} | {start} | {end}")

    try:
        evalID, taskName = _getActiveEvaluationID(list_endpoint, sessionInfo)
    except:
        dres_logger().error(sessionInfo.username, "Failed to get active evaluation ID, please check the server status or account info.")
        return SubmitResult(
            id=interaction_id,
            success=False,
            submission=None,
            message="Failed to get active evaluation ID, please check the server status or account info.",
        )
    dres_logger().debug(sessionid, f"Submit to '{taskName}'; evaluation ID: {evalID}")
    submit_endpoint = urljoin(submit_endpoint, evalID)
    
    response = requests.post(
        submit_endpoint, 
        params={"evaluationId": evalID, "sessionId": sessionid},
        json=body,
        # add cookies
        headers={"Content-Type": "application/json", "Cookie": f"SESSIONID={sessionid}"}
    )
    
    dres_logger().debug(sessionInfo.username,
                        f"""Submit Response: {response.status_code}
                        Request URL: {response.request.url}
                        Request Body: {response.request.body}
                        Request Headers: {response.request.headers}""")
    
    dres_logger().debug(sessionInfo.username, f"Submit to '{taskName}'; evaluation ID: {evalID}")
    
    res = response.json()

    if res['status'] == 404:
        # {
        #     'title': 'Endpoint POST /api/v2/submit//9c59f752-654b-453a-82fe-6bac9c8d03ad not found',
        #     'status': 404,
        #     'type': 'https://javalin.io/documentation#endpointnotfound',
        #     'details': {}
        # }
        dres_logger().error(sessionInfo.username, f"Failed to submit text: {res['title']}")
        output = SubmitResult(
            id=interaction_id,
            success=False,
            submission=res.get('submission', None),
            message=res['title'],
        )
    else:
        # {
        #     "status": false,
        #     "description": "Submission 0652034b-0f1b-4052-9342-c0cd1d37d526 was rejected by filter: Duplicate submission received."
        # }
        dres_logger().info(sessionInfo.username, f"Submit Result: {res['status']} | {res['description']}")
        output = SubmitResult(
            id=interaction_id,
            success=res['status'],
            submission=res.get('submission', None),
            message=res['description'],
        )
    return output