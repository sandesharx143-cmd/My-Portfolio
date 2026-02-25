from flask import Flask, render_template
import requests

app = Flask(__name__)
GITHUB_USER = "sandesharx143"

def fetch_github_user():
    response = requests.get(f"https://api.github.com/users/{GITHUB_USER}")
    if response.status_code == 200:
        return response.json()
    return {}

def fetch_github_repos():
    response = requests.get(f"https://api.github.com/users/{GITHUB_USER}/repos?sort=updated&per_page=100")
    if response.status_code == 200:
        return response.json()
    return []

@app.route("/")
def index():
    user_data = fetch_github_user()
    return render_template("index.html", user=user_data)

@app.route("/projects")
def projects():
    repos = fetch_github_repos()
    # Filter for non-forked repos (own projects)
    own_projects = [r for r in repos if not r.get("fork")]
    return render_template("projects.html", projects=own_projects)

@app.route("/collaborations")
def collaborations():
    repos = fetch_github_repos()
    # Filter for forked repos (collaborations/contributions)
    collab_projects = [r for r in repos if r.get("fork")]
    return render_template("collaborations.html", projects=collab_projects)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
