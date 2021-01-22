from app import app

from flask import render_template, request, redirect, send_from_directory, abort, current_app
from werkzeug.utils import secure_filename
import pandas as pd

import os

from . import horseFiltering as fdb

@app.route("/api")
def index():
    return {
        "name": "Hello world!"
    }
    # return render_template("public/index.html")

# if uploads dir does not exist, create upload dir
if (os.path.isfile(os.getcwd() + "/app/uploads/") is False):
    os.mkdir(os.getcwd() + "/app/uploads/")

# use os.getcwd() to get the current directory
app.config["FILE_UPLOADS"] = os.getcwd() + "/app/uploads/"

# allowed file type
app.config["ALLOWED_FILE_EXTENSION"] = ["CSV"]

def allowed_file(filename):
    if not "." in filename:
        return False

    # extension, split from the right
    ext = filename.rsplit(".", 1)[1]

    if ext.upper() in app.config["ALLOWED_FILE_EXTENSION"]:
        return True
    else:
        return False

# api for uploading file
@app.route("/api/upload-file", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        if request.files:
            file = request.files["myfile"]

            parameters = []
            for _, val in request.form.items():
                parameters.append(val)

            print(parameters)

            if file.filename == "":
                print("File must have a name")

            elif not allowed_file(file.filename):
                print("Invalid file type")
            
            else:
                # secure file name
                filename = secure_filename(file.filename)

                # save file to the uploads directory in the server
                file.save(os.path.join(app.config["FILE_UPLOADS"], filename))
                print("File saved")

                # created the output file name
                newFilename = filename.rsplit(".", 1)[0] + "_parsed.csv"

                # run the parse function to generate the new file stored in uploads/ 
                # loop through parameters with i+3 to call nonCLI

                df1 = fdb.createTable(app.config["FILE_UPLOADS"] + filename)

                print(len(parameters))

                j = 0
                while j < len(parameters):
                    field = parameters[j]
                    operator = parameters[j+1]
                    value = parameters[j+2]

                    df1 = fdb.filterTable(df1, field, operator, value)

                    j+=3

                fdb.exportTable(df1, app.config["FILE_UPLOADS"] + newFilename)

                return {
                    "success" : True,
                    "status": "file parsed successfully",
                    "file": newFilename,
                }
        else:
            print("no file")
    # return the html with passed in statusMessage
    return {
        "success" : False,
        "status": "no a post request",
        "file": "",
    }


@app.route("/api/download-file/<filename>")
def download_file(filename):
    try:
        print(filename)
        file_path = app.config["FILE_UPLOADS"] + filename

        def generate():
            # stream the file
            with open(file_path) as f:
                yield from f

            # delete all files in the uploads dir
            file_list = [f for f in os.listdir(app.config["FILE_UPLOADS"])]
            for f in file_list:
                os.remove(app.config["FILE_UPLOADS"] + f)


        # server the file throufh stream
        r = current_app.response_class(generate(), mimetype='text/csv')
        r.headers.set('Content-Disposition', 'attachment', filename=filename)
        return r


        # other way
        # use send_from_directory with parameters: (directory, filename)
        # return send_from_directory(app.config["FILE_UPLOADS"], filename=filename)
    except FileNotFoundError:
        abort(404)


@app.route("/api/files/<filename>")
def retrieve_file(filename):
    # convert csv to html
    csvfile = pd.read_csv(app.config["FILE_UPLOADS"] + filename)
    csvfile.to_html()

    # created the output file name
    newFilename = filename.rsplit(".", 1)[0] + ".html"

    # create and open new file 
    f = open(app.config["FILE_UPLOADS"] + newFilename, "w")

    # convert csvfile dataframe to html string and write to the file
    f.write(csvfile.to_html())

    # return the file
    return send_from_directory("uploads", newFilename)