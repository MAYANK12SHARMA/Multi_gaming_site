
from django.shortcuts import render, redirect , HttpResponse , HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib import messages
from .models import Profile
import uuid
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from .helpers import send_forget_email
from django.contrib.auth import logout
import os 
from django.http import FileResponse 

# from django.http import StreamingHttpResponse
# from wsgiref.util import FileWrapper
# import os
# import mimetypes



# Create your views here.
#?  ------------------------------- index ------------------------------- ?#
 
def index(request):
    return render(request, 'index.html')

#? ------------------------------- Developers ------------------------------- ?# 

def mayank(request):
    return render(request, 'developer/mayank.html')

def jatin(request):
    return render(request, 'developer/jatin.html')

def arjun(request):
    return render(request, 'developer/arjun.html')

def garvit(request):
    return render(request, 'developer/garvit.html')

def parth(request):
    return render(request, 'developer/parth.html')


def vaishvik(request):
    return render(request, 'developer/vaishvik.html')


#? ------------------------------- Services ------------------------------- ?# 


def join_us(request):
    
    return render(request, 'services/join_us.html')

def contact_us(request):
    try:
        if request.method == 'POST':
            name = request.POST.get('name')
            email = request.POST.get('email')
            subject = request.POST.get('subject')
            message = request.POST.get('message')
            
            data = {
                'name': name,
                'email': email,
                'subject': subject,
                'message': message
            }
            
            email_message = f'''
            New message: 
            
            From: {data['email']}
            Name: {data['name']}
            Subject: {data['subject']}
            
            Message:
            {data['message']}
            '''        
            
            # Send email
            send_mail(data['subject'], message, '', ['sharmaji8991mayank@gmail.com'])
            
            # Display success message if email is sent successfully
            messages.success(request, 'Your message has been sent successfully.')
            
        # Render the contact_us page
        return render(request, 'services/contact_us.html')
    
    except Exception as e:
        # If there is an error, print the error and redirect to an error page
        print(e)
        messages.error(request, 'An error occurred. Please try again later.')
        return redirect('error_page')


#? ------------------------------- Error  ------------------------------- ?# 

def error_page(request):
    return render(request, 'authrization/error.html')

 
#? ------------------------------- Registration ------------------------------- ?#

