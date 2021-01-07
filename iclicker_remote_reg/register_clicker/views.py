from django.http import HttpResponse,\
                        HttpResponseRedirect,\
                        HttpResponseServerError,\
                        Http404,\
                        HttpResponseNotFound, \
                        HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import requests
from django.template import Context, loader
import json
from django.views.decorators.clickjacking import xframe_options_exempt
from django.conf import settings
API_ENDPOINT = settings.API_ENDPOINT

@xframe_options_exempt
@csrf_exempt
def landingHomePage(request):
    if(request.method == 'POST'):
        addURL = ''
        countryCode = ''
        if('custom_domain_url' in request.POST):
            addURL = request.POST['custom_domain_url']
        elif('domain_url' in request.POST):
            addURL = request.POST['domain_url']
        elif('custom_url' in request.POST):
            addURL = request.POST['custom_url']
        else:
            print(request.POST)
        if('custom_cc' in request.POST):
            countryCode = request.POST['custom_cc']
        template = loader.get_template('app-launch.html')
        body_dict = {'student_id':request.POST['user_id'],
        'email_id':request.POST['lis_person_contact_email_primary'],
        'addUrl':request.POST['custom_domain_url'],
        'firstName':request.POST['lis_person_name_given'],
        'lastName':request.POST['lis_person_name_family'],
        'countryCode':countryCode}
        context = {'body_dict' : body_dict}
        return HttpResponse(template.render(body_dict))
    return HttpResponse('get request not allowed')

@csrf_exempt
def searchClickers(request):
    body_dict = json.loads(request.body)
    resp = requests.post(API_ENDPOINT + '/v1/registration/info/clicker/search',json={"authentication" : "Edmbt7x3aGKLNHrL","lastName": None,"studentId": body_dict['student_id'],"email": body_dict['email_id'],"addURL": body_dict['addURL']})
    return HttpResponse(resp)

@csrf_exempt
def removeClicker(request):
    body_dict = json.loads(request.body)
    resp = requests.post(API_ENDPOINT + '/v1/registration/info/clicker/disable',json={"authentication" : "nT5b8nLny2mwksbb","clickerId": body_dict['clickerId'],"studentId": body_dict['student_id'],"email": body_dict['email_id'],"addURL": body_dict['addURL']})
    print(resp)
    for i in resp.json():
        print(i)
    return HttpResponse(resp)

@csrf_exempt
def getCountryList(request):
    resp = requests.get(API_ENDPOINT + '/v1/registration/information/countrymaster')
    return HttpResponse(resp)


@csrf_exempt
def addClicker(request):
    body_dict = json.loads(request.body)
    print(body_dict)
    resp = requests.put(API_ENDPOINT + '/v1/registration/info/clicker/insert',json={"authentication" : "L8x7ZYTD6Me4nbsD","lastName": body_dict['lastName'],"studentId": body_dict['studentId'],"email": body_dict['email'],"addURL": body_dict['addURL'], "disableFlag" : False,"countryCode":body_dict['countryCode'],"firstName":body_dict['firstName'],"clickerId":body_dict['clickerId']})
    print(resp)
    for i in resp.json():
        print(i)
    return HttpResponse(resp)


@csrf_exempt
def doesClickerExist(request):
    body_dict = json.loads(request.body)
    resp = requests.post(API_ENDPOINT + '/v1/registration/search/clicker',json={"authentication" : "L8x7ZYTD6Me4nbsD","lastName": body_dict['lastName'],"studentId": body_dict['studentId'],"email": body_dict['email'],"addURL": body_dict['addURL'], "disableFlag" : False,"countryCode":body_dict['countryCode'],"firstName":body_dict['firstName'],"clickerId":body_dict['clickerId']})
    print(resp)
    for i in resp.json():
        print(i)
    return HttpResponse(resp)

@csrf_exempt
def updateClicker(request):
    body_dict = json.loads(request.body)
    resp = requests.post(API_ENDPOINT + '/v1/registration/info/clicker/update',json={"authentication" : "L8x7ZYTD6Me4nbsD","lastName": body_dict['lastName'],"studentId": body_dict['studentId'],"email": body_dict['email'],"addURL": body_dict['addURL'], "disableFlag" : False,"countryCode":body_dict['countryCode'],"firstName":body_dict['firstName'],"clickerId":body_dict['clickerId'],"id":body_dict['id']})
    print(resp)
    for i in resp.json():
        print(i)
    return HttpResponse(resp)


def ping(request):
   return HttpResponse({"msg": "Hello world"})
