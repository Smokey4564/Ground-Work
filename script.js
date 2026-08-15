// Initial State Architecture
let state = JSON.parse(localStorage.getItem('twoAsOneData_v2')) || {
    activeUser: 'Partner A',
    p1Checked: false,
    p2Checked: false,
    streak: 0,
    prayers: [],
    peaceEntries: [],
    journalEntries: [],
    blueprints: {}
};

const hearthContent = {
    'guided-prayer': [
        { title: "2-Minute Peace & Union Prayer", desc: "Hold hands, take 3 deep breaths together, and pray: 'Lord, grant us quick ears to listen, soft hearts to forgive, and steady hands to serve each other today. Amen.'" },
        { title: "2-Minute Gratitude Prayer", desc: "Take turns thanking God out loud for 2 specific qualities you admire in your partner today." }
    ],
    'quality-time': [
        { title: "5-Minute Phone-Free Eye Contact Talk", desc: "Sit face-to-face, set a timer for 5 minutes, put phones in another room, and ask: 'What made you feel most supported this week?'" },
        { title: "The 3-Minute Reset Hug", desc: "Stand together and embrace in a calm hug for 60 uninterrupted seconds without speaking." }
    ],
    'scripture-reflection': [
        { title: "Colossians 3:13 Reflection", desc: "'Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.' — How can we practice proactive grace today?" }
    ]
};

const dateIdeas = {
    cozy: [
        { title: "🎬 The Movie Critic Night", desc: "Pick a movie neither of you has seen, make homemade popcorn, and write a joint 1-10 rating review after." },
        { title: "🧩 Board Game & Dessert", desc: "Clear the table, grab a favorite board or card game, and enjoy a sweet treat." },
        { title: "🕯️ Porch Talks & Tea", desc: "Turn off phone notifications, sit outside with hot tea/coffee, and talk with zero screens." },
        { title: "🍳 Surprise Dessert Cook-Off", desc: "Find a simple 4-ingredient dessert recipe online and make it together from scratch!" }
    ],
    adventure: [
        { title: "🌅 Sunset Drive & Dessert", desc: "Drive to a scenic view nearby right before sunset and grab dessert on the way home." },
        { title: "🛒 The $10 Grocery Challenge", desc: "Go to the grocery store, give each other $10 and 10 minutes to buy surprise snacks for each other!" },
        { title: "🍦 New Local Spot Hunt", desc: "Find a local ice cream or coffee shop you've never tried before and order something new." },
        { title: "🧺 Park Bench Picnic", desc: "Grab takeout sandwiches and sit at a park bench you've never visited together." }
    ],
    quick: [
        { title: "☕ 15-Minute Morning Coffee Date", desc: "Sit together for 15 solid minutes before starting the day—no phone scrolling allowed!" },
        { title: "🎵 3-Song Exchange", desc: "Play 3 songs for each other that reminded you of each other or cheered you up this week." },
        { title: "🙏 3-Minute Sunset Prayer", desc: "Pause together at the end of the day, hold hands, and speak 1 thing you're grateful for." }
    ]
};

const studyTracks = {
    faith: {
        title: "Spiritual Unity & Prayer Habits",
        prompt: "How can we build a consistent 2-minute daily prayer habit together without making it feel like a chore?",
        verse: "Ecclesiastes 4:12 — 'A cord of three strands is not quickly broken.'"
    },
    relationship: {
        title: "Active Listening & Grace Under Stress",
        prompt: "When you are feeling stressed or tired, what is the #1 signal that tells me you need support rather than advice?",
        verse: "James 1:19 — 'Be quick to listen, slow to speak, and slow to become angry.'"
    },
    personal: {
        title: "Personal Emotional Regulation & Character",
        prompt: "What is one personal goal or habit you are working on individually right now that I can pray for and encourage?",
        verse: "Proverbs 4:23 — 'Above all else, guard your heart, for everything you do flows from it.'"
    }
};

