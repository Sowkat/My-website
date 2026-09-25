// প্যাকেজ তথ্যসমূহ
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

// পেমেন্ট নম্বরসমূহ
const paymentNumbers = {
    bKash: "01700000000",
    Nagad: "01800000000",
    Rocket: "01900000000"
};

// ফায়ারবেস ইনিশিয়ালাইজেশন
const db = firebase.firestore();

// ক্যাটাগরি পরিবর্তনের সঙ্গে প্যাকেজ ও ইনপুট পরিবর্তন
function updatePackageOptions() {
    const categorySelect = document.getElementById("serviceCategory");
    const packageSelect = document.getElementById("packageSelect");
    const dynamicLabel = document.getElementById("dynamicLabel");
    const targetInput = document.getElementById("targetInput");

    const category = categorySelect.value;
    packageSelect.innerHTML = '<option value="">-- প্যাকেজ নির্বাচন করুন --</option>';

    if (!category) {
        document.getElementById("totalPrice").innerText = "0";
        return;
    }

    // ইনপুট লেবেল ডায়নামিক পরিবর্তন
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

    // প্যাকেজ অপশন যুক্ত করা
    packages[category].forEach((pkg, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.innerText = `${pkg.name} - ${pkg.price} BDT`;
        packageSelect.appendChild(option);
    });

    calculatePrice();
}

// সার্ভিস কার্ডে ক্লিক করলে সরাসরি অর্ডারে যাওয়া
function selectServiceCategory(type) {
    const categorySelect = document.getElementById("serviceCategory");
    if (type === 'gaming') categorySelect.value = "ff";
    else if (type === 'facebook') categorySelect.value = "facebook";
    else if (type === 'youtube') categorySelect.value = "youtube";

    updatePackageOptions();
    const orderSection = document.getElementById("order");
    if(orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
}

// দাম গণনা করা
function calculatePrice() {
    const category = document.getElementById("serviceCategory").value;
    const packageIndex = document.getElementById("packageSelect").value;

    if (category && packageIndex !== "") {
        const selectedPackage = packages[category][packageIndex];
        document.getElementById("totalPrice").innerText = selectedPackage.price;
    } else {
        document.getElementById("totalPrice").innerText = "0";
    }
}

// পেমেন্ট ইনফো আপডেট
function updatePaymentInfo(method) {
    const payNumElem = document.getElementById("payNumber");
    if(payNumElem && paymentNumbers[method]) {
        payNumElem.innerText = paymentNumbers[method];
    }
}

// নম্বর কপি ফাংশন
function copyNumber() {
    const num = document.getElementById("payNumber").innerText;
    navigator.clipboard.writeText(num);
    alert("পেমেন্ট নম্বর কপি করা হয়েছে: " + num);
}

// অর্ডার সাবমিট করা (Firebase Online Database-এ সেভ হবে)
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

        // ইউনিক অর্ডার আইডি জেনারেশন (যেমন: ORD-8492)
        const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);

        const orderData = {
            orderId: orderId,
            service: selectedPackage.name,
            target: target,
            price: selectedPackage.price,
            paymentMethod: paymentMethod,
            senderNumber: senderNumber,
            trxId: trxId,
            status: "Pending (অপেক্ষমাণ)",
            date: new Date().toLocaleString("bn-BD"),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        // অনলাইন ফায়ারবেস ডাটাবেজে সেভ করা
        db.collection("orders").doc(orderId).set(orderData)
        .then(() => {
            alert(`আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!\n\nআপনার Order ID: ${orderId}\n\nএই আইডিটি সংরক্ষণ করুন অর্ডার স্ট্যাটাস ট্র্যাক করার জন্য।`);
            document.getElementById("orderForm").reset();
            document.getElementById("totalPrice").innerText = "0";
        })
        .catch((error) => {
            alert("অর্ডার সাবমিট করতে সমস্যা হয়েছে: " + error.message);
        });
    });
}

// অর্ডার স্ট্যাটাস ট্র্যাকিং (Firebase থেকে তথ্য এনে দেখাবে)
function trackOrder() {
    const trackInput = document.getElementById("trackInput").value.trim();
    const trackResult = document.getElementById("trackResult");

    if (!trackInput) {
        trackResult.innerHTML = "<p style='color: #ef4444;'>অনুগ্রহ করে একটি সঠিক Order ID দিন।</p>";
        return;
    }

    trackResult.innerHTML = "<p style='color: #60a5fa;'>খোঁজা হচ্ছে...</p>";

    db.collection("orders").doc(trackInput).get().then((doc) => {
        if (doc.exists) {
            const order = doc.data();
            trackResult.innerHTML = `
                <div class="status-card">
                    <h3>অর্ডার আইডি: ${order.orderId}</h3>
                    <p><strong>সার্ভিস:</strong> ${order.service}</p>
                    <p><strong>আইডি / লিংক:</strong> ${order.target}</p>
                    <p><strong>পেমেন্ট:</strong> ${order.paymentMethod} (TrxID: ${order.trxId})</p>
                    <p><strong>তারিখ:</strong> ${order.date}</p>
                    <p style="margin-top: 10px;"><strong>স্ট্যাটাস:</strong> <span class="status-badge">${order.status}</span></p>
                </div>
            `;
        } else {
            trackResult.innerHTML = "<p style='color: #ef4444;'>কোনো অর্ডার পাওয়া যায়নি! আইডি ঠিকভাবে দিন।</p>";
        }
    }).catch((error) => {
        trackResult.innerHTML = "<p style='color: #ef4444;'>স্ট্যাটাস চেক করতে সমস্যা হয়েছে!</p>";
    });
}
