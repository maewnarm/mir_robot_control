import time
import datetime
import requests
import threading
import json
import os
import logging
from model import  RobotInformation, TaskInformation
from typing import Any
from urllib.parse import urljoin

logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

class RobotManager:
    def __init__( self, ip:str, token:str, robot_id:str ):
        self.ip = ip
        self.token = token
        self.robot_id = robot_id
        self.current_status = RobotInformation(
                                    robot_id=self.robot_id,
                                    name=f'robot_{self.robot_id}',
                                    is_available=False,
                                    current_position=None,
                                    current_mission=None,
                                    pending_mission=[],
                                    current_task_id=None,
                                    current_task_status=None,
                                    mission_list=[]
                                )
        self.current_task = None

        self.backend_url = os.environ.get("BACKEND_URL")
        self.backend_key = os.environ.get("BACKEND_KEY")

        status_thred = threading.Thread(target=self._set_status, name="Status")
        status_thred.start()

        main_thread = threading.Thread(target=self._run, name="Main")
        main_thread.start()

    def _call_backend( self, method:str, url:str, data:dict ):
        headers = { 'X-API-KEY': self.backend_key, 'Accept': 'application/json' }
        if method == 'GET':
            response = requests.get( url = url, headers = headers )
        elif method == 'POST':
            response = requests.post( url = url, headers = headers, json = data )
        elif method == 'PUT':
            response = requests.put( url = url, headers = headers, json = data )
        elif method == 'DELETE':
            response = requests.delete( url = url, headers = headers )
        return response

    def _call_robot(self, method:str, url:str, data:dict ):
        headers = { 
            'Authorization': f'Basic {self.token}',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        if method == 'GET':
            response = requests.get( url = url, headers = headers )
        elif method == 'POST':
            response = requests.post( url = url, headers = headers, json = data )
        elif method == 'PUT':
            response = requests.put( url = url, headers = headers, json = data )
        elif method == 'DELETE':
            response = requests.delete( url = url, headers = headers )
        return response

    def _modify_action_in_mission(self, mission_id:str, action_id:str, action:dict):
        url = urljoin(f'http://{self.ip}', f'/api/v2.0.0/missions/{mission_id}/actions/{action_id}')
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_robot( method = 'PUT', url = url, data = action )
                if response.status_code == 200:
                    return True
                else:
                    return False
            except Exception as e:
                logger.error(f'Cannot modify action in the mission of robot {self.robot_id}: {e}')
                num_retry -= 1
        return False

    def _plc_register(self, plc_register_id:int, plc_value:Any):
        url = urljoin(f'http://{self.ip}', f'/api/v2.0.0/registers/{plc_register_id}')
        num_retry = 5
        while num_retry > 0:
            try:
                data = {'value': int(plc_value)}
                response = self._call_robot( method = 'PUT', url = url, data = data )
                if response.status_code == 200:
                    return True
                else:
                    return False
            except Exception as e:
                logger.error(f'Cannot get mission list from robot {self.robot_id}: {e}')
                num_retry -= 1
        return False

    def _get_missions_in_robot_queue(self):
        url = urljoin(f'http://{self.ip}', '/api/v2.0.0/mission_queue')
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_robot( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    mission_queue = response.json()
                    return mission_queue
                else:
                    return None
            except Exception as e:
                logger.error(f'Cannot get mission list from robot {self.robot_id}: {e}')
                num_retry -= 1
        return None

    def _add_mission_to_robot_queue(self, mission_id:str):
        url = urljoin(f'http://{self.ip}', f'/api/v2.0.0/mission_queue')
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_robot( method = 'POST', url = url, data = {'mission_id': mission_id} )
                if response.status_code == 201:
                    res_j = response.json()
                    return {'id': res_j.get('id', None)}
                else:
                    return False
            except Exception as e:
                logger.error(f'Cannot get mission list from robot {self.robot_id}: {e}')
                num_retry -= 1
        return False

    def _get_mission_detail(self, mission_id:str):
        url = urljoin(f'http://{self.ip}', f'/api/v2.0.0/missions/{mission_id}')
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_robot( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    return response.json()
                else:
                    return None
            except Exception as e:
                logger.error(f'Cannot get mission list from robot {self.robot_id}: {e}')
                num_retry -= 1
        return None
    
    def _get_status_of_mission_in_robot_queue(self, id:str):
        url = urljoin(f'http://{self.ip}', f'/api/v2.0.0/mission_queue/{id}')
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_robot( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    mission_info = response.json()
                    mission_status = {
                        'state': mission_info.get('state', None),
                        'started': mission_info.get('started', None),
                        'finished': mission_info.get('finished', None)
                    }
                    return mission_status
                else:
                    return None
            except Exception as e:
                logger.error(f'Cannot get status of mission in robot {self.robot_id}: {e}')
                num_retry -= 1
        return None

    def _get_mission_detail_from_mission_queue(self, id:str):
        url = urljoin(f'http://{self.ip}', f'/api/v2.0.0/mission_queue/{id}')
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_robot( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    mission_info = response.json()
                    mission_id = mission_info.get('mission_id', None)
                    mission_detail = self._get_mission_detail(mission_id)
                    return mission_detail
                else:
                    return None
            except Exception as e:
                logger.error(f'Cannot get mission list from robot {self.robot_id}: {e}')
                num_retry -= 1
        return None

    def _get_executing_mission(self, mission_queue:list):
        for mission in mission_queue[::-1]:
            if mission['state'].lower() == 'executing':
                mission_id = mission['id']
                mission_detail = self._get_mission_detail_from_mission_queue(mission_id)
                if mission_detail and isinstance(mission_detail, dict):
                    return mission_detail.get('name', 'Unknown Mission')
        return 'Unknown Mission'

    def _get_pending_mission(self, mission_queue:list):
        pending_mission_list = []
        for mission in mission_queue[::-1]:
            if mission['state'].lower() == 'pending':
                mission_id = mission['id']
                mission_detail = self._get_mission_detail_from_mission_queue(mission_id)
                mission_name = 'Unknown Mission'
                if mission_detail and isinstance(mission_detail, dict):
                    mission_name = mission_detail.get('name', 'Unknown Mission')
                pending_mission_list.append(mission_name)
        return pending_mission_list

    def _get_status(self) -> RobotInformation:
        url = urljoin(f'http://{self.ip}', '/api/v2.0.0/status')
        robot_info = RobotInformation(
                        robot_id=self.robot_id,
                        name=f'robot_{self.robot_id}',
                        is_available=False,
                        current_position=None,
                        current_mission=None,
                        pending_mission=[],
                        current_task_id=self.current_task.task_id if self.current_task else None,
                        current_task_status=self.current_task.status if self.current_task else None,
                        mission_list=[
                            {'mission_name': x.mission_name} for x in self.current_task.mission_list
                        ] if self.current_task else []
                    )
        num_retry = 2
        while num_retry > 0:
            try:
                response = self._call_robot( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    status = response.json()
                    robot_info.current_position = status.get('position', None)
                    robot_info.name = status.get('robot_name', f'robot_{self.robot_id}')
                    current_mission_queue = self._get_missions_in_robot_queue()
                    robot_info.current_mission = self._get_executing_mission(current_mission_queue)
                    robot_info.pending_mission = self._get_pending_mission(current_mission_queue)
                    robot_info.is_available = True

                    return robot_info
                else:
                    return robot_info
            except Exception as e:
                logger.error(f'Cannot get mission list from robot {self.robot_id}: {e}')
                num_retry -= 1
                time.sleep(1)
        return robot_info
    
    def _update_robot_json_file(self):
        logger.info('Update robot json file')
        filepath = os.environ.get('ROBOT_SYNC_FILE_PATH')
        info_dict = {
                        'name': self.current_status.name,
                        'is_available': self.current_status.is_available,
                        'current_position': self.current_status.current_position,
                        'current_mission': self.current_status.current_mission,
                        'pending_mission': self.current_status.pending_mission,
                        'current_task_id': self.current_status.current_task_id,
                        'current_task_status': self.current_status.current_task_status,
                        'mission_list': self.current_status.mission_list
                    }
        if filepath:
            with open(filepath, 'r') as f:
                data = json.load(f)
            for idx, _ in enumerate(data):
                if data[idx]['id'] == self.robot_id:
                    data[idx]['name'] = info_dict['name']
                    data[idx]['is_available'] = info_dict['is_available']
                    data[idx]['current_position'] = info_dict['current_position']
                    data[idx]['current_mission'] = info_dict['current_mission']
                    data[idx]['pending_mission'] = info_dict['pending_mission']
                    data[idx]['current_task_id'] = info_dict['current_task_id']
                    data[idx]['current_task_status'] = info_dict['current_task_status']
                    data[idx]['mission_list'] = info_dict['mission_list']
                break
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=4)
        logger.info('Update robot json file finished')

    def _set_status(self):
        while True:
            self.current_status = self._get_status()
            logger.info(self.current_status)
            self._update_robot_json_file()
            time.sleep(3)

    def _process_plc_register( self ):
        success = True
        for idx, param in enumerate(self.current_task.params_value):
            # register_id = 22 to 33
            if param is not None:
                if param['group_id'] is not None:
                    success = success and self._plc_register((idx * 3) + 22, param['group_id'])
                if param['chute_marker_no'] is not None:
                    success = success and self._plc_register((idx * 3) + 23, param['chute_marker_no'])
                if param['chute_direction'] is not None:
                    success = success and self._plc_register((idx * 3) + 24, param['chute_direction'])
            
            # register_id = 34,35
            success = success and self._plc_register(34, 370)
            success = success and self._plc_register(35, 350)
        
        return success
    
    def _process_mission_action( self ):
        success = True
        for mission in self.current_task.mission_list:
            mission_id = mission.mission_id
            for body in mission.body_list:
                for action_id, body_detail in body.items():
                    success = success and self._modify_action_in_mission(mission_id, action_id, body_detail)
        return success
    
    def _send_mission_robot( self ):
        return self._add_mission_to_robot_queue(self.current_task.order_mission_id)
    
    def _run( self ):
        while True:            
            # get mission from task and process each mission
            if self.current_task:
                if self.current_task.status == 'waiting':
                    logger.info(f'Robot, {self.robot_id} is processing task, {self.current_task.task_id}')
                    self.current_task.status = 'processing'

                    is_plc_registered = self._process_plc_register()
                    logger.info(f'plc_register_finished: {is_plc_registered}')
                    if not is_plc_registered:
                        self.current_task.status = 'incompleted: plc registration failed'
                        break

                    is_mission_action_processed = self._process_mission_action()
                    logger.info(f'Modify action in all mission: {is_mission_action_processed}')
                    if not is_mission_action_processed:
                        self.current_task.status = 'incompleted: action modification failed'
                        break

                    queue_id = self._send_mission_robot()['id']
                    logger.info(f'Send mission to robot: {queue_id}')
                    if not queue_id:
                        self.current_task.status = 'incompleted: post missions failed'
                        break

                    logger.info(f'Robot, {self.robot_id}, is working')
                    # check status of each mission
                    while self.current_task and not self.current_task.end:
                        mission_status = self._get_status_of_mission_in_robot_queue(queue_id)
                        if mission_status:
                            status_text = mission_status['state'].lower()
                            if status_text == 'failed':
                                status_text == 'incompleted: mission failed'
                            self.current_task.status = status_text
                            self.current_task.begin = mission_status['started']
                            self.current_task.end = mission_status['finished']
                        
                        time.sleep(2)
                    
                    logger.info(f'Robot, {self.robot_id}, finished working')

                time.sleep(5)
            else:
                logger.info(f'No task for robot {self.robot_id}')
                time.sleep(3)
        
    def get_current_status( self ) -> RobotInformation:
        """ This method returns current status of this robot
        """
        return self.current_status
    
    def set_task( self, task:TaskInformation ):
        """ This method sets list of mission to this robot
        """
        self.current_task = task
        for idx, mission in enumerate(self.current_task.mission_list):
            misison_id = mission.mission_id
            mission_detail = self._get_mission_detail(misison_id)
            self.current_task.mission_list[idx].mission_name = mission_detail.get('name', 'Unknown Mission')
        logger.info(f'Set task for robot {self.robot_id}')
        logger.debug(f'Task: {self.current_task}')
    
    def reset( self ):
        self.current_status = None
        self.current_task = None
