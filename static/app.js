class BoggleGame {


    constructor(boardId, secs=60) {
        this.showTimer();
        this.secs = secs;

        this.words = new Set();
        this.score = 0;
        this.board = $("#" + boardId);

        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
        this.timer = setInterval(this.tick.bind(this), 1000);
    }    
    showWord(word) {
        $(".words", this.board).append($("<li>", { text: word }));
    }

    showScore() {
        $(".score", this.board).text(this.score);
    }

    showMessage(msg, cls) {
        $(".msg", this.board)
        .text(msg)
        .removeClass()
        .addClass(`msg ${cls}`);
    }

    async handleSubmit(){
        evt.preventDefault();
        const $word = $(".word", this.board);

    let word = $word.val();
    if (!word) return;

    if (this.words.has(word)) {
      this.showMessage(`Already found ${word}`, "err");
      return;
    }

    // check server for validity
    const resp = await axios.get("/check-word", { params: { word: word }});
    if (resp.data.result === "not-word") {
      this.showMessage(`${word} is not a valid English word`, "err");
    } else if (resp.data.result === "not-on-board") {
      this.showMessage(`${word} is not a valid word on this board`, "err");
    } else {
      this.showWord(word);
      this.score += word.length;
      this.showScore();
      this.words.add(word);
      this.showMessage(`Added: ${word}`, "ok");
    }

    $word.val("").focus();

    }

    showTimer() {
        $(".timer", this.board).text(this.secs);
    }

    async tick() {
        this.secs -= 1;
        this.showTimer();
    
        if (this.secs === 0) {
          clearInterval(this.timer);
          await this.scoreGame();
        }
      }

    async scoreGame(){
        $(".add-word", this.board).hide();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.newRecord) {
          this.showMessage(`New record: ${this.score}`, "ok");
        } else {
          this.showMessage(`Final score: ${this.score}`, "ok");
        }
    }
}
