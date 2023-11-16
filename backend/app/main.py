import uvicorn
import sys
import os
import threading
import time
import multiprocessing
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services import RobotSyncService
from app.router import common_router, task_router, robot_router
from app.dependencies import get_pg_async_db

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

robot_sync_service = RobotSyncService(robot_list_file_path=os.environ.get("ROBOT_SYNC_FILE_PATH"))

app.include_router(common_router(get_pg_async_db), prefix="/api/common")
app.include_router(task_router(get_pg_async_db), prefix="/api/task")
app.include_router(robot_router(db=get_pg_async_db, robot_sync_service=robot_sync_service), prefix="/api/robot")

@app.on_event('startup')
async def setup_app():
    robot_sync_service.start()

@app.on_event('shutdown')
async def shutdown_app():
    robot_sync_service.stop()
    robot_sync_service.join()

if __name__ == "__main__":
    app_config = {
        'host': '0.0.0.0',
        'port': 8888,
    }
    if '--reload' in sys.argv:
        app_config['reload'] = True
    uvicorn.run('app.main:app', **app_config)
