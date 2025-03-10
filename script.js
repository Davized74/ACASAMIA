import { getFirestore, addDoc, collection, query, orderBy, onSnapshot, doc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore-compat.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js";
import { firebaseConfig } from "./firebase-config.js";

initializeApp(firebaseConfig);
const db = getFirestore();

function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (user === "Acasamia" && pass === "Davide") {
        document.getElementById("login-form").style.display = "none";
        document.getElementById("dashboard-section").style.display = "block";
    } else {
        alert("Credenziali errate!");
    }
}

function showCalendar() {
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("calendar-section").style.display = "block";
    initializeCalendar();
}

function initializeCalendar() {
    const q = query(collection(db, 'bookings'), orderBy('start'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            start: doc.data().start,
            end: doc.data().end,
            guestNumber: doc.data().guestNumber
        }));
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'it',
            events: bookings.map(booking => ({
                id: booking.id,
                title: `${booking.title} - ${booking.guestNumber} persone`,
                start: booking.start,
                end: booking.end,
                backgroundColor: getColor(booking.guestNumber),
                borderColor: getColor(booking.guestNumber)
            }))
        });
        calendar.render();
    });
}

function getColor(guestNumber) {
    if (guestNumber <= 2) return 'var(--pastel-blue)';
    if (guestNumber <= 4) return 'var(--pastel-green)';
    if (guestNumber <= 6) return 'var(--pastel-yellow)';
    return 'var(--pastel-pink)';
}

function showBookingForm() {
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("booking-form").style.display = "block";
}

async function showBookingList() {
    document.getElementById("dashboard-section").style.display = "none";
    document.getElementById("booking-list").style.display = "block";
    const listEl = document.getElementById("booking-list-content");
    listEl.innerHTML = "";
    const q = query(collection(db, 'bookings'), orderBy('start'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
        const li = document.createElement("li");
        li.textContent = `${doc.data().title} (${doc.data().start} - ${doc.data().end}, ${doc.data().guestNumber} persone) - ID: ${doc.id}`;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Elimina";
        deleteBtn.onclick = async () => {
            await deleteDoc(doc(db, "bookings", doc.id));
            showBookingList();
        };
        li.appendChild(deleteBtn);
        listEl.appendChild(li);
    });
}

function backToDashboard() {
    document.getElementById("dashboard-section").style.display = "block";
    document.getElementById("calendar-section").style.display = "none";
    document.getElementById("booking-form").style.display = "none";
    document.getElementById("booking-list").style.display = "none";
}

async function saveBooking() {
    const guestName = document.getElementById("guest-name").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const guestNumber = parseInt(document.getElementById("guest-number").value);

    try {
        await addDoc(collection(db, "bookings"), {
            title: guestName,
            start: startDate,
            end: endDate,
            guestNumber: guestNumber,
        });
        alert("Prenotazione salvata con successo!");
        backToDashboard();
    } catch (error) {
        console.error("Errore durante il salvataggio della prenotazione:", error);
        alert("Si è verificato un errore durante il salvataggio. Riprova più tardi.");
    }
}