const promptLibrary = {
    'exhausted': [
        "What was the single moment today that drained your battery the most?",
        "What is one small thing your partner can do (or not do) to help you decompress tonight?",
        "If you could hand off one stressor right now to God, what would it be?",
        "What does your mind or body need most in this exact moment?"
    ],
    'anxious': [
        "What worst-case scenario is your brain playing, and what is the actual, realistic truth?",
        "What is 1 promise from scripture or reassurance from your partner you can anchor onto right now?",
        "Name 3 simple physical things you can see or feel right now to ground yourself.",
        "What is 1 thing within your control today, and what is 1 thing you need to let go of?"
    ],
    'hurt': [
        "What specific word or action triggered this hurt feeling?",
        "If you could express your heart without fear of conflict, what would you say?",
        "What reassurance do you need to feel safe and connected again?",
        "What intent do you believe your partner had versus the impact it caused?"
    ],
    'grateful': [
        "What went unexpectedly well today that brought a smile to your face?",
        "What is a small, quiet gesture your partner did recently that you noticed and appreciated?",
        "How has God shown His goodness to your relationship this week?",
        "What is 1 thing about your partner's character you love most right now?"
    ],
    'hopeful': [
        "What is 1 area of your life or relationship you feel excited to nurture next?",
        "What is a small win from today that proves you are both moving forward?",
        "What step can you take tomorrow to make the day 10% smoother?"
    ]
};

let currentPromptIndex = 0;

function saveState() {
    localStorage.setItem('twoAsOneData_v2', JSON.stringify(state));
    updateUI();
}

function changeUser() {
    state.activeUser = document.getElementById('user-selector').value;
    saveState();
}

function switchTab(e, tabId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(e && e.currentTarget) e.currentTarget.classList.add('active');
}

function toggleCheckin(partner) {
    if (partner === 'p1') state.p1Checked = !state.p1Checked;
    if (partner === 'p2') state.p2Checked = !state.p2Checked;

    if (state.p1Checked && state.p2Checked) {
        state.streak += 1;
        alert("🎉 Both partners checked in! Connection streak leveled up!");
    }
    saveState();
}

function savePrayerTarget() {
    const val = document.getElementById('prayer-target-input').value;
    if(!val) return;
    state.prayers.unshift({
        text: val,
        author: state.activeUser,
        date: new Date().toLocaleDateString()
    });
    document.getElementById('prayer-target-input').value = '';
    saveState();
}

function generateHearthContent() {
    const type = document.getElementById('hearth-content-type').value;
    const list = hearthContent[type];
    const item = list[Math.floor(Math.random() * list.length)];
    
    document.getElementById('hearth-badge').innerText = type.replace('-', ' ').toUpperCase();
    document.getElementById('hearth-title').innerText = item.title;
    document.getElementById('hearth-desc').innerText = item.desc;
    document.getElementById('hearth-content-display').style.display = 'block';
}

function generateDateIdea() {
    const cat = document.getElementById('date-category').value;
    const list = dateIdeas[cat];
    const randomIdx = Math.floor(Math.random() * list.length);
    const idea = list[randomIdx];
    
    document.getElementById('date-title').innerText = idea.title;
    document.getElementById('date-desc').innerText = idea.desc;
    document.getElementById('date-display').style.display = 'block';
}

function renderStudyTopic() {
    const trackKey = document.getElementById('study-track').value;
    const track = studyTracks[trackKey];
    
    document.getElementById('study-badge').innerText = trackKey.toUpperCase() + " TRACK";
    document.getElementById('study-title').innerText = track.title;
    document.getElementById('study-prompt').innerText = "Reflection Prompt: " + track.prompt;
    document.getElementById('study-verse').innerText = track.verse;
}

function onJournalTypeOrMoodChange() {
    const mood = document.getElementById('journal-mood').value;
    const prompts = promptLibrary[mood] || promptLibrary['grateful'];
    currentPromptIndex = 0;
    document.getElementById('prompt-text').innerText = prompts[currentPromptIndex];
}

function shufflePrompt() {
    const mood = document.getElementById('journal-mood').value;
    const prompts = promptLibrary[mood] || promptLibrary['grateful'];
    currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
    document.getElementById('prompt-text').innerText = prompts[currentPromptIndex];
}

// Event Listeners for Forms
document.getElementById('peace-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const entry = {
        date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        author: state.activeUser,
        perspective: document.getElementById('peace-perspective').value,
        feeling: document.getElementById('peace-feeling').value,
        need: document.getElementById('peace-need').value
    };
    state.peaceEntries.unshift(entry);
    saveState();
    this.reset();
});

document.getElementById('journal-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const entry = {
        date: new Date().toLocaleDateString(),
        author: state.activeUser,
        type: document.getElementById('journal-type').value,
        text: document.getElementById('journal-text').value
    };
    state.journalEntries.unshift(entry);
    saveState();
    this.reset();
});

