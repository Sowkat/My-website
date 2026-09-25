// প্যাকেজ তথ্যসমূহ (আপনার ইচ্ছেমতো দাম ও নাম পরিবর্তন করতে পারবেন)
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

// পেমেন্ট নম্বরসমূহ (নিজের বিকাশ/নগদ/রকেট নম্বর সেট করে নিন)
const paymentNumbers = {
    bKash: "01700000000",
    Nagad: "01800000000",
    Rocket: "01900000000"
};

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
        dynamicLabel.innerHTML = '<i class="fa-solid fa-id-card"></i> প্লেয়ার আইডি (Player ID / UID):';
        targetInput.placeholder = "আপনার গেম আইডি নম্বর দিন";
    } else if (category === "facebook") {
        dynamicLabel.innerHTML = '<i class="fa-solid fa-link"></i> ফেসবুক পেজ বা পোস্ট লিংক:';
        targetInput.placeholder = "https://facebook.com/...";
    } else if (category === "youtube") {
        dynamicLabel.innerHTML = '<i class="fa-solid fa-link"></i> ইউটিউব ভিডিও বা চ্যানেল লিংক:';
        targetInput.placeholder = "https://youtube.com/...";
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
    document.getElementById("order").scrollIntoView({ behavior: 'smooth' });
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
    document.getElementById("payNumber").innerText = paymentNumbers[method];
}

// নম্বর কপি ফাংশন
function copyNumber() {
    const num = document.getElementById("payNumber").innerText;
    navigator.clipboard.writeText(num);
    alert("পেমেন্ট নম্বর কপি করা হয়েছে: " + num);
}

// অর্ডার সাবমিট করা
document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const category = document.getElementById("serviceCategory").value;
    const packageIndex = document.getElementById("packageSelect").value;
    const target = document.getElementById("targetInput").value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const senderNumber = document.getElementById("senderNumber").value;
    const trxId = document.getElementById("trxId").value;
    
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
        date: new Date().toLocaleString("bn-BD")
    };

    // লোকাল স্টোরেজে অর্ডার সেভ করা (ট্র্যাকিংয়ের জন্য)
    let orders = JSON.parse(localStorage.getItem("userOrders")) || {};
    orders[orderId] = orderData;
    localStorage.setItem("userOrders", JSON.stringify(orders));

    alert(`আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!\n\nআপনার Order ID: ${orderId}\n\nএই আইডিটি সংরক্ষণ করুন অর্ডার স্ট্যাটাস ট্র্যাক করার জন্য।`);

    // ফর্ম রিসেট
    document.getElementById("orderForm").reset();
    document.getElementById("totalPrice").innerText = "0";
});

// অর্ডার স্ট্যাটাস ট্র্যাকিং
function trackOrder() {
    const trackInput = document.getElementById("trackInput").value.trim();
    const trackResult = document.getElementById("trackResult");

    if (!trackInput) {
        trackResult.innerHTML = "<p style='color: #ef4444;'>অনুগ্রহ করে একটি সঠিক Order ID দিন।</p>";
        return;
    }

    const orders = JSON.parse(localStorage.getItem("userOrders")) || {};
    const order = orders[trackInput];

    if (order) {
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
}
