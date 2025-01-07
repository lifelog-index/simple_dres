
import uuid

import requests
from pydantic import BaseModel
import os

class SessionInformation(BaseModel):
    id: str
    username: str 
    role: str
    sessionId: str


class ServerResult(BaseModel):
    id: str
    success: bool
    message: str 

class SubmitResult(BaseModel):
    id: str
    success: bool
    message: str 
    submission: str | None


class ResultItem(BaseModel):
    name: str
    distance: float
    url: str | None = None
    hdurl: str | None = None

class VBSResultItem(ResultItem):
    name: str
    distance: float
    url: str | None = None
    hdurl: str | None = None
    semanticTime: str | None = None
    utcTime: str | None = None
    location: str | None = None
    caption: str | None = None

class SearchResult(BaseModel):
    id: str
    results: list[ResultItem] | list[VBSResultItem]

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi import APIRouter, Depends

app = FastAPI()

from dres_utils.endpoints import DRES
from dres_utils.function.login import login
from dres_utils.function.submit import _getActiveEvaluationID, submit_text, submit_image
from dres_utils.function.schema import LoginQuery
session_info = None

model = "LHE_clip" 
# MVK_clip

server_endpoint = "https://vbs.videobrowsing.org"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["**"],
    allow_headers=["*"],
    expose_headers=["*"],

)

def create_video_segment(image_name) -> str:
    # use time as video segment
    frame_timestamp = int(image_name.split('/')[-1])
    return str(int(frame_timestamp/30000))


def create_video_segment_and_id(image_name) -> str:
    # use time as video segment
    frame_timestamp = int(image_name.split('/')[-1])
    video_id = image_name.split('/')[0]
    return str(int(frame_timestamp/30000)) +"_"+ video_id

def create_video_id(image_name) -> str:
    # use time as video segment
    video_id = image_name.split('/')[0]
    return video_id

from pathlib import Path
def get_image_id_from_url(image_url):
    frame_id = Path(image_url).stem
    video_id = Path(image_url).parent.name
    return video_id + "/" + frame_id

@app.get("/api/search")
def search(text: str) -> SearchResult:
    body = {
        "mode": "moment",
        "text": text,
        "model": model,
    }

    response = requests.post(
        "http://selab.nhtlongcs.com:20790/search/text",
        json=body
    )
    response = response.json()
    # response = {
    #     "status": "success",
    #     "mode": "moment",
    #     "results": [
    #     {
    #         "cluster_name": "09996/29700",
    #         "image_list": [
    #         {
    #             "id": "09996/29700",
    #             "path": "http://selab.nhtlongcs.com:20710/preview/V3C/09996/29700.webp",
    #             "time_in_seconds": 29
    #         }
    #         ]
    #     },
    #     {
    #         "cluster_name": "26227/184280",
    #         "image_list": [
    #         {
    #             "id": "26227/184280",
    #             "path": "http://selab.nhtlongcs.com:20710/preview/V3C/26227/184280.webp",
    #             "time_in_seconds": 184
    #         }
    #         ]
    #     }]
    # }

    
    
    # TODO: add log query text
    # response = response.json()
    results = []
    for d, result in enumerate(response['results']):
        for image in result['image_list']:
            results.append(VBSResultItem(
                name=image['id'],
                distance=d,
                url=image['path'],
                hdurl=image['path'],
                utcTime=create_video_segment(image['id']),
                semanticTime=create_video_segment_and_id(image['id']),
                location=create_video_id(image['id']),
                
            ))

    return SearchResult(
        id=str(uuid.uuid4()),
        results=results
    )