document.getElementById('blueprint-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const bp = {
        love: document.getElementById('bp-love').value,
        apology: document.getElementById('bp-apology').value,
        stress: document.getElementById('bp-stress').value,
        signal: document.getElementById('bp-signal').value,
        pickup: document.getElementById('bp-pickup').value
    };
    state.blueprints[state.activeUser] = bp;
    saveState();
    this.reset();
});

// Main UI Update & Render Function
function updateUI() {
    document.getElementById('user-selector').value = state.activeUser;
    document.getElementById('streak-count').innerText = `${state.streak} Days`;

    // Checkin Buttons
    const btnP1 = document.getElementById('btn-checkin-p1');
    const btnP2 = document.getElementById('btn-checkin-p2');
    btnP1.className = 'checkin-btn' + (state.p1Checked ? ' checked' : '');
    btnP2.className = 'checkin-btn' + (state.p2Checked ? ' checked' : '');

    // Render Prayer Wall
    const prayerList = document.getElementById('prayer-history-list');
    prayerList.innerHTML = state.prayers.length === 0 ? '<p style="font-size:0.85rem; color:#888;">No active prayer requests currently.</p>' : '';
    state.prayers.forEach(p => {
        prayerList.innerHTML += `
            <div class="feed-item">
                <div class="feed-header">
                    <span class="author-tag">${p.author}</span>
                    <span>${p.date}</span>
                </div>
                <div>${p.text}</div>
            </div>
        `;
    });

    // Render Peace Feed
    const peaceFeed = document.getElementById('peace-feed');
    peaceFeed.innerHTML = state.peaceEntries.length === 0 ? '<p style="font-size:0.85rem; color:#888;">The Peace Table is currently clear.</p>' : '';
    state.peaceEntries.forEach(p => {
        peaceFeed.innerHTML += `
            <div class="feed-item peace-card">
                <div class="feed-header">
                    <span class="author-tag">🕊️ Shared by ${p.author}</span>
                    <span>${p.date}</span>
                </div>
                <p><strong>Perspective:</strong> ${p.perspective}</p>
                <p><strong>Feeling:</strong> ${p.feeling}</p>
                <p><strong>Need:</strong> ${p.need}</p>
            </div>
        `;
    });

    // Render Journal Feed (Filtering private entries for current user)
    const journalFeed = document.getElementById('journal-feed');
    journalFeed.innerHTML = '';
    const visibleJournal = state.journalEntries.filter(j => {
        if (j.type.includes('Private')) {
            return j.author === state.activeUser;
        }
        return true;
    });

    if (visibleJournal.length === 0) {
        journalFeed.innerHTML = '<p style="font-size:0.85rem; color:#888;">No visible entries in your vault yet.</p>';
    } else {
        visibleJournal.forEach(j => {
            const isPrivate = j.type.includes('Private');
            journalFeed.innerHTML += `
                <div class="feed-item" style="${isPrivate ? 'background:#f8f9fa; border-left:4px solid #6c757d;' : ''}">
                    <div class="feed-header">
                        <span class="author-tag">${j.author}</span>
                        <span>${j.date}</span>
                    </div>
                    <span class="pill-badge">${j.type}</span>
                    <p style="margin-top:8px;">${j.text}</p>
                </div>
            `;
        });
    }

    // Render Blueprints
    const bpList = document.getElementById('blueprint-list');
    bpList.innerHTML = '';
    const keys = Object.keys(state.blueprints);
    if (keys.length === 0) {
        bpList.innerHTML = '<p style="font-size:0.85rem; color:#888;">No blueprints submitted yet.</p>';
    } else {
        keys.forEach(user => {
            const bp = state.blueprints[user];
            bpList.innerHTML += `
                <div class="feed-item">
                    <h4 style="margin:0 0 10px 0; color:var(--primary-ocean);">👤 ${user}'s Blueprint</h4>
                    <p><strong>Love Language:</strong> ${bp.love}</p>
                    <p><strong>Apology Style:</strong> ${bp.apology}</p>
                    <p><strong>When Stressed:</strong> ${bp.stress}</p>
                    <p><strong>Overwhelm Signal:</strong> ${bp.signal}</p>
                    <p><strong>Pick-Me-Up:</strong> ${bp.pickup}</p>
                </div>
            `;
        });
    }
}

// Initial Boot Setup
document.addEventListener('DOMContentLoaded', () => {
    onJournalTypeOrMoodChange();
    renderStudyTopic();
    updateUI();
});
