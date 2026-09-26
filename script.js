// প্যাকেজের তালিকা
const packagesData = {
    ff: [
        { name: "115 Diamond", price: 80 },
        { name: "240 Diamond", price: 160 },
        { name: "610 Diamond", price: 400 },
        { name: "Weekly Membership", price: 160 },
        { name: "Monthly Membership", price: 750 }
    ],
    pubg: [
        { name: "60 UC", price: 100 },
        { name: "325 UC", price: 480 },
        { name: "660 UC", price: 950 },
        { name: "1800 UC", price: 2400 }
    ],
    facebook: [
        { name: "1000 Facebook Page Likes", price: 300 },
        { name: "1000 Facebook Followers", price: 350 },
        { name: "Post Boost (1 Day)", price: 250 }
    ],
    youtube: [
        { name: "1000 YouTube Views", price: 200 },
        { name: "100 Subscriber", price: 400 },
        { name: "4000 Hours Watch Time", price: 3500 }
    ]
};

// প্যাকেজ আপডেট করার মেইন ফাংশন
function updatePackageOptions() {
    const categorySelect = document.getElementById("serviceCategory");
    const packageSelect = document.getElementById("packageSelect");
    
    if (!categorySelect || !packageSelect) return;
    
    const val = categorySelect.value;
    
    // ক্যাটাগরি ম্যাচিং
    let key = "";
    if (val === "pubg" || val.includes("pubg") || val.includes("PUBG")) {
        key = "pubg";
    } else if (val === "ff" || val.includes("ff") || val.includes("Free Fire")) {
        key = "ff";
    } else if (val === "facebook" || val.includes("facebook") || val.includes("Facebook")) {
        key = "facebook";
    } else if (val === "youtube" || val.includes("youtube") || val.includes("YouTube")) {
        key = "youtube";
    }

    packageSelect.innerHTML = "";

    if (key && packagesData[key]) {
        const defaultOpt = document.createElement("option");
        defaultOpt.value = "";
        defaultOpt.textContent = "-- প্যাকেজ বেছে নিন --";
        packageSelect.appendChild(defaultOpt);

        packagesData[key].forEach(pkg => {
            const opt = document.createElement("option");
            opt.value = pkg.price;
            opt.textContent = pkg.name + " - " + pkg.price + " BDT";
            packageSelect.appendChild(opt);
        });
    } else {
        const defaultOpt = document.createElement("option");
        defaultOpt.value = "";
        defaultOpt.textContent = "-- প্রথমে ক্যাটাগরি নির্বাচন করুন --";
        packageSelect.appendChild(defaultOpt);
    }

    calculatePrice();
}

// দাম হিসাব করা
function calculatePrice() {
    const packageSelect = document.getElementById("packageSelect");
    const priceDisplay = document.getElementById("totalPrice");
    if (packageSelect && priceDisplay) {
        priceDisplay.textContent = packageSelect.value || "0";
    }
}

// পেমেন্ট নম্বর দেখানো
function updatePaymentInfo(method) {
    const payNumber = document.getElementById("payNumber");
    if (!payNumber) return;
    if (method === 'bKash') payNumber.textContent = "01700000000";
    else if (method === 'Nagad') payNumber.textContent = "01800000000";
    else if (method === 'Rocket') payNumber.textContent = "01900000000";
}

// কপি বাটন
function copyNumber() {
    const payNumber = document.getElementById("payNumber");
    if (payNumber) {
        navigator.clipboard.writeText(payNumber.textContent);
        alert("নম্বর কপি করা হয়েছে: " + payNumber.textContent);
    }
}

