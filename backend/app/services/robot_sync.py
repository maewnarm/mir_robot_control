import json
import threading
import time
from app.schema.robot import Robot

class RobotSyncService(threading.Thread):
    def __init__(self, robot_list_file_path: str, *args, **kwargs) -> None:
        super(RobotSyncService, self).__init__(*args, **kwargs)
        self.robot_list = []
        self.robot_list_file_path = robot_list_file_path
        self.stopper = threading.Event()

    def stop(self):
        self.stopper.set()

    def get_robot_list(self):
        return self.robot_list
    
    def get_robot_by_id(self, id: str):
        for i in self.robot_list:
            if i['id'] == id:
                return i
        return None

    def run(self):
        while True:
            if self.stopper.isSet():
                return
            self._sync()
            time.sleep(1)
    
    def _sync(self):
        with open(self.robot_list_file_path, 'r') as robot_list_file:
            data = json.load(robot_list_file)
            self.robot_list = []
            for i in data:
                self.robot_list.append(Robot(
                    id=i['id'],
                    ip=i['ip'],
                    token=i['token'],
                    name=i['name'],
                    current_mission=i['current_mission'],
                    current_position=i['current_position'],
                    is_available=i['is_available'],
                    mission_list=i['mission_list'],
                    pending_mission=i['pending_mission'],
                    current_task_id=i['current_task_id'],
                    current_task_status=i['current_task_status']
                ))
