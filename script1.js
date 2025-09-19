// script1.js
// ---- Cloudinary settings ----
// Replace with your Cloudinary values (create unsigned upload preset in Cloudinary dashboard)
const CLOUD_NAME = "dz2mg27yo";         // example you gave
const UPLOAD_PRESET = "DhanushPolagani11"; // your unsigned preset

// ---- Page navigation helpers ----
function showLoginPage() {
  document.getElementById("registerPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("dataPage").style.display = "none";
  clearMessages();
}
function showRegisterPage() {
  document.getElementById("registerPage").style.display = "block";
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dataPage").style.display = "none";
  clearMessages();
}
function showDataPage() {
  document.getElementById("registerPage").style.display = "none";
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dataPage").style.display = "block";
  clearMessages();
}

function clearMessages() {
  const ids = ["regMessage","loginMessage","uploadMessage"];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.innerText = ""; });
}

// ---- Auth: register/login/logout (v8 API) ----
function register() {
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  if (!email || !password) return document.getElementById("regMessage").innerText = "Enter email & password";

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      document.getElementById("regMessage").innerText = "Registered! Please login.";
      showLoginPage();
    })
    .catch(err => {
      document.getElementById("regMessage").innerText = "Error: " + err.message;
      console.error("Register error:", err);
    });
}

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!email || !password) return document.getElementById("loginMessage").innerText = "Enter email & password";

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      document.getElementById("loginMessage").innerText = "Login success!";
      document.getElementById("status").innerText = "Logged in: " + (userCredential.user.email || "");
      showDataPage();
      loadData();
    })
    .catch(err => {
      document.getElementById("loginMessage").innerText = "Error: " + err.message;
      console.error("Login error:", err);
    });
}

function logout() {
  firebase.auth().signOut().then(() => {
    document.getElementById("status").innerText = "Not logged in";
    showLoginPage();
  });
}

// auto-detect auth state and show appropriate page
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.getElementById("status").innerText = "Logged in: " + (user.email || "");
    showDataPage();
    loadData();
  } else {
    document.getElementById("status").innerText = "Not logged in";
    showLoginPage();
  }
});

// ---- Toggle inputs ----
function toggleInput() {
  const type = document.getElementById("dataType").value;
  const textInput = document.getElementById("textInput");
  const fileInput = document.getElementById("fileInput");
  if (type === "text") {
    textInput.style.display = "block";
    fileInput.style.display = "none";
  } else {
    textInput.style.display = "none";
    fileInput.style.display = "block";
    fileInput.accept = (type === "video") ? "video/*" : "image/*";
  }
}

// ---- Cloudinary uploader ----
async function uploadToCloudinary(file, type) {
  if (!file) throw new Error("No file provided");
  const endpointType = (type === "video") ? "video" : "image";
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpointType}/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("Cloudinary upload failed: " + text);
  }
  const data = await res.json();
  return data.secure_url;
}

// ---- Save Data (text/image/video) ----
async function saveData() {
  const type = document.getElementById("dataType").value;
  const user = firebase.auth().currentUser;
  if (!user) return alert("Please login first");

  if (type === "text") {
    const text = document.getElementById("textInput").value.trim();
    if (!text) return alert("Enter text");
    await firebase.firestore().collection("userData").add({
      uid: user.uid,
      type: "text",
      content: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Text saved");
    loadData();
    return;
  }

  // image / video
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Select a file");
  try {
    const uploadedUrl = await uploadToCloudinary(file, type);
    await firebase.firestore().collection("userData").add({
      uid: user.uid,
      type: type,
      content: uploadedUrl,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert(type + " uploaded and saved");
    loadData();
  } catch (err) {
    console.error("Upload error", err);
    alert("Upload failed: " + err.message);
  }
}

// ---- Load user's saved data from Firestore ----
function loadData() {
  const user = firebase.auth().currentUser;
  const dataList = document.getElementById("dataList");
  dataList.innerHTML = "";
  if (!user) return;

  firebase.firestore().collection("userData")
    .where("uid", "==", user.uid)
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const item = doc.data();
        if (item.type === "text") {
          const p = document.createElement("p");
          p.textContent = item.content;
          dataList.appendChild(p);
        } else if (item.type === "image") {
          const img = document.createElement("img");
          img.src = item.content;
          img.style.maxWidth = "300px";
          img.style.display = "block";
          img.style.margin = "8px 0";
          dataList.appendChild(img);
        } else if (item.type === "video") {
          const v = document.createElement("video");
          v.src = item.content;
          v.controls = true;
          v.style.maxWidth = "300px";
          v.style.display = "block";
          v.style.margin = "8px 0";
          dataList.appendChild(v);
        }
      });
    })
    .catch(err => console.error("Load data error:", err));
}
