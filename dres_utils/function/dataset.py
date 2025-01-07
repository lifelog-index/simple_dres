class Dataset:
    def get_timestamp(self, image_path):
        # TODO: Implement this method
        raise NotImplementedError

    def get_video(self, image_path):
        raise NotImplementedError

class V3CDataset(Dataset):
    def get_timestamp(self, image_path):
        # Implementation for V3C dataset
        return 0, 1

    def get_video(self, image_path):
        # Implementation for V3C dataset
        return "abc"

class MarineDataset(Dataset):
    def get_timestamp(self, image_path):
        # Implementation for Marine dataset
        return 0, 1

    def get_video(self, image_path):
        # Implementation for Marine dataset
        return "abc"

class LHEDataset(Dataset):
    def get_timestamp(self, image_path):
        # Implementation for LHE dataset
        return 0, 1

    def get_video(self, image_path):
        # Implementation for LHE dataset
        return "abc"


datasetFactory = {
    "v3c": V3CDataset,
    "marine": MarineDataset,
    "lhe": LHEDataset
}



# def get_start_end_time(videoid, keyframe_id):
#     tsv_file_path = '/home/lsc/2024/vbs24-refactor/database-services/examples/vbs2024/V3C-msb/{}.tsv'
#     filepath = Path(tsv_file_path.format(videoid))
#     tsv_df = pd.read_csv(filepath, sep='\t')
#     if keyframe_id-1 < len(tsv_df):
#         row = tsv_df.iloc[keyframe_id - 1]
#         return row['starttime'], row['endtime']
#     else: 
#         print(f'keyframe_id {keyframe_id} is out of bounds')
#         print(f'video {videoid} has {len(tsv_df)} keyframes')
#         print(tsv_file_path.format(videoid))
#         print(f'Trying to use the previous keyframe info')
#         row = tsv_df.iloc[keyframe_id - 2]
#         return row['starttime'], row['endtime']
    
# class SubmitDres(BaseBlock):
#     def __init__(self, config: ServiceConfig) -> None:
#         # self.endpoint = f"{config.host}:{config.port}"
#         self.endpoint = f"{config.host}"
#         self.api = "/api/v2/submit/{evaluationId}?session={sessionId}"
#         self.eval_api = "/api/v2/client/evaluation/list?session={sessionId}"
#         self.evaluationID = None

    

#     # def getImageID(self, imagePath: str) -> str:
#     #     # input: 'https://memoriease.computing.dcu.ie/vbsdata/VBS2022/keyframes/10864/shot10864_1_RKF.png'
#     #     # output: shot10864_1_RKF
#     #     # use regex to extract the image name from the url
#     #     pattern = re.compile(r'shot\d+_\d+_RKF')
#     #     match = pattern.search(imagePath)
#     #     shot_id = match.group(0)
#     #     video_id = shot_id[4:].split('_')[0]
#     #     return video_id
    
#     def getImageVideoID(self, imagePath: str) -> str:
#         pattern = re.compile(r'shot\d+_\d+_RKF')
#         match = pattern.search(imagePath)
#         shot_id = match.group(0)
#         video_id = shot_id[4:].split('_')[0]
#         return video_id
    
    
#     def getImageShotID(self, imagePath: str) -> str:
#         pattern = re.compile(r'shot\d+_\d+_RKF')
#         match = pattern.search(imagePath)
#         shot_id = match.group(0)
#         frame_id = shot_id[4:].split('_')[1]
#         return frame_id