@app.get("/api/fetch/sequence")
def fetch_video(name: str):
    image_id = get_image_id_from_url(name)
    params = {
        "mode": "timeline",
        "image_id": image_id,
        "model": model,
    }
    response = requests.get(
        "http://selab.nhtlongcs.com:20790/search/related",
        params=params
    )
    response = response.json()
    
    results = []
    for d, result in enumerate(response['results']):
        for image in result['image_list']:
            results.append(VBSResultItem(
                name=image['id'],
                distance=d,
                url=image['path'],
                hdurl=image['path'],
                utcTime=create_video_segment(image['id']),
                semanticTime=create_video_segment_and_id(image['id']),
                location=create_video_id(image['id']),
                
            ))

    return SearchResult(
        id=str(uuid.uuid4()),
        results=results
    )

@app.get("/api/fetch/segment")
def fetch_segment_in_video(name: str):
    image_id = get_image_id_from_url(name)
    print(image_id)
    params = {
        "mode": "timeline",
        "image_id": image_id,
        "model": model,
    }
    response = requests.get(
        "http://selab.nhtlongcs.com:20790/search/related",
        params=params
    )
    response = response.json()
    
    results = []
    for d, result in enumerate(response['results']):
        for image in result['image_list']:
            results.append(VBSResultItem(
                name=image['id'],
                distance=d,
                url=image['path'],
                hdurl=image['path'],
                utcTime=create_video_segment(image['id']),
                semanticTime=create_video_segment_and_id(image['id']),
                location=create_video_id(image['id']),
                
            ))
            if image_id == image['id']:
                saved_segment = results[-1].utcTime
    results = [result for result in results if result.utcTime == saved_segment]
    return SearchResult(
        id=str(uuid.uuid4()),
        results=results
    )

@app.get("/api/search/item")
def search_image(name: str) -> SearchResult:
    image_id = get_image_id_from_url(name)
    params = {
        "mode": "similar",
        "image_id": image_id,
        "model": model,
    }
    response = requests.get(
        "http://selab.nhtlongcs.com:20790/search/related",
        params=params
    )
    # print(response)
    response = response.json()
    results = []
    for d, result in enumerate(response['results']):
        for image in result['image_list']:
            results.append(VBSResultItem(
                name=image['id'],
                distance=d,
                url=image['path'],
                hdurl=image['path'],
                utcTime=create_video_segment(image['id']),
                semanticTime=create_video_segment_and_id(image['id']),
                location=create_video_id(image['id']),
                
            ))

    return SearchResult(
        id=str(uuid.uuid4()),
        results=results
    )


@app.get("/api/dres/login")
def dres_login(username: str, password: str) -> SessionInformation:
    global session_info
    session_info = login(DRES.LOGIN.format(root_url="https://vbs.videobrowsing.org"),
                         LoginQuery(username=username, password=password))
    return session_info

@app.get("/api/dres/submit/")
def dres_submit(session: str, item: str) -> SubmitResult:
    if session_info is None:
        # log
        return SubmitResult(id=str(uuid.uuid4()), success=False, message="Not logged in", submission=None)
    session_info.sessionId = session
    list_endpoint = DRES.LIST.format(root_url=server_endpoint)
    submit_endpoint = DRES.SUBMIT.format(root_url=server_endpoint)
    
    if 'http' in item:
        return submit_image( interaction_id=str(uuid.uuid4()),
                        submit_endpoint=submit_endpoint,
                        list_endpoint=list_endpoint,
                        sessionInfo=session_info,
                        image_path=get_image_id_from_url(item), 
                        collection_name=None)
    else:
        return submit_text( interaction_id=str(uuid.uuid4()),
                            submit_endpoint=submit_endpoint,
                            list_endpoint=list_endpoint,
                            sessionInfo=session_info,
                            content=item, 
                            collection_name=None)
    
@app.get("/api/dres/task/")
def dres_track(name: str):
    os.environ["DEFAULT_TASK"] = name
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    import rich
    # rich.print(search("test"))  
    # rich.print(fetch_segment_in_video("11909/148214"))
    # rich.print(fetch_video("11909/148214"))
    # rich.print(search_image("11909/148214"))
    # rich.print(dres_login("15eagle1","kKSY8CRbuxp6"))
    # rich.print(dres_submit_text("test"))
    uvicorn.run(app, host="localhost", port=8080)