def login_attempt(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        user = User.objects.filter(username=username).first()
        
        if user is None:
            messages.error(request, 'User not found.')
            return redirect('login_attempt')
        
        profile_obj = Profile.objects.filter(user=user).first()
        
        if profile_obj is not None and profile_obj.isverified:
            if user.check_password(password):
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                messages.success(request, 'Login successful.')
                return redirect('/')
            else:
                messages.error(request, 'Password is incorrect.')
                return redirect('login_attempt')
        
        user = authenticate(username=username, password=password)
        if user is None:
            messages.error(request, 'Password is incorrect.')
            return redirect('login_attempt')
        
        login(request, user,backend='django.contrib.auth.backends.ModelBackend')
        messages.success(request, 'Login successful.')
        return redirect('/')
        
    return render(request, 'authrization/login.html')


def register_attempt(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username is already taken.')
            return redirect('register_attempt')

        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email is already taken.')
            return redirect('register_attempt')

        try:
            user_obj = User.objects.create_user(username=username, email=email, password=password)
            profile_obj = Profile.objects.create(user=user_obj, auth_token=str(uuid.uuid4()), isverified=False)

            send_mail_after_registration(email, profile_obj.auth_token)

            messages.success(request, 'Registration successful. Please check your email to verify your account.')
        except Exception as e:
            print(e)
            messages.error(request, 'An error occurred during registration.')
            return redirect('register_attempt')

    return render(request, 'authrization/register.html')


def send_mail_after_registration(email, token):
    subject = 'Your account needs to be verified'
    message = f'Hi, please use the following link to verify your account: http://127.0.0.1:8000/authrization/verify/{token}'
    
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)


def verify(request, auth_token):
    try:
        profile_obj = Profile.objects.filter(auth_token=auth_token).first()

        if profile_obj:
            if profile_obj.isverified:
                messages.success(request, 'Your account is already verified.')
                return redirect('login_attempt')
            profile_obj.isverified = True
            profile_obj.save()
            messages.success(request, 'Your account has been verified.')
            return redirect('login_attempt')
        else:
            return redirect('error_page')
    except Exception as e:
        print(e)
        return redirect('error_page')


def logout_attempt(request):
    print(f'Login out {request.user}')
    messages.success(request, 'Logout successful.')
    logout(request)
    print(request.user)
    return HttpResponseRedirect('/')

#? ------------------------------- Forget Password -------------------------------------------------- ?# 

def forget_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        profile_obj = Profile.objects.filter(user__email=email).first()
        if profile_obj:
            token = str(uuid.uuid4())
            profile_obj.auth_token = token
            profile_obj.save()
            send_forget_email(email, token)  # Send email with reset link
            messages.success(request, 'Password reset link has been sent to your email.')
            return redirect('forget_password')
        else:
            messages.error(request, 'No user found with that email address.')
    
    return render(request, 'authrization/forget_password.html')
   

def change_password(request, auth_token):
    try:
        profile_obj = Profile.objects.filter(auth_token=auth_token).first()
        if profile_obj:
            if request.method == 'POST':
                password = request.POST.get('password')
                profile_obj.user.set_password(password)
                profile_obj.user.save()
                messages.success(request, 'Password reset successful. You can now log in with your new password.')
                return redirect('login_attempt')
            else:
                return render(request, 'authrization/change_password.html')
        else:
            messages.error(request, 'Invalid token. Please try again.')
            return redirect('error_page')
    except Exception as e:
        print(e)
        messages.error(request, 'An error occurred. Please try again.')
    
    return redirect('error_page')


#? ------------------------------- Games Dashboard ------------------------------- ?#

@login_required(login_url='/authrization/login/')
def allgames(request):
    return render(request, 'Games/allgames.html') 

@login_required(login_url='/authrization/login/')
def Brick_breaker(request):
    return render(request, 'Games/Brick_breaker.html')


@login_required(login_url='/authrization/login/')
def Car_racing(request):
    return render(request, 'Games/Car_racing.html')

@login_required(login_url='/authrization/login/')
def Flappy_Bird(request):
    return render(request, 'Games/Flappy_Bird.html')

@login_required(login_url='/authrization/login/')
def Go_ace(request):
    return render(request, 'Games/Go_ace.html')

@login_required(login_url='/authrization/login/')
def Maze_solver(request):
    return render(request, 'Games/Maze_solver.html')

@login_required(login_url='/authrization/login/')
def Snake_game(request):
    return render(request, 'Games/Snake_game.html')

@login_required(login_url='/authrization/login/')
def Space_invaders(request):
    return render(request, 'Games/Space_invaders.html')

@login_required(login_url='/authrization/login/')
def Sprite_flight(request):
    return render(request, 'Games/Sprite_flight.html')

@login_required(login_url='/authrization/login/')
def Tic_Tac_toe(request):
    return render(request, 'Games/Tic_Tac_toe.html')

@login_required(login_url='/authrization/login/')
def Wach_a_mole(request):
    return render(request, 'Games/Wach_a_mole.html')


#? ------------------------------- Games play window   ------------------------------- ?# 

@login_required(login_url='/authrization/login/')
def ACE(request):
    return render(request, 'GAME/ACE.html')

@login_required(login_url='/authrization/login/')
def brick(request):
    return render(request, 'GAME/brick.html')

@login_required(login_url='/authrization/login/')
def flappy_bird(request):
    return render(request, 'GAME/flappy_bird.html')

@login_required(login_url='/authrization/login/')
def maze(request):
    return render(request, 'GAME/maze.html')

@login_required(login_url='/authrization/login/')
def snake(request):
    return render(request, 'GAME/snake.html')

@login_required(login_url='/authrization/login/')
def Sprite_main(request):
    return render(request, 'GAME/Sprite_main.html')

@login_required(login_url='/authrization/login/')
def TicTacToe_main(request):
    return render(request, 'GAME/TicTacToe_main.html')

@login_required(login_url='/authrization/login/')
def whac_a_mole(request):
    return render(request, 'GAME/whac-a-mole.html')

@login_required(login_url='/authrization/login/')
def Sprite1(request):
    return render(request, 'GAME/Sprite1.html')


@login_required(login_url='/authrization/login/')
def TicTacToe1(request):
    return render(request, 'GAME/TicTacToe1.html')


#? ------------------------------- Games Download ------------------------------- ?#
from django.http import FileResponse, HttpResponse
from django.conf import settings
import os

from django.http import HttpResponse
from django.conf import settings
import os

@login_required(login_url='/authrization/login/')
def download(request, filename):
    filepath = os.path.join(settings.BASE_DIR, 'download_games', filename)
    
    if os.path.exists(filepath):
        try:
            with open(filepath, 'rb') as fileopen:
                response = HttpResponse(fileopen.read(), content_type='application/octet-stream')
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                return response
        except Exception as e:
            return HttpResponse(f"Error: {e}")
    else:
        return HttpResponse("File not found", status=404)

    
@login_required(login_url='/authrization/login/')
def brickbreaker_download(request):
    return download(request, 'brickbreaker.pdf')

@login_required(login_url='/authrization/login/')
def flappybird_download(request):
    return download(request, 'flappybird.pdf')

@login_required(login_url='/authrization/login/')
def goace_download(request):
    return download(request, 'goace.pdf')

@login_required(login_url='/authrization/login/')
def mazesolver_download(request):
    return download(request, 'mazesolver.pdf')

@login_required(login_url='/authrization/login/')
def snakegame_download(request):
    return download(request, 'snakegame.pdf')

@login_required(login_url='/authrization/login/')
def spriteflight_download(request):
    return download(request, 'spriteflight.pdf')

@login_required(login_url='/authrization/login/')
def tictactoe_download(request):
    return download(request, 'tictactoe.pdf')

@login_required(login_url='/authrization/login/')
def whacamole_download(request):
    return download(request, 'whacamole.pdf')

@login_required(login_url='/authrization/login/')
def spaceinvader_download(request):
    return download(request, 'spaceinvader.pdf')

@login_required(login_url='/authrization/login/')
def carracing_download(request):
    return download(request, 'carracing.pdf')

@login_required(login_url='/authrization/login/')
def Faq(request):
    return download(request, 'faq.pdf')

