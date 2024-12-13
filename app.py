from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app)

# Home route
@app.route('/')
def index():
    return render_template('index.html')

# Dashboard route
@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

# Profile route
@app.route('/profile')
def profile():
    return render_template('profile.html')

# Register route
@app.route('/register')
def register():
    return render_template('register.html')

# Library route
@app.route('/library')
def library():
    return render_template('library.html')

# Messaging route
@app.route('/messaging')
def messaging():
    return render_template('messaging.html')

# Notifications route
@app.route('/notifications')
def notifications():
    return render_template('notifications.html')

# SocketIO Events
@socketio.on('connect')
def handle_connect():
    print("User connected")
    emit('notification', {'message': 'Welcome to the app!', 'type': 'info'})

@socketio.on('join')
def handle_join(data):
    room = data['room']
    join_room(room)
    print(f'Joined room: {room}')

@socketio.on('leave')
def handle_leave(data):
    room = data['room']
    leave_room(room)
    print(f'Left room: {room}')

@socketio.on('chat_message')
def handle_chat_message(data):
    emit('chat_message', data)

@socketio.on('group_message')
def handle_group_message(data):
    emit('group_message', data)

if __name__ == '__main__':
    socketio.run(app, port = 5001)

