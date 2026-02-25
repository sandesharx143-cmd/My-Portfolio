const username = "YOUR_USERNAME";

// Fetch Profile
fetch(`https://api.github.com/users/${username}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("profile-pic").src = data.avatar_url;
  });

// Fetch Repos
fetch(`https://api.github.com/users/${username}/repos`)
  .then(res => res.json())
  .then(repos => {
    const repoList = document.getElementById("repo-list");
    const skills = new Set();

    repos.forEach(repo => {
      if (!repo.fork) {
        // Projects
        const div = document.createElement("div");
        div.innerHTML = `<h3>${repo.name}</h3><p>${repo.description || ""}</p>`;
        repoList.appendChild(div);

        // Skills
        if (repo.language) skills.add(repo.language);
      }
    });

    const skillsList = document.getElementById("skills-list");
    skills.forEach(skill => {
      const li = document.createElement("li");
      li.textContent = skill;
      skillsList.appendChild(li);
    });
  });

// Dashboard switch
function showSection(id) {
  document.querySelectorAll('.content').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

// DNA Background Animation
const canvas = document.getElementById("dna-bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0;

function drawDNA() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < canvas.height; i += 20) {
    let x = canvas.width / 2 + Math.sin(i * 0.05 + t) * 100;
    ctx.beginPath();
    ctx.arc(x, i, 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${(t * 50) % 360}, 100%, 50%)`;
    ctx.fill();
  }

  t += 0.02;
  requestAnimationFrame(drawDNA);
}

drawDNA();