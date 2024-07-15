import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://confess-app-realtime-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const confessionsRef = ref(database, "confessions");


const inputFieldEl = document.getElementById("input-field");
const publishBtn = document.getElementById("publish-btn");
const confessListEl = document.getElementById("confess-list");
const fromFieldEl = document.getElementById("from-field");
const toFieldEl = document.getElementById("to-field");

publishBtn.addEventListener("click", function(){
    let message = inputFieldEl.value;
    let from = fromFieldEl.value;
    let to = toFieldEl.value;
 
    if (message && from && to) {
        let newConfession = {
            message: message,
            from: from,
            to: to
        };

        push(confessionsRef, newConfession);
        clearInputFields();
    } else {
        alert("Please fill in all fields.");
    }
});

onValue(confessionsRef, function(snapshot) {
    clearConfessListEl();
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        
        itemsArray.forEach(item => {
            let itemID = item[0];
            let itemValue = item[1];
            appendItemToConfessListEl(itemID, itemValue);
        });
    } else {
        confessListEl.innerHTML = "No confessions yet...";
    }
});

function clearInputFields() {
    inputFieldEl.value = "";
    fromFieldEl.value = "";
    toFieldEl.value = "";
}

function clearConfessListEl(){
    confessListEl.innerHTML = "";
}

function appendItemToConfessListEl(itemID, itemValue) {  
    let newEl = document.createElement("li");
    newEl.innerHTML = `
    <h4>To ${itemValue.to}</h4><br>
    <p>${itemValue.message}</p><br>
    <h4>From ${itemValue.from}</h4> 
`;

    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `confessions/${itemID}`);
        remove(exactLocationOfItemInDB);
    });

    confessListEl.append(newEl);
}
