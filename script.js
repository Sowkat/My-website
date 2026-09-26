// ১. ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyCW6uxjJIwb8JorzDJXm9YntKu2vNLuvNU",
  authDomain: "my-web-8b105.firebaseapp.com",
  databaseURL: "https://my-web-8b105-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-web-8b105",
  storageBucket: "my-web-8b105.firebasestorage.app",
  messagingSenderId: "554855600124",
  appId: "1:554855600124:web:3bcb88dca98908b6d7ec79"
};

// ২. ফায়ারবেস ইনিশিয়ালাইজ
if (typeof firebase !== "undefined" && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = typeof firebase !== "undefined" ? firebase.firestore() : null;

// ৩. প্যাকেজ তালিকা
const packages = {
    ff: [
        { name: "115 Diamonds", price: 80 },
        { name: "240 Diamonds", price: 160 },
        { name: "610 Diamonds", price: 400 },
        { name: "Weekly Membership", price: 160 },
        { name: "Monthly Membership", price: 750 }
    ],
    pubg: [
        { name: "60 UC", price: 100 },
        { name: "325 UC", price: 480 },
        { name: "660 UC", price: 950 },
        { name: "Royale Pass", price: 1050 }
    ],
    facebook: [
        { name: "1,000 Page Likes / Followers", price: 250 },
        { name: "5,000 Post Reach", price: 200 },
        { name: "10,000 Video Views", price: 350 }
    ],
    youtube: [
        { name: "1,000 Views", price: 180 },
        { name: "500 Subscribers", price: 500 },
        { name: "1,000 Subs + 4k Watch Time", price: 3500 }
    ]
};

// ৪. পেমেন্ট নম্বর
const paymentNumbers = {
    bKash: "01700000000",
    Nagad: "01800000000",
    Rocket: "01900000000"
};

// ৫. প্যাকেজ অপশন আপডেট ফাংশন
function updatePackageOptions() {
    const categorySelect = document.getElementById("serviceCategory");
    const packageSelect = document.getElementById("packageSelect");
    const dynamicLabel = document.getElementById("dynamicLabel");
    const targetInput = document.getElementById("targetInput");

    if (!categorySelect || !packageSelect) return;

    const category = categorySelect.value;
    packageSelect.innerHTML = '<option value="">-- প্যাকেজ নির্বাচন করুন --</option>';

    if (!category || !packages[category]) {
        document.getElementById("totalPrice").innerText = "0";
        return;
    }

    if (category === "ff" || category === "pubg") {
        if(dynamicLabel) dynamicLabel.innerHTML = '<i class="fa-solid fa-id-card"></i> প্লেয়ার আইডি (Player ID / UID):';
        if(targetInput) targetInput.placeholder = "আপনার গেম আইডি নম্বর দিন";
    } else if (category === "facebook") {
        if(dynamicLabel) dynamicLabel.innerHTML = '<i class="fa-solid fa-link"></i> ফেসবুক পেজ বা পোস্ট লিংক:';
        if(targetInput) targetInput.placeholder = "https://facebook.com/...";
    } else if (category === "youtube") {
        if(dynamicLabel) dynamicLabel.innerHTML = '<i class="fa-solid fa-link"></i> ইউটিউব ভিডিও বা চ্যানেল লিংক:';
        if(targetInput) targetInput.placeholder = "https://youtube.com/...";
    }

    packages[category].forEach((pkg, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.innerText = `${pkg.name} - ${pkg.price} BDT`;
        packageSelect.appendChild(option);
    });

    calculatePrice();
}

function selectServiceCategory(type) {
    const categorySelect = document.getElementById("serviceCategory");
    if (!categorySelect) return;

    if (type === 'gaming') categorySelect.value = "ff";
    else if (type === 'facebook') categorySelect.value = "facebook";
    else if (type === 'youtube') categorySelect.value = "youtube";

    updatePackageOptions();
    const orderSection = document.getElementById("order");
    if(orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
}

function calculatePrice() {
    const categorySelect = document.getElementById("serviceCategory");
    const packageSelect = document.getElementById("packageSelect");

    if (!categorySelect || !packageSelect) return;

    const category = categorySelect.value;
    const packageIndex = packageSelect.value;

    if (category && packageIndex !== "" && packages[category] && packages[category][packageIndex]) {
        const selectedPackage = packages[category][packageIndex];
        document.getElementById("totalPrice").innerText = selectedPackage.price;
    } else {
        document.getElementById("totalPrice").innerText = "0";
    }
}

function updatePaymentInfo(method) {
    const payNumElem = document.getElementById("payNumber");
    if(payNumElem && paymentNumbers[method]) {
        payNumElem.innerText = paymentNumbers[method];
    }
}

function copyNumber() {
    const num = document.getElementById("payNumber").innerText;
    navigator.clipboard.writeText(num);
    alert("পেমেন্ট নম্বর কপি করা হয়েছে: " + num);
}

document.addEventListener("DOMContentLoaded", function() {
    const orderForm = document.getElementById("orderForm");
    if(orderForm) {
        orderForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const category = document.getElementById("serviceCategory").value;
            const packageIndex = document.getElementById("packageSelect").value;
            const target = document.getElementById("targetInput").value;
            const paymentMethodObj = document.querySelector('input[name="paymentMethod"]:checked');
            const paymentMethod = paymentMethodObj ? paymentMethodObj.value : "N/A";
            const senderNumber = document.getElementById("senderNumber").value;
            const trxId = document.getElementById("trxId").value;

            if (!category || packageIndex === "") {
                alert("অনুগ্রহ করে সার্ভিস এবং প্যাকেজ নির্বাচন করুন।");
                return;
            }

            const selectedPackage = packages[category][packageIndex];
            const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

            const orderData = {
                orderId: orderId,
                service: selectedPackage.name,
                target: target,
                price: selectedPackage.price,
                paymentMethod: paymentMethod,
                senderNumber: senderNumber,
                trxId: trxId,
                status: "Pending (অপেক্ষমাণ)",
                date: new Date().toLocaleString("bn-BD")
            };

            if (db) {
                db.collection("orders").doc(orderId).set(orderData)
                .then(() => {
                    alert(`আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!\n\nOrder ID: ${orderId}`);
                    document.getElementById("orderForm").reset();
                    document.getElementById("totalPrice").innerText = "0";
                })
                .catch((error) => {
                    alert("অর্ডার সাবমিট করতে সমস্যা হয়েছে: " + error.message);
                });
            }
        });
    }
});

