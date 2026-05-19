
const firebaseConfig = {
    apiKey: "AIzaSyCojU6w1nL9ogwpCXi46Os5nrWhGafY_L4",
    authDomain: "momea-9997c.firebaseapp.com",
    projectId: "momea-9997c",
    storageBucket: "momea-9997c.firebasestorage.app",
    messagingSenderId: "364790876623",
    appId: "1:364790876623:web:cc6fecea62ea4ccca76aba",
    measurementId: "G-892VNMTF1W"
};


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const dashboardProjectsList = document.getElementById('dashboard-projects-list');


function loadDashboardProjects() {
    db.collection("projects").get().then((querySnapshot) => {
        if (dashboardProjectsList) {
            dashboardProjectsList.innerHTML = "";
        }

        if (querySnapshot.empty) {
            dashboardProjectsList.innerHTML = `<p style="color: #888; font-size: 14px;">No projects found. Add one above!</p>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const project = doc.data();
            const projectId = doc.id; 
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #1a1e29;
                padding: 12px 20px;
                border-radius: 8px;
                border: 1px solid #2d3548;
            `;

            item.innerHTML = `
                <div>
                    <strong style="color: #00ffcc; display: block;">${project.title || 'Untitled'}</strong>
                    <span style="color: #888; font-size: 12px;">${project.tech_stack || 'No Stack'}</span>
                </div>
                <button onclick="deleteProjectFromDashboard('${projectId}')" style="background: #ff0055; color: #fff; border: none; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            `;
            dashboardProjectsList.appendChild(item);
        });
    }).catch((error) => {
        console.error("Error loading dashboard projects: ", error);
    });
}


window.deleteProjectFromDashboard = function(projectId) {
    if (confirm("هل أنت متأكد تماماً إنك عايز تمسح المشروع ده يا موميا؟ 🗑️")) {
        db.collection("projects").doc(projectId).delete().then(() => {
            alert("تم حذف المشروع بنجاح من الفايربيز! 👍");
            loadDashboardProjects(); 
        }).catch((error) => {
            console.error("Error removing document: ", error);
            alert("حصلت مشكلة أثناء الحذف، جرب تاني.");
        });
    }
}


document.addEventListener('DOMContentLoaded', loadDashboardProjects);