# MiR Robot Control System

### Configuration Check List
**Backend API**
- [x] Set database configuration in `backend/.env.dev`
    ```
    PG_USER=postgres
    PG_PASS=PdHrrfwcLuZi5K6LNZ84eZj2
    PG_SERVER=178.128.53.246
    PG_PORT=5432
    PG_DB=mir_dev2
    ```
- [x] Set limit access with API key in `backend/.env.dev`
    ```
    API_KEY=YOUR_API_KEY
    ```
- [x] !Optional. Manager and api key will share robot data via file(`data/robot_list.json`) which configing in `backend/.env.dev`
    ```
    ROBOT_SYNC_FILE_PATH=/data/robot_list.json
    ```

**Robot Manager**
- [x] Set BACKEND_URL in `task_manager/.env.dev` to the url of the backend site 

```

BACKEND_URL=http://BACKEND_IP_OR_URL/api

```

However, if you run this on the same machine as the backend, you cannot use `localhost`, but have to set it as

```

BACKEND_URL=http://backend-api:8888

```

- [x] Set API key to be the same as ***Backend API*** in `task_manager/.env.dev`
    ```
    API_KEY=YOUR_API_KEY
    ```

**Robot CMS**
- [x] Set API url to ip or domain of ***Backend API*** in `robot_cms/.env.dev`
    ```
    NEXT_PUBLIC_API_URL=https://your-domain/api
    ```
- [x] Set API key to be the same as ***Backend API*** in `robot_cms/.env.dev`
    ```
    API_KEY=YOUR_API_KEY
    ```
**Web Server**
- [x] Change SSL Certificate in `nginx/certs`. SSL Certificate should be named as `server.crt` and `server.key`
### Deployment Guide
**How to run** <br/>
Start the applications.
```
docker-compose up -d
```
After all containers are up, services would be available by these path
|Service|Path|Port|
|---|---|---|
|Backend-API|your-domain/api|localhost:8888|
|Robot-CMS|your-domain/cms|localhost:5000|


Stop the applications.
```
docker-compose down --rmi all
```
restart the applications.
```
docker-compose restart
```