class VBS_TEMPLATE:
    # Some notes regarding the submission format. 
    # At least one answerSet is required
    # taskId, taskName are inferred if not provided
    # at least one answer is required, 
    # mediaItemCollectionName is inferred if not provided, 
    # start and end should be provided in milliseconds.
    # For most evaluation setups, an answer is built in one of the three following ways: 
    
    # A) only text is required: 
    # just provide the text property with a meaningful entry 
    
    # B) only a mediaItemName is required: 
    # just provide the mediaItemName, optionally with the 
    # collection name. 

    # C) a specific portion of a mediaItem is required: 
    # provide mediaItemName, start and end, optionally 
    # with collection name

    _TEXT = {
        "answerSets": [
            {
                "taskId": None,
                "taskName": None,
                "answers": [
                    {
                        "text": None, # Required
                        "mediaItemName": None, 
                        "mediaItemCollectionName": None, # Required
                    }
                ]
            }
        ]
    }


    _IMAGE = {
        "answerSets": [
            {
                "taskId": None,
                "taskName": None,
                "answers": [
                    {
                        "text": None,
                        "mediaItemName": None, # Required
                        "mediaItemCollectionName": None, # Required
                        "start": 0, # Required, milliseconds
                        "end": 0, # Required, milliseconds
                    }
                ]
            }
        ]
    }

def create_text_submission(text, collection_name):
    submission = VBS_TEMPLATE._TEXT.copy()
    submission["answerSets"][0]["answers"][0]["text"] = text
    submission["answerSets"][0]["answers"][0]["mediaItemCollectionName"] = collection_name 
    return submission

def create_image_submission(mediaItemName, start, end, collection_name):
    submission = VBS_TEMPLATE._IMAGE.copy()
    submission["answerSets"][0]["answers"][0]["mediaItemName"] = mediaItemName
    submission["answerSets"][0]["answers"][0]["mediaItemCollectionName"] = collection_name
    submission["answerSets"][0]["answers"][0]["start"] = start
    submission["answerSets"][0]["answers"][0]["end"] = end
    return submission