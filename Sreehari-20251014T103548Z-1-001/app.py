from flask import Flask, render_template, request, redirect
import sqlite3
import os

app = Flask(__name__)

# Initialize the database if it doesn't exist
def init_db():
    if not os.path.exists('feedback.db'):
        conn = sqlite3.connect('feedback.db')
        c = conn.cursor()
        c.execute('''
            CREATE TABLE feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()

# Home route (optional)
@app.route('/')
def home():
    return redirect("/feedback")

# Feedback form route
@app.route('/feedback')
def feedback():
    return render_template('feedback.html')

# Handle feedback submission
@app.route('/submit-feedback', methods=['POST'])
def submit_feedback():
    feedback = request.form.get('feedback', '').strip()

    if feedback:
        conn = sqlite3.connect('feedback.db')
        c = conn.cursor()
        c.execute('INSERT INTO feedback (message) VALUES (?)', (feedback,))
        conn.commit()
        conn.close()
        return '''
            <script>alert("Thank you! Your feedback has been submitted."); window.location.href="/feedback";</script>
        '''
    else:
        return '''
            <script>alert("Please enter some feedback."); window.history.back();</script>
        '''

# Admin route to view all feedback
@app.route('/view-feedback')
def view_feedback():
    conn = sqlite3.connect('feedback.db')
    c = conn.cursor()
    c.execute('SELECT * FROM feedback')
    entries = c.fetchall()
    conn.close()

    html = "<h2>Submitted Feedback</h2><ul>"
    for entry in entries:
        html += f"<li>{entry[1]}</li>"
    html += "</ul><a href='/feedback'>← Back</a>"
    return html

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
