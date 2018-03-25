from flask import Flask
from flask import render_template
from flask import request, redirect, url_for
from flask import send_from_directory
from werkzeug.utils import secure_filename
from datetime import datetime
from PIL import Image, ImageSequence
import os

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = '/tmp/uploads/'
app.config['DOWNLOAD_FOLDER'] = '/tmp/downloads/'

os.mkdir(app.config['UPLOAD_FOLDER'], 0755)
os.mkdir(app.config['UPLOAD_FOLDER'], 0755)

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")

@app.route('/downloads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['DOWNLOAD_FOLDER'],
                               filename)                              

@app.route('/upload/', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['gif']
        f_name = datetime.now().strftime("%Y%m%d%H%M%S-") + secure_filename(f.filename)
        if f_name[-4:] != '.gif':
            return "Error: File type not support."
        f.save(app.config['UPLOAD_FOLDER']+f_name)
        with Image.open(app.config['UPLOAD_FOLDER']+f_name) as im:
            if im.is_animated:
                frames = [f.copy() for f in ImageSequence.Iterator(im)]
                frames.reverse() # 内置列表倒序方法
                # 将倒序后的所有帧图像保存下来
                frames[0].save(os.path.join(app.config['DOWNLOAD_FOLDER'],f_name), save_all=True, append_images=frames[1:])
        return f_name
    return "Error: Not Allowed."

if __name__ == '__main__':
    app.run(debug=True)