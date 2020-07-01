from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

from .vk_bot import Bot
from PostParser import settings
from datetime import datetime

import logging
import urllib.request
import os


logging.basicConfig(filename = u'mylog.log')

class PostList(APIView):
    def get(self, request):
        bot = Bot(settings.token, settings.v)
        bot.auth()
        q = request.GET.get("q", "")
        count = request.GET.get("count", 3)
        start_time = request.GET.get("start_time", None)
        end_time = request.GET.get("end_time", None)
        extended = request.GET.get("extended", 0)
        # if start_time != None:
        #     start_time = datetime.strptime(start_time, "%d.%m.%Y")
        # if end_time != None:
        #     start_time = datetime.strptime(start_time, "%d.%m.%Y")
        # if start_time < end_time:
            # return Response(data={"status": "date_error", "desc": "s_time<e_time"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            posts = bot.get_posts(q, start_time, end_time, count, extended)
        except Exception as e:
            raise
            return Response(data={"status": "vk_error", "desc": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(data=posts, status=status.HTTP_200_OK)    

class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """
    def get(self, request):
        logging.exception(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                logging.exception("it's open")
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead, or
                run `yarn run build` to test the production version.
                """,
                status=501,
            )   
