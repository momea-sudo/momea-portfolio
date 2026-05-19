
const firebaseConfig = {
    apiKey: "AIzaSyCojU6w1nL9ogwpCXi46Os5nrWhGafY_L4",
    authDomain: "momea-9997c.firebaseapp.com",
    projectId: "momea-9997c",
    storageBucket: "momea-9997c.firebasestorage.app",
    messagingSenderId: "364790876623",
    appId: "1:364790876623:web:cc6fecea62ea4ccca76aba",
    measurementId: "G-892VNMTF1W"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


const projectsGrid = document.getElementById('firebase-projects-grid');

function loadProjects() {

    db.collection("projects").get().then((querySnapshot) => {
        if (projectsGrid) {
            projectsGrid.innerHTML = ""; 
        }
        
        if (querySnapshot.empty) {
            projectsGrid.innerHTML = `
                <div class="no-projects">
                    <p>Building something awesome... New projects coming soon!</p>
                </div>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const project = doc.data();
            const projectCard = document.createElement('div');
            projectCard.className = "project-card";
            projectCard.setAttribute("data-aos", "fade-up");

            let urlHTML = project.project_url ? `<a href="${project.project_url}" class="project-link" target="_blank">Live Demo &rarr;</a>` : '';

            projectCard.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <span class="tech-tag">${project.tech_stack}</span>
                ${urlHTML}
            `;
            projectsGrid.appendChild(projectCard);
        });

        
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll(".project-card, .skill-card"), {
                max: 10,            
                speed: 500,         
                glare: true,       
                "max-glare": 0.15,  
                gyroscope: true     
            });
        }

    }).catch((error) => {
        console.error("Error loading projects: ", error);
        if (projectsGrid) {
            projectsGrid.innerHTML = `<p style="color: #ff0055; text-align: center;">Failed to load projects.</p>`;
        }
    });
}


loadProjects();


document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const responseDiv = document.getElementById('formResponse');

    const submitBtn = this.querySelector('button');
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    
    db.collection("messages").add({
        name: name,
        email: email,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
       
        const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1505346191846805514/XZp4i0Mdgr37g6HbO9Wlzz7bCeXZDfkORzek_etxuEwTY5O0Wq2aOxR8AUBThV75RVSf';
        
        const discordMessage = {
            "content": "📩 **New Message from MoMea.Dev (Static Web)!**",
            "embeds": [{
                "title": `👤 Name: ${name}`,
                "color": 5814783,
                "fields": [
                    {"name": "📧 Email", "value": email, "inline": true},
                    {"name": "💬 Message", "value": message, "inline": false}
                ]
            }]
        };

        return fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordMessage)
        });
    })
    .then(() => {
        responseDiv.style.color = '#00ffcc';
        responseDiv.innerText = 'Your message has been sent successfully!';
        document.getElementById('contactForm').reset();
    })
    .catch(error => {
        console.error("Error sending message: ", error);
        responseDiv.style.color = '#ff0055';
        responseDiv.innerText = 'Something went wrong. Please try again.';
    })
    .finally(() => {
        submitBtn.innerText = 'Send Message';
        submitBtn.disabled = false;
    });
});


const themeToggleBtn = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'inline-block';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    
    if (document.body.classList.contains('light-theme')) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'inline-block';
        localStorage.setItem('theme', 'light');
    } else {
        sunIcon.style.display = 'inline-block';
        moonIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
    }
});


AOS.init({
    duration: 800,     
    once: true,        
});


if (document.getElementById('typed-text')) {
    new Typed('#typed-text', {
        strings: [
            'Automation & Scripts.', 
            'Backend Solutions.', 
            'Full-Stack Development.'
        ],
        typeSpeed: 60,      
        backSpeed: 40,      
        backDelay: 1500,    
        loop: true,         
        showCursor: true,
        cursorChar: '_'    
    });
}