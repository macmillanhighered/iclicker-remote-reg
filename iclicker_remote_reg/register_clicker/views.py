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
    addURL = ''
    countryCode = ''
    studentId = ''
    email = ''
    firstName = ''
    lastName = ''
    if('lis_person_contact_email_primary' in request.POST):
        email = request.POST['lis_person_contact_email_primary']
    if('lis_person_name_given' in  request.POST):
        firstName = request.POST['lis_person_name_given']
    if('lis_person_name_family' in  request.POST):
        lastName = request.POST['lis_person_name_family']
    if('custom_domain_url' in request.POST):
        addURL = request.POST['custom_domain_url']
    elif('domain_url' in request.POST):
        addURL = request.POST['domain_url']
    elif('custom_url' in request.POST):
        addURL = request.POST['custom_url']
    elif('url' in request.POST):
        addURL = request.POST['url']
    else:
        print(request.POST)
    if('custom_cc' in request.POST):
        countryCode = request.POST['custom_cc']
    if('custom_canvas_user_id' in request.POST):
        studentId = request.POST['custom_canvas_user_id']
    elif('ext_d2l_username' in request.POST):
        studentId = request.POST['ext_d2l_username']
    else:
        print('student_id not recieved')
        #return HttpResponse('Incomplete information received, please contact support.')
    template = loader.get_template('app-launch.html')
    body_dict = {'student_id':studentId,
    'email_id':email,
    'addUrl':addURL,
    'firstName':firstName,
    'lastName':lastName,
    'countryCode':countryCode}
    context = {'body_dict' : body_dict}
    return HttpResponse(template.render(body_dict))

@csrf_exempt
def searchClickers(request):
    body_dict = json.loads(request.body)
    resp = requests.post(API_ENDPOINT + '/v1/registration/info/clicker/search',json={"authentication" : "Edmbt7x3aGKLNHrL","lastName": None,"studentId": body_dict['student_id'],"email": None,"addURL": body_dict['addURL']})
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