function trackOrder() {
    const trackInput = document.getElementById("trackInput").value.trim();
    const trackResult = document.getElementById("trackResult");

    if (!trackInput) {
        trackResult.innerHTML = "<p style='color: #ef4444;'>অনুগ্রহ করে একটি সঠিক Order ID দিন।</p>";
        return;
    }

    trackResult.innerHTML = "<p style='color: #60a5fa;'>খোঁজা হচ্ছে...</p>";

    if (db) {
        db.collection("orders").doc(trackInput).get().then((doc) => {
            if (doc.exists) {
                const order = doc.data();
                trackResult.innerHTML = `
                    <div class="status-card" style="background: #1e293b; padding: 15px; border-radius: 8px; margin-top: 10px;">
                        <h3>অর্ডার আইডি: ${order.orderId}</h3>
                        <p><strong>সার্ভিস:</strong> ${order.service}</p>
                        <p><strong>আইডি / লিংক:</strong> ${order.target}</p>
                        <p><strong>পেমেন্ট:</strong> ${order.paymentMethod} (TrxID: ${order.trxId})</p>
                        <p><strong>স্ট্যাটাস:</strong> <span style="color: #f59e0b; font-weight: bold;">${order.status}</span></p>
                    </div>
                `;
            } else {
                trackResult.innerHTML = "<p style='color: #ef4444;'>কোনো অর্ডার পাওয়া যায়নি!</p>";
            }
        }).catch(() => {
            trackResult.innerHTML = "<p style='color: #ef4444;'>স্ট্যাটাস চেক করতে সমস্যা হয়েছে!</p>";
        });
    }
}
