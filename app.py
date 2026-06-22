from flask import Flask, jsonify, render_template
import feedparser

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/notes")
def get_notes():
    feed = feedparser.parse(FEED_URL)
    entries = []
    for entry in feed.entries:
        entries.append({
            "title": entry.get("title", ""),
            "link": entry.get("link", ""),
            "published": entry.get("published", ""),
            "summary": entry.get("summary", ""),
            "content": entry.get("content", [{"value": ""}])[0]["value"] if "content" in entry else ""
        })
    return jsonify(entries)

if __name__ == "__main__":
    app.run(debug=True, port=8080)
