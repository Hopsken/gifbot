from flask import Flask
from flask import render_template
from flask import request
from flask import send_from_directory
from werkzeug.utils import secure_filename

UPLOADF_FOLDER = '/var/www/uploads/'
DOWNLOAD_FOLDER = '/var/www/downloads/'

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        f = request.files['the_file']
        f.save(app.config['UPLOADF_FOLDER'] + secure_filename(f.filename))
    return render_template("index.html", name="hello")

@app.route('/downloads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['DOWNLOAD_FOLDER'],
                               filename)

if __name__ == '__main__':
    app.run(debug=True)