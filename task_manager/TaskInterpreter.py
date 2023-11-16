import requests
import time
import os
import logging
from urllib.parse import urljoin

logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))
logger = logging.getLogger(__name__)

class TaskInterpreter:

    def __init__( self ):
        self.backend_url = os.environ.get("BACKEND_URL")
        self.backend_key = os.environ.get("BACKEND_KEY")

    def _call_backend( self, method:str, url:str, data:dict ):
        headers = { 'X-API-KEY': self.backend_key, 'Accept': 'application/json' }
        if method == 'GET':
            response = requests.get( url = url, headers = headers )
        elif method == 'POST':
            response = requests.post( url = url, headers = headers, data = data )
        elif method == 'PUT':
            response = requests.put( url = url, headers = headers, data = data )
        elif method == 'DELETE':
            response = requests.delete( url = url, headers = headers )
        return response

    def _get_line_chute( self, line_id:str, part_model:str, box_model:str ):
        if not line_id:
            return None
        q = f'?line_id={line_id}'
        if part_model:
            q += f'&part_model={part_model}'
        if box_model:
            q += f'&box_model={box_model}'
        url = urljoin( self.backend_url, f'/api/common/line_chute{q}' )
        num_retry = 5
        while num_retry > 0:
            try:
                # I'm here, have to check the result from backend
                response = self._call_backend( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    line_chute = response.json()
                    return line_chute['data']
                else:
                    return None
            except Exception as e:
                logger.error( f'Cannot get line chute from backend: {e}' )
                num_retry -= 1
                time.sleep(5)
        return None
    
    def _get_l_marker_group( self, line_id:str, group_id:str ):
        url = urljoin( self.backend_url, f'/api/common/l_marker_group?line_id={line_id}&group_id={group_id}' )
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_backend( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    l_marker_group = response.json()
                    return l_marker_group.get('data', [])
                else:
                    return None
            except Exception as e:
                logger.error( f'Cannot get l marker group from backend: {e}' )
                num_retry -= 1
                time.sleep(5)
        return None

    def _format_params_value(self, chute_dir_and_type_dict:dict, data_dict_list:list, req_chute_type:str):
        # print("print chute_dir_and_type_dict", chute_dir_and_type_dict)
        # print("print data_dict_list", data_dict_list)
        # print("print req_chute_type", req_chute_type)
        # correct logic here!
        for data in data_dict_list:
            status = data['status'] 
            if status != 1:
                continue
            group_id = data['group_id']
            chute_marker_no = data['chute_marker_no']
            fifo_index = data['fifo_index']
            chute_type_1 = data['chute_type']
            motor_chute_id = data['motor_chute_id']
            chute_dir_and_type = chute_dir_and_type_dict.get((group_id, chute_marker_no, fifo_index, chute_type_1), None)
            if chute_dir_and_type:
                chute_direction = chute_dir_and_type[1]
                chute_type = chute_dir_and_type[0]
            else:
                chute_type = None
                chute_direction = None
            if chute_type and chute_type == req_chute_type and chute_direction:
                return {
                    'group_id': group_id,
                    'chute_marker_no': chute_marker_no,
                    'chute_direction':chute_direction,
                    'fifo_index': fifo_index,
                    'motor_chute_id': motor_chute_id,
                    'status': status
                }

        return None
    
    def _get_params_value( self, group_chute_info:list ):
        # NOTE: this is a mock function
        #   the objective of this fucntion to to call external endpoint
        #       and get status of chute for any group_id which is in the group_chute_info 
        #       more than 1 record
        #   then select the avaiable chute based on fifo_index

        # print("print group_chute_info", group_chute_info)

        group_chute_info_dict = {}
        group_chute_no_dict = {}
        chute_dir_and_type_dict = {}
        for group_chute in group_chute_info:
            group_id = group_chute['group_id']
            chute_marker_no = group_chute['chute_marker_no']
            chute_direction = group_chute['chute_direction']
            fifo_index = group_chute['fifo_index']
            chute_type = group_chute['chute_type']

            if chute_type:
                chute_type = chute_type.lower()
                #it's here! change this point
            chute_dir_and_type_dict[(group_id, chute_marker_no, fifo_index, chute_type)] = (chute_type, chute_direction)

            if group_id not in group_chute_info_dict:
                group_chute_info_dict[group_id] = [group_chute]
                group_chute_no_dict[group_id] = [chute_marker_no]
            else:
                group_chute_info_dict[group_id].append(group_chute)
                group_chute_no_dict[group_id].append(chute_marker_no)

        # print("print group_chute_info_dict", group_chute_info_dict)
        # print("print group_chute_no_dict", group_chute_no_dict)
        group_chute_id_list = list(group_chute_info_dict.keys())
        group_chute_id_list.sort()
        # print("print group_chute_id_list", group_chute_id_list)
        data_to_send = []
        data_not_send = []
        for group_id in group_chute_id_list:
            if len(list(set(group_chute_no_dict[group_id]))) > 1:
                for data in group_chute_info_dict[group_id]:
                    # print("print data in group_chute_info", data)
                    data_to_send.append({
                        'group_id': data['group_id'],
                        'chute_marker_no': data['chute_marker_no'],
                        'fifo_index': data['fifo_index'],
                        'chute_type': data['chute_type'],
                        'motor_chute_id': data['motor_chute_id']
                    })
            else:
                data_not_send.append({
                    'group_id': data['group_id'],
                    'chute_marker_no': data['chute_marker_no'],
                    'fifo_index': data['fifo_index'],
                    'chute_type': data['chute_type'],
                    'motor_chute_id': data['motor_chute_id'],
                    'status': 1
                })
        # print("print data_to_send", data_to_send)
        # print("print data_not_send", data_not_send)

        # NOTE: we don't call real api, so let's make everything is available
        # response = self._call_backend( method = 'POST', url = API_URL, data = {'params': data_to_send} )
        # below is just mocking the response, all statuses will be available
        response = []
        for data in data_to_send:
            data['status'] = 1
            response.append( data )

        combine_data = data_not_send + response

        #### END OF MOCK PART, BELOW IS LOGIC TO SELECT CHUTE ####

        params_value = [
            self._format_params_value(chute_dir_and_type_dict, combine_data, 'empty_receive'), 
            self._format_params_value(chute_dir_and_type_dict, combine_data, 'empty_send'),
            self._format_params_value(chute_dir_and_type_dict, combine_data, 'fg_receive'), 
            self._format_params_value(chute_dir_and_type_dict, combine_data, 'fg_send'), 
        ]

        return params_value

    def _get_action_parameter( self, line_id:str, box_model:str, part_model:str, mission_id:str ):
        # print("print line_id", line_id, "box_model", box_model, "part_model", part_model, "mission_id", mission_id)
        if not line_id or not mission_id:
            return None
        
        q = f'?line_id={line_id}&mission_id={mission_id}'
        if box_model:
            q += f'&box_model={box_model}'
        if part_model:
            q += f'&part_model={part_model}'
        url = urljoin( self.backend_url, f'/api/common/mission_action{q}')
        # print("print url", url)
        num_retry = 5
        while num_retry > 0:
            try:
                response = self._call_backend( method = 'GET', url = url, data = None )
                if response.status_code == 200:
                    action_parameter = response.json()
                    # print("print action_parameter", action_parameter)
                    return action_parameter['data'][0] if action_parameter['data'] else None
                else:
                    return None
            except Exception as e:
                logger.error( f'Cannot get action parameter from backend: {e}' )
                num_retry -= 1
                time.sleep(5)
        return None
        
    def interpret_task( self, task:dict ):

        line_id = task['line_id']
        box_model = task['box_model']
        part_model = task['part_model']
        mission_id_list = task['mission_id_list']

        # get list of chute for this line_id, box_model, part_model
        chute_info_dict_list = self._get_line_chute( line_id, part_model, box_model )
        logger.info('...... Get chute info from backend ......')
        # logger.debug(f'......... {chute_info_dict_list} ........')
        if chute_info_dict_list is None:
            return None
        
        # get params_value which means only the available chute
        params_value = self._get_params_value( chute_info_dict_list )
        logger.info('...... Get params_value info from backend ......')
        # logger.debug(f'......... {params_value} ........')
        
        # for each param, get l_marker_id to get complete params_value
        completed_params_value = []
        for param in params_value:
            if param is None:
                completed_params_value.append( None )
            else:
                l_marker_group = self._get_l_marker_group( line_id,  param['group_id'] )
                if l_marker_group is None:
                    return None
            
                lmg_data = l_marker_group[0]
                param['l_marker_id'] = lmg_data['l_marker_id']
                completed_params_value.append( param )
        logger.info('...... Get completed_params_value info from backend ......')
        # logger.debug(f'......... {completed_params_value} ........')
        
        # for each mission_id, get body
        mission_id_to_action_parameter = {}
        # print("print mission_id_list", mission_id_list)
        for mission_id in mission_id_list:
            mission_id_to_action_parameter[mission_id] = []
            action_parameter = self._get_action_parameter( line_id, box_model, part_model, mission_id )
            # print("print action_parameter", action_parameter)
            if not action_parameter:
                return None
            for body, endpoint in zip(action_parameter['action_parameter'],
                                        action_parameter['action_parameter_endpoint']):
                action_str_idx = endpoint.find('actions/')
                action_id = endpoint[action_str_idx+8:action_str_idx+44] #get action_id
                # print("print body", body)
                # print("print endpoint", endpoint)
                # print("print completed_params_value", completed_params_value)
                #might be function to replace data
                # print("print start replace param")
                for idx, param in enumerate(body['parameters']):
                    if param['value'] and isinstance(param['value'], str) and 'group_id' in param['value']:
                        group_id_idx = int(param['value'][-2]) - 1
                        body['parameters'][idx]['value'] = int(completed_params_value[group_id_idx]['group_id'])
                    elif param['value'] and isinstance(param['value'], str) and 'l_marker' in param['value']:
                        l_marker_idx = int(param['value'][-2]) - 1
                        body['parameters'][idx]['value'] = str(completed_params_value[l_marker_idx]['l_marker_id'])
                    elif param['value'] and isinstance(param['value'], str) and 'chute_marker' in param['value']:
                        chute_marker_idx = int(param['value'][-2]) -1
                        body['parameters'][idx]['value'] = str(completed_params_value[chute_marker_idx]['chute_marker_no'])
                    elif param['value'] and isinstance(param['value'], str) and 'motor_chute' in param['value']:
                        motor_chute_idx = int(param['value'][-2]) -1
                        body['parameters'][idx]['value'] = str(completed_params_value[motor_chute_idx]['motor_chute_id'])
                    elif param['value'] and isinstance(param['value'], str) and 'chute_direction' in param['value']:
                        chute_direction_idx = int(param['value'][-2]) -1
                        body['parameters'][idx]['value'] = str(completed_params_value[chute_direction_idx]['chute_direction'])
                # print("print finish replace param")
                mission_id_to_action_parameter[mission_id].append({action_id: body})

        logger.info('...... Get mission_id_to_action_parameter info from backend ......')
        # logger.debug(f'......... {mission_id_to_action_parameter} ........')
        # return
        return {
            'completed_params_value': completed_params_value,
            'mission_id_to_action_parameter': mission_id_to_action_parameter
        }
