from pydantic import BaseModel

class CacheSetRequest(BaseModel):
    value: object
    ttl: int = 300

