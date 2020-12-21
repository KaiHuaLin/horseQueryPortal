from app import app

from flask import render_template, request, redirect, send_from_directory, abort, current_app
from werkzeug.utils import secure_filename

import os

from . import multiplecsvinput

@app.route("/")
def index():
    return render_template("public/index.html")

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
@app.route("/upload-file", methods=["GET", "POST"])
def upload_file():

    # status that will pass to html
    status=""
    if request.method == "POST":
        if request.files:
            file = request.files["file"]

            if file.filename == "":
                print("File must have a name")
                status="No file name"

            elif not allowed_file(file.filename):
                print("Invalid file type")
                status="Invalid file type"
            
            else:
                # secure file name
                filename = secure_filename(file.filename)

                # save file to the uploads directory in the server
                file.save(os.path.join(app.config["FILE_UPLOADS"], filename))
                print("File saved")
                status="File uploaded successfully"

                # created the output file name
                newFilename = filename.rsplit(".", 1)[0] + "_parsed.csv"


                if(request.form["query"] == "first"):
                    print("it is first q")
                    multiplecsvinput.nonCLI1(app.config["FILE_UPLOADS"] + filename, app.config["FILE_UPLOADS"] + newFilename)
                

                if(request.form["query"] == "second"):
                    print("it is second q")
                    multiplecsvinput.nonCLI2(app.config["FILE_UPLOADS"] + filename, app.config["FILE_UPLOADS"] + newFilename)


                # run the parse function to generate the new file stored in uploads/ 
                # horseDBpython.nonCLI(app.config["FILE_UPLOADS"] + filename, app.config["FILE_UPLOADS"] + newFilename)

                return render_template("/public/download_file.html", filename = newFilename)

    # return the html with passed in statusMessage
    return render_template("/public/upload_file.html", statusMessage=status)


@app.route("/get-file/<filename>")
def download_file(filename):
    try:

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