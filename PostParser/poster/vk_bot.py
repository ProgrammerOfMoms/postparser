import vk_api
from datetime import datetime, timedelta, timezone
import time

class Bot:
    def __init__(self, token, v):
        self.token = token
        self.vk = None
        self.v = v
    
    def auth(self):
        if self.vk == None:
            self.vk = vk_api.VkApi(token=self.token, api_version=self.v)
            self.vk._auth_token()
        return self.vk

    def get_posts(self, query, start_time=None, end_time=None, count='3', extended=0):
        
        if start_time is not None:
            start_time = int(time.mktime(time.strptime(start_time, '%Y-%m-%d')))
        if end_time is not None:
            end_time = int(time.mktime(time.strptime(end_time, '%Y-%m-%d')))
        if int(count) > 1000:
            raise ValueError("count must be less or equal than 1000") 
        
        query_params = {
            "q": query,
            "start_time": int(start_time) if start_time is not None else start_time,
            "end_time": int(end_time) if start_time is not None else end_time,
            "count": count if int(count) <= 200 else '200',
            "extended": extended,
            "start_from": None
        }
        group_posts = []
        while len(group_posts)<int(count):
            resp = self.vk.method("newsfeed.search", query_params)
            if "next_from" in resp:
                query_params["start_from"] = resp['next_from']
            else:
                print(len(group_posts))
                return group_posts
            for item in resp['items']:
                if str(item['owner_id']).startswith('-') and "parents_stack" not in item:
                    group_posts.append(item)
                    if len(group_posts) == int(count):
                        break
        print(len(group_posts))
        return group_posts
