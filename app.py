from flask import Flask, render_template
import requests

app = Flask(__name__)
GITHUB_USER = "sandesharx143"

@app.context_processor
def inject_user():
    return dict(GITHUB_USER=GITHUB_USER)

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
    repos = fetch_github_repos()
    
    # Calculate GitHub stats
    total_stars = sum(r.get("stargazers_count", 0) for r in repos)
    
    # Biometric "Fake" Stats for Atmosphere
    import random
    bio_stats = {
        "neural_sync": random.randint(85, 99),
        "genetic_integrity": "99.2%",
        "uptime": "100%",
        "evolution_level": "V3.2"
    }
            
    return render_template("index.html", 
                           user=user_data, 
                           total_stars=total_stars,
                           bio_stats=bio_stats)

@app.route("/about")
def about():
    user_data = fetch_github_user()
    return render_template("about.html", user=user_data)

@app.route("/projects")
def projects():
    repos = fetch_github_repos()
    own_projects = [r for r in repos if not r.get("fork")]
    collab_projects = [r for r in repos if r.get("fork")]
    return render_template("projects.html", 
                           own_projects=own_projects, 
                           collab_projects=collab_projects)

@app.route("/skills")
def skills():
    repos = fetch_github_repos()
    
    # 1. Automated Skills (Languages)
    skills_map = {}
    for r in repos:
        lang = r.get("language")
        if lang:
            skills_map[lang] = skills_map.get(lang, 0) + 1
    
    sorted_github_skills = sorted(skills_map.items(), key=lambda x: x[1], reverse=True)
    
    # 2. Manual "Neural" Skills (Bio-themed)
    neural_skills = [
        {"name": "Neural Architecture", "level": 95, "desc": "Full-stack synthesis and system design."},
        {"name": "DNA Sequencing", "level": 88, "desc": "Advanced data analysis and pattern recognition."},
        {"name": "Synthetic UI", "level": 92, "desc": "Crafting high-fidelity digital interfaces."},
        {"name": "Cognitive Logic", "level": 90, "desc": "Algorithmic thinking and problem solving."}
    ]
    
    return render_template("skills.html", 
                           github_skills=sorted_github_skills, 
                           neural_skills=neural_skills)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