// কার্ডে ক্লিক করলে কাজ করা
function selectServiceCategory(type) {
    const categorySelect = document.getElementById("serviceCategory");
    if (categorySelect) {
        if (type === 'gaming') categorySelect.value = 'ff';
        else if (type === 'facebook') categorySelect.value = 'facebook';
        else if (type === 'youtube') categorySelect.value = 'youtube';
        
        updatePackageOptions();
        const orderSection = document.getElementById("order");
        if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyCw6uxjJIwbBJorzDJXn9VntKu2vNLuvNU",
  authDomain: "my-web-8b105.firebaseapp.com",
  databaseURL: "https://my-web-8b105-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-web-8b105",
  storageBucket: "my-web-8b105.firebasestorage.app",
  messagingSenderId: "554855600124",
  appId: "1:554855600124:web:3bcb88dca98908b6d7ec79"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// পেজ লোড হলে লিসেনার অটোমেটিক অ্যাক্টিভ করা
document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("serviceCategory");
    const packageSelect = document.getElementById("packageSelect");
    
    if (categorySelect) {
        categorySelect.addEventListener("change", updatePackageOptions);
        categorySelect.addEventListener("click", updatePackageOptions);
    }
    
    if (packageSelect) {
        packageSelect.addEventListener("change", calculatePrice);
    }

    const orderForm = document.getElementById("orderForm");
    if (orderForm) {
        orderForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const db = firebase.firestore();
            const serviceCategoryObj = document.getElementById("serviceCategory");
            const serviceCategory = serviceCategoryObj ? serviceCategoryObj.options[serviceCategoryObj.selectedIndex].text : "";
            
            const selectedPackageText = packageSelect && packageSelect.selectedIndex >= 0 ? packageSelect.options[packageSelect.selectedIndex].text : "";
            const targetInput = document.getElementById("targetInput") ? document.getElementById("targetInput").value : "";
            const price = packageSelect ? packageSelect.value : "0";
            
            const paymentMethodObj = document.querySelector('input[name="paymentMethod"]:checked');
            const paymentMethod = paymentMethodObj ? paymentMethodObj.value : "N/A";
            
            const senderNumber = document.getElementById("senderNumber") ? document.getElementById("senderNumber").value : "";
            const trxId = document.getElementById("trxId") ? document.getElementById("trxId").value : "";

            if (!price || price === "0") {
                alert("দয়া করে একটি প্যাকেজ নির্বাচন করুন!");
                return;
            }

            const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
            const orderDate = new Date().toLocaleString("bn-BD");

            const submitBtn = document.getElementById("submitBtn");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "অর্ডার প্রসেস হচ্ছে...";
            }

            db.collection("orders").doc(orderId).set({
                orderId: orderId,
                service: serviceCategory + " (" + selectedPackageText + ")",
                target: targetInput,
                price: price,
                paymentMethod: paymentMethod,
                senderNumber: senderNumber,
                trxId: trxId,
                status: "Pending (অপেক্ষমাণ)",
                date: orderDate
            })
            .then(() => {
                alert("আপনার অর্ডার সফলভাবে গৃহীত হয়েছে!\n\nOrder ID: " + orderId);
                orderForm.reset();
                if (document.getElementById("totalPrice")) {
                    document.getElementById("totalPrice").textContent = "0";
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> অর্ডার সাবমিট করুন';
                }
            })
            .catch((error) => {
                alert("অর্ডার পাঠাতে সমস্যা হয়েছে: " + error.message);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> অর্ডার সাবমিট করুন';
                }
            });
        });
    }
});

// অর্ডার ট্র্যাক করার ফাংশন
function trackOrder() {
    const trackInputObj = document.getElementById("trackInput");
    const trackResult = document.getElementById("trackResult");

    if (!trackInputObj || !trackInputObj.value.trim()) {
        alert("দয়া করে Order ID দিন!");
        return;
    }

    const trackInput = trackInputObj.value.trim();
    const db = firebase.firestore();
    trackResult.innerHTML = "খোঁজা হচ্ছে...";

    db.collection("orders").doc(trackInput).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            trackResult.innerHTML = `
                <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin-top: 10px; border: 1px solid #334155; color: #fff;">
                    <p><b>অর্ডার আইডি:</b> ${data.orderId}</p>
                    <p><b>সার্ভিস:</b> ${data.service}</p>
                    <p><b>মূল্য:</b> ${data.price} BDT</p>
                    <p><b>স্ট্যাটাস:</b> <span style="color: #f59e0b; font-weight: bold;">${data.status}</span></p>
                    <p><b>তারিখ:</b> ${data.date}</p>
                </div>
            `;
        } else {
            trackResult.innerHTML = "<p style='color: #ef4444; margin-top: 10px;'>কোনো অর্ডার পাওয়া যায়নি! সঠিক Order ID দিন।</p>";
        }
    }).catch(err => {
        trackResult.innerHTML = "<p style='color: #ef4444;'>সমস্যা হয়েছে: " + err.message + "</p>";
    });
}
