let foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];

/* =========================
   SAVE DATA
========================= */
function saveFoodItems() {
  localStorage.setItem("foodItems", JSON.stringify(foodItems));
}

/* =========================
   NAVIGATION (SHOW SECTIONS)
========================= */
function showSection(sectionId) {
  document.getElementById("addFoodSection").style.display = "none";
  document.getElementById("donateSection").style.display = "none";
  document.getElementById("impactSection").style.display = "none";

  document.getElementById(sectionId).style.display = "block";

  if (sectionId === "impactSection") {
    updateImpactDashboard();
  }
}

/* =========================
   ADD FOOD ITEM
========================= */
function addFood() {
  let name = document.getElementById("foodName").value;
  let category = document.getElementById("foodCategory").value;
  let expiry = document.getElementById("expiryDate").value;
  let quantity = document.getElementById("quantity").value;

  if (name === "" || expiry === "") {
    alert("Please enter food name and expiry date!");
    return;
  }

  let food = {
    name: name,
    category: category,
    expiry: expiry,
    quantity: quantity
  };

  foodItems.push(food);
  saveFoodItems();
  displayFood();

  document.getElementById("foodName").value = "";
  document.getElementById("expiryDate").value = "";
  document.getElementById("quantity").value = "";
}

/* =========================
   DAYS LEFT CALCULATION
========================= */
function daysLeft(expiryDate) {
  let today = new Date();
  let expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  let diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/* =========================
   DISPLAY FOOD LIST
========================= */
function displayFood() {
  let list = document.getElementById("foodList");
  list.innerHTML = "";

  foodItems.forEach((food, index) => {
    let left = daysLeft(food.expiry);

    let status = "";
    if (left < 0) status = "❌ Expired";
    else if (left <= 3) status = "⚠️ Expiring Soon";
    else status = "✅ Safe";

    let li = document.createElement("li");
    li.innerHTML = `
      <b>${food.name}</b> (${food.category})<br>
      Expiry: ${food.expiry} <br>
      Days left: ${left} <br>
      Status: ${status} <br><br>
      <button onclick="deleteFood(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
}

/* =========================
   DELETE FOOD ITEM
========================= */
function deleteFood(index) {
  foodItems.splice(index, 1);
  saveFoodItems();
  displayFood();
}

/* =========================
   IMPACT DASHBOARD
========================= */
function updateImpactDashboard() {
  let total = foodItems.length;
  let expired = 0;
  let saved = 0;

  foodItems.forEach(food => {
    let left = daysLeft(food.expiry);
    if (left < 0) expired++;
    else saved++;
  });

  // Simple estimates (for demo purposes)
  let co2 = saved * 2;       // kg CO₂ per saved item
  let money = saved * 1.5;   // € saved per item (basic estimate)

  document.getElementById("totalItems").innerText = total;
  document.getElementById("expiredItems").innerText = expired;
  document.getElementById("savedItems").innerText = saved;
  document.getElementById("co2Saved").innerText = co2 + " kg";
  document.getElementById("moneySaved").innerText = "€" + money;
}

/* =========================
   INITIAL LOAD
========================= */
displayFood();

/* =========================
   PWA SERVICE WORKER
========================= */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => {
        console.log("Service Worker Registered ✔️");
      })
      .catch((error) => {
        console.log("Service Worker Failed ❌", error);
      });
  });
}