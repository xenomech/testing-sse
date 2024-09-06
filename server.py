from sse_starlette.sse import EventSourceResponse
import asyncio
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


STREAM_DELAY = 0  # second
RETRY_TIMEOUT = 15000  # milisecond


@app.get("/stream")
async def message_stream(request: Request):
    def new_messages():
        # Add logic here to check for new messages
        yield True

    async def event_generator():
        while True:
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break
            
            # Checks for new messages and return them to client if any
            if new_messages():
                yield {
                    "event": "new_message",
                    "id": "message_id",
                    "retry": RETRY_TIMEOUT,
                    "data": f"New message at {datetime.now()}",
                }

            await asyncio.sleep(STREAM_DELAY)

    return EventSourceResponse(event_generator())
