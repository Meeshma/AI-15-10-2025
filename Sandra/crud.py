from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_event(db: Session, event: schemas.EventCreate, user_id: int):
    db_event = models.Event(**event.dict(), owner_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_events(db: Session, user_id: int):
    return db.query(models.Event).filter(models.Event.owner_id == user_id).all()
from flask import Flask, render_template, request, jsonify
import datetime

app = Flask(__name__)

# Serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')  # Make sure your HTML file is named 'index.html' and placed in a templates folder

# Handle form submission
@app.route('/submit-event', methods=['POST'])
def submit_event():
    try:
        # Retrieve data from the form
        event_name = request.form['eventName']
        event_type = request.form['eventType']
        event_date = request.form['eventDate']
        event_time = request.form['eventTime']
        end_time = request.form.get('endTime', '')
        time_zone = request.form.get('timeZone', 'UTC-5')
        location = request.form['location']
        city = request.form['city']
        capacity = request.form.get('capacity', '')
        description = request.form['description']

        # Validate time
        start_time = datetime.datetime.strptime(event_time, '%H:%M')
        if end_time:
            end_time = datetime.datetime.strptime(end_time, '%H:%M')
            if end_time <= start_time:
                return jsonify({"error": "End time must be after start time"}), 400

        # Optional: You can add your database saving logic here
        # For now, we're just returning the event data back

        # If everything is valid, return a success message
        return jsonify({
            "message": "Event created successfully!",
            "eventData": {
                "name": event_name,
                "type": event_type,
                "date": event_date,
                "startTime": event_time,
                "endTime": end_time if end_time else "N/A",
                "timeZone": time_zone,
                "location": location,
                "city": city,
                "capacity": capacity,
                "description": description
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
