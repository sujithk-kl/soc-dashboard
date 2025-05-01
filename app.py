from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route("/")
def home():
    # For now, show static data
    data = pd.DataFrame([
        {"timestamp": "2025-05-01 10:00:00", "event": "Login Success", "severity": "Info"},
        {"timestamp": "2025-05-01 10:05:00", "event": "Failed Login Attempt", "severity": "Warning"},
        {"timestamp": "2025-05-01 10:10:00", "event": "Admin Account Created", "severity": "Critical"}
    ])
    return data.to_html(classes="table table-bordered")

if __name__ == "__main__":
    app.run(debug=True)
