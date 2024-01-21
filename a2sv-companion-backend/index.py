from flask import Flask, request, jsonify, render_template
import requests
from urllib.parse import urlparse
from urllib.parse import parse_qs
import os
from flask_cors import CORS, cross_origin
from utils import column_to_letter

from dotenv import load_dotenv
from datetime import datetime

from google.oauth2.service_account import Credentials
import gspread

import pymongo
import json
import re
from bson import json_util

# load_dotenv('.env')


MAIN_SHEETNAME = os.getenv("MAIN_SHEET_NAME")

# gc = gspread.service_account(filename=os.getenv("GOOGLE_CREDENTIALS"))

scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

credentials = Credentials.from_service_account_info(
    json.loads(os.getenv("GOOGLE_CREDENTIALS")), scopes=scopes
)

gc = gspread.authorize(credentials)

git_client_id = os.getenv("GITHUB_CLIENT_ID")
git_client_secret = os.getenv("GITHUB_CLIENT_SECRET")

mongo_client = pymongo.MongoClient(os.getenv("MONGODB_CONNECTION_STRING"))
db = mongo_client[os.getenv("MONGODB_DB_NAME")]


app = Flask(__name__)
CORS(app, support_credentials=True)


def parse_json(data):
    return json.loads(json_util.dumps(data))

def push_to_sheet(sheetName, cellReference, gitUrl, attempts, timeTaken, timeTakenCell):
    url = (
        f"https://script.google.com/macros/s/{os.getenv('SHEET_APPSCRIPT_DEPLOYMENT')}/exec"
        + f"?sheetName={sheetName}&cellReference={cellReference}&gitUrl={gitUrl}&attempts={attempts}&timeTaken={timeTaken}$timeTakenCell={timeTakenCell}"
    )

    requests.get(url)


@app.route("/api/platform", methods=["GET", "OPTIONS"])
@cross_origin(supports_credentials=True)
def get_platforms():
    platforms = db.Questions.find().distinct("Platform")

    response = {"status": 200, "platforms": platforms}

    return jsonify(response)


@app.route("/api/platform/<platform>/question", methods=["GET", "OPTIONS"])
@cross_origin(supports_credentials=True)
def get_questions(platform):
    questions = [
        parse_json(question)
        for question in db.Questions.find(
            {"Platform": re.compile(platform, re.IGNORECASE)}
        )
    ]

    response = {"status": 200, "questions": questions}

    return jsonify(response)


@app.route("/api", methods=["POST", "OPTIONS"])
@cross_origin(supports_credentials=True)
def api():
    json = request.json

    attribs = [
        "studentName",
        "attempts",
        "timeTaken",
        "gitUrl",
        "questionUrl",
        "platform",
    ]

    for atr in attribs:
        if atr not in json:
            return f"{atr} not found", 400

    # Push to mongodb
    student_collection = db.People
    question_collection = db.Questions

    student = student_collection.find_one({"Name": json["studentName"]})
    question = question_collection.find_one({"URL": json["questionUrl"]})

    if not student:
        return "Student not found", 400

    if not question:
        return "Question not found", 400

    sh = gc.open(MAIN_SHEETNAME)

    interaction = {
        "Column": question["Column"],
        "Group": student["Group"],
        "ID": f"{student['Name']} | {question['Column']}",
        "Sheet": question["Sheet"],
        "Number of Attempts": json["attempts"],
        "Person": student["Name"],
        "Question_fkey": question["ID"],
        "Time Spent": json["timeTaken"],
        "update_timestamp": datetime.now(),
    }

    db.Interactions.insert_one(interaction)

    # Attach to google sheet
    ws = sh.worksheet(question["Sheet"])

    studentNames = ws.col_values(1)

    studentRow = None
    for row, name in enumerate(studentNames):
        if name == student["Name"]:
            studentRow = row + 1
            break
    else:
        return "Student not found on sheet", 400

    questionColumn = column_to_letter(question["Column"])
    timespentColumn = column_to_letter(question["Column"] + 1)

    push_to_sheet(
        question["Sheet"],
        f"{questionColumn}{studentRow}",
        json["gitUrl"],
        json["attempts"],
        json["timeTaken"],
        f"{timespentColumn}{studentRow}",
    )
    return jsonify({"status": "OK"})


@app.route("/authenticate")
def authenticate():
    github_auth_code = request.args.get("code")

    response = requests.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": git_client_id,
            "client_secret": git_client_secret,
            "code": github_auth_code,
        },
    )

    try:
        if response.status_code == 200:
            parsed_response = urlparse(f"?{response.text}")
            access_token = parse_qs(parsed_response.query)["access_token"][0].strip()
            return render_template(
                "index.html",
                access_token=access_token,
                success=True,
                message="Successfully authenticated!",
            )
        else:
            return render_template(
                "index.html",
                access_token=access_token,
                success=False,
                message="Authentication failed!",
            )
    except:
        return render_template(
            "index.html",
            access_token=access_token,
            success=False,
            message="Authentication failed!",
        )


@app.route("/")
def home():
    return jsonify(f"Attached to sheet '{os.getenv('MAIN_SHEET_NAME')}'")


# if __name__ == "__main__":
#     app.run(debug=True)
