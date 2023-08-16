from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension
from flask import Flask, render_template, request, session, jsonify

boggle_game = Boggle()
app = Flask(__name__)
app.config["SECRET_KEY"] = "bananasinpajamas"

debug = DebugToolbarExtension(app)

@app.route("/")
def index():
    """Show homepage"""
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get("highscore", 0)
    numplays = session.get("numplays", 0)

    return render_template("index.html", board=board,highscore=highscore,numplays=numplays)

@app.route("/check-word")
def check_word():
    """Receives a word as a param & checks if word is valid using the boggle_game.check_valid_word() method"""
    word = request.args["word"]
    board = session["board"]
    """Retrieves Boggle board from the user's session"""
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

@app.route("/post-score", methods=["POST"])
def post_score():
    """Posts player's score & updates session data w/new score"""
    score = request.json["score"]
    numplays = session.get("numplays", 0)
    highscore = session.get("highscore", 0)
    session['highscore'] = max(score, highscore)
    session['numplays'] = numplays + 1

    return jsonify(newRecord=score > highscore)