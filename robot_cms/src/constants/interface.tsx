export interface TaskQueue {
    id: number | null
    line_id: number
    part_model: string | null
    box_model: string | null
    mission_id_list: string[] | null
    status?: string | null
    duration_ms?: number | null
}

export interface RequestTaskQueue {
    line_id: number;
    part_model: string | null;
    box_model: string | null;
    mission_id_list: string[] | null;
}

export interface TaskHistory {
    id: number | null
    line_id: number
    part_model: string | null
    box_model: string | null
    mission_id_list: string[] | null
    robot_id: string | null
    status: string
    start: string
    finish: string
    duration_ms: number | null
    estimate_time_to_finish_ms: number | null
}

export interface RobotInfo {
    id: string | null
    ip: string
    name: string | null
    token: string
    is_available: boolean | string 
    current_position: object | null
    current_mission: string | null
    pending_mission: string[] | null
    mission_list: object[] | null
}