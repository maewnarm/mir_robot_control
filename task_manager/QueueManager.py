import logging
import os
import requests
import time
import threading
from urllib.parse import urljoin
from RobotManager import RobotManager
from TaskInterpreter import TaskInterpreter
from model import TaskInformation, MissionInformation

logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

class QueueManager:
    def __init__( self ):
        self.taskInterpreter = TaskInterpreter()
        self.backend_url = os.environ.get("BACKEND_URL")
        self.backend_key = os.environ.get("BACKEND_KEY")

        self.robot_list = self._initialize_robot_list()
        logger.info(f'Get robot list as {self.robot_list}')

        robot_thread = threading.Thread(target=self._update_robot, name="Position")
        robot_thread.start()
    
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
    
    def _initialize_robot_list( self ):
        num_retries = 5
        robot_list = []
        while num_retries > 0:
            try:
                res = self._call_backend( method = 'GET',
                                        url = urljoin(self.backend_url, '/api/robot/list'), data = None )
                if res.status_code == 200:
                    robot_list = res.json()['robot_list']  
                else:
                    robot_list = []
                break
            except Exception as e:
                logger.error(f'Cannot get robot list: {e}')
                num_retries -= 1
                time.sleep(15)
        logger.info(f'Get robot list from backend successfully as {robot_list}')
        robot_obj_list = []
        for robot in robot_list:
            robot_obj_list.append( RobotManager( ip = robot['ip'],
                                                    token = robot['token'],
                                                    robot_id = robot['id'] ) )
        logger.info('... Initialized all robot objects ...')
        return robot_obj_list
    
    def _get_available_robot( self ):
        for robot in self.robot_list:
            if robot.current_status and robot.current_status.is_available:
                return robot
        return None
    
    def _get_first_task_from_backend( self ):
        url = urljoin(self.backend_url, '/api/task/get_first_task')
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_backend( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    task = response.json()
                    return task['task_queue']
                else:
                    return None
            except Exception as e:
                logger.error( f'Cannot get first task from backend: {e}' )
                num_retry -= 1
                time.sleep(15)
        return None
    
    def _delete_task_from_backend( self, task_id:str ):
        url = urljoin(self.backend_url, f'/api/task/task_queue?task_queue_id={task_id}')
        try:
            response = self._call_backend( method = 'DELETE', url = url, data = None )
            if response.status_code == 200:
                return True
            else:
                return False
        except Exception as e:
            logger.error( f'Cannot delete task from backend: {e}' )
            return False
    
    def _save_task_to_backend_history( self, task:dict ):
        url = urljoin( self.backend_url, '/api/task/save_task_history' )
        try:
            response = self._call_backend( method = 'POST', url = url, data = task )
            if response.status_code == 200:
                return response.json()
            else:
                return False
        except Exception as e:
            logger.error( f'Cannot insert task to backend history: {e}' )
            return False
        
    def _update_robot( self ):
        while True:
            for robot in self.robot_list:
                if robot.current_task:
                    update_task = {
                        'id': robot.current_task.task_id,
                        'line_id': robot.current_task.line_id,
                        'box_model': robot.current_task.box_model,
                        'part_model': robot.current_task.part_model,
                        'mission_id_list': [mission.mission_id for mission in robot.current_task.mission_list],
                        'order_mission_id': robot.current_task.order_mission_id,
                        'robot_id': robot.robot_id,
                        'status': robot.current_task.status,
                        'start': robot.current_task.begin,
                        'finish': robot.current_task.end,
                    }
                    task_history = self._save_task_to_backend_history( update_task )

                    if robot.current_task.status.lower() not in ['waiting', 'pending', 'executing', 'paused', 'processing']:
                        robot.reset()
            time.sleep(5)
            if not self.robot_list:
                self.robot_list = self._initialize_robot_list()

    def run( self ):

        while True:
            # get latest order from backend
            task = self._get_first_task_from_backend()

            if task:
                logger.info('Get a task from task queue')
                interpreted_task = self.taskInterpreter.interpret_task( task )
                if interpreted_task is None:
                    logger.info('.... Cannot interpret the task ....')
                    update_task = {
                        'line_id': task['line_id'],
                        'box_model': task['box_model'],
                        'part_model': task['part_model'],
                        'mission_id_list': task['mission_id_list'],
                        'order_mission_id': task['order_mission_id'],
                        'robot_id': None,
                        'status': 'incompleted: cannot interpret',
                        'start': None,
                        'finish': None
                    }

                    success_insert = self._save_task_to_backend_history( update_task )
                    success_delete = self._delete_task_from_backend( task['id'] )
                    if not ( success_delete and success_insert ):
                        logger.warning( f'Cannot move task from task queue to task history !!! NOTE: DATA MIGHT CORRUPTED' )
                
                else:
                    logger.info('.... Interpreted task ....')
                    # logger.debug(interpreted_task)

                    # generate mission list
                    mission_list = []
                    for mission_id in task['mission_id_list']:
                        mission_action_body = interpreted_task['mission_id_to_action_parameter'][mission_id]
                        mission_list.append(MissionInformation(
                            mission_id = mission_id,
                            mission_name = None,
                            body_list = mission_action_body,
                        ))

                    # get available robot
                    for robot in self.robot_list:
                        if not robot.current_task:
                            logger.info(f'Assign task to robot {robot.robot_id}')
                            update_task = {
                                'line_id': task['line_id'],
                                'box_model': task['box_model'],
                                'part_model': task['part_model'],
                                'mission_id_list': task['mission_id_list'],
                                'order_mission_id': task['order_mission_id'],
                                'robot_id': robot.robot_id,
                                'status': 'waiting',
                                'start': None,
                                'finish': None
                            }
                            task_history = self._save_task_to_backend_history( update_task )
                            success_delete = self._delete_task_from_backend( task['id'] )

                            # create task object
                            task_obj = TaskInformation(
                                task_id = task_history['id'],
                                line_id = task['line_id'],
                                part_model = task['part_model'],
                                box_model = task['box_model'],
                                params_value = interpreted_task['completed_params_value'],
                                mission_list = mission_list,
                                order_mission_id = task['order_mission_id'],
                                begin = None,
                                end = None,
                                status = 'waiting'
                            )
                            robot.set_task( task_obj )
                            break
            else:
                logger.info('No task in task queue')
            logger.info('----------------------------------------------')
            logger.info('')
            time.sleep(5)

                
