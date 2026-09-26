// ======================================================
// 1. FIREBASE CONFIGURATION
// ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyCW6uxjJIwb8JorzDJXm9YntKu2vNLuvNU",
    authDomain: "my-web-8b105.firebaseapp.com",
    databaseURL: "https://my-web-8b105-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "my-web-8b105",
    storageBucket: "my-web-8b105.firebasestorage.app",
    messagingSenderId: "554855600124",
    appId: "1:554855600124:web:3bcb88dca98908b6d7ec79"
};


// Firebase একবারই Initialize হবে
if (
    typeof firebase !== "undefined" &&
    firebase.apps &&
    firebase.apps.length === 0
) {
    firebase.initializeApp(firebaseConfig);
}


// ======================================================
// 2. PACKAGE DATA
// ======================================================

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


// ======================================================
// 3. UPDATE PACKAGE OPTIONS
// ======================================================

function updatePackageOptions() {

    const categorySelect =
        document.getElementById("serviceCategory");

    const packageSelect =
        document.getElementById("packageSelect");

    if (!categorySelect || !packageSelect) {
        console.error(
            "serviceCategory অথবা packageSelect পাওয়া যায়নি!"
        );
        return;
    }

    const category =
        categorySelect.value.trim().toLowerCase();


    // পুরোনো package মুছে ফেলি
    packageSelect.innerHTML = "";


    // Default option
    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    if (category) {

        defaultOption.textContent =
            "-- প্যাকেজ বেছে নিন --";

    } else {

        defaultOption.textContent =
            "-- প্রথমে ক্যাটাগরি নির্বাচন করুন --";
    }

    defaultOption.selected = true;

    packageSelect.appendChild(defaultOption);


    // Category না থাকলে
    if (!category) {

        packageSelect.disabled = false;

        updateDynamicInput("");

        calculatePrice();

        return;
    }


    // Package data পাওয়া না গেলে
    if (!packagesData[category]) {

        console.error(
            "এই category-এর package পাওয়া যায়নি:",
            category
        );

        packageSelect.disabled = false;

        updateDynamicInput(category);

        calculatePrice();

        return;
    }


    // Package যোগ করা
    packagesData[category].forEach(function (pkg) {

        const option =
            document.createElement("option");

        option.value =
            String(pkg.price);

        option.dataset.name =
            pkg.name;

        option.textContent =
            pkg.name + " - " + pkg.price + " BDT";

        packageSelect.appendChild(option);

    });


    // Select অবশ্যই চালু থাকবে
    packageSelect.disabled = false;

    // প্রথম option selected
    packageSelect.selectedIndex = 0;


    updateDynamicInput(category);

    calculatePrice();


    console.log(
        "Package loaded:",
        category,
        packagesData[category]
    );
}


// ======================================================
// 4. DYNAMIC INPUT
// ======================================================

function updateDynamicInput(category) {

    const label =
        document.getElementById("dynamicLabel");

    const input =
        document.getElementById("targetInput");

    if (!label || !input) return;


    if (category === "ff") {

        label.innerHTML =
            '<i class="fa-solid fa-id-card"></i> Free Fire Player ID:';

        input.placeholder =
            "আপনার Free Fire Player ID দিন";


    } else if (category === "pubg") {

        label.innerHTML =
            '<i class="fa-solid fa-id-card"></i> PUBG Player ID:';

        input.placeholder =
            "আপনার PUBG Player ID দিন";


    } else if (category === "facebook") {

        label.innerHTML =
            '<i class="fa-brands fa-facebook"></i> Facebook Page/Post Link:';

        input.placeholder =
            "Facebook Page বা Post Link দিন";


    } else if (category === "youtube") {

        label.innerHTML =
            '<i class="fa-brands fa-youtube"></i> YouTube Video/Channel Link:';

        input.placeholder =
            "YouTube Video বা Channel Link দিন";


    } else {

        label.innerHTML =
            '<i class="fa-solid fa-id-card"></i> প্লেয়ার আইডি / লিংক:';

        input.placeholder =
            "এখানে আইডি বা লিংক দিন";
    }
}


// ======================================================
// 5. CALCULATE PRICE
// ======================================================

function calculatePrice() {

    const packageSelect =
        document.getElementById("packageSelect");

    const priceDisplay =
        document.getElementById("totalPrice");

    if (!packageSelect || !priceDisplay) return;


    if (!packageSelect.value) {

        priceDisplay.textContent = "0";

        return;
    }


    const price =
        Number(packageSelect.value);


    if (isNaN(price)) {

        priceDisplay.textContent = "0";

        return;
    }


    priceDisplay.textContent =
        price.toString();
}


// ======================================================
// 6. PAYMENT INFORMATION
// ======================================================

function updatePaymentInfo(method) {

    const payNumber =
        document.getElementById("payNumber");

    if (!payNumber) return;


    if (method === "bKash") {

        payNumber.textContent =
            "01700000000";


    } else if (method === "Nagad") {

        payNumber.textContent =
            "01800000000";


    } else if (method === "Rocket") {

        payNumber.textContent =
            "01900000000";


    } else {

        payNumber.textContent =
            "01700000000";
    }
}


// ======================================================
// 7. COPY PAYMENT NUMBER
// ======================================================

function copyNumber() {

    const payNumber =
        document.getElementById("payNumber");

    if (!payNumber) return;


    const number =
        payNumber.textContent.trim();


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(number)
            .then(function () {

                alert(
                    "নম্বর কপি করা হয়েছে: " +
                    number
                );

            })
            .catch(function () {

                alert(
                    "নম্বর: " +
                    number
                );

            });

    } else {

        alert(
            "নম্বর: " +
            number
        );
    }
}


// ======================================================
// 8. SERVICE CARD CLICK
// ======================================================

function selectServiceCategory(type) {

    const categorySelect =
        document.getElementById("serviceCategory");

    if (!categorySelect) return;


    if (type === "gaming") {

        categorySelect.value = "ff";


    } else if (type === "facebook") {

        categorySelect.value = "facebook";


    } else if (type === "youtube") {

        categorySelect.value = "youtube";
    }


    // Package load
    updatePackageOptions();


    // Order section-এ নিয়ে যাবে
    const orderSection =
        document.getElementById("order");

    if (orderSection) {

        orderSection.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ======================================================
// 9. GENERATE ORDER ID
// ======================================================

function generateOrderId() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return "ORD-" + randomNumber;
}


// ======================================================
// 10. DOM READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const categorySelect =
            document.getElementById(
                "serviceCategory"
            );

        const packageSelect =
            document.getElementById(
                "packageSelect"
            );

        const orderForm =
            document.getElementById(
                "orderForm"
            );


        // ----------------------------------------------
        // প্রথমবার Package Load
        // ----------------------------------------------

        updatePackageOptions();


        // ----------------------------------------------
        // Category Change
        // ----------------------------------------------

        if (categorySelect) {

            categorySelect.addEventListener(
                "change",
                function () {

                    updatePackageOptions();

                }
            );
        }


        // ----------------------------------------------
        // Package Change
        // ----------------------------------------------

        if (packageSelect) {

            packageSelect.addEventListener(
                "change",
                function () {

                    calculatePrice();

                }
            );
        }


        // ----------------------------------------------
        // Payment Method
        // ----------------------------------------------

        const paymentMethods =
            document.querySelectorAll(
                'input[name="paymentMethod"]'
            );


        paymentMethods.forEach(
            function (radio) {

                radio.addEventListener(
                    "change",
                    function () {

                        updatePaymentInfo(
                            this.value
                        );

                    }
                );

            }
        );


        // প্রথম Payment Number
        const checkedPayment =
            document.querySelector(
                'input[name="paymentMethod"]:checked'
            );


        if (checkedPayment) {

            updatePaymentInfo(
                checkedPayment.value
            );
        }


        // ----------------------------------------------
        // FORM SUBMIT
        // ----------------------------------------------

        if (orderForm) {

            orderForm.addEventListener(
                "submit",
                async function (e) {

                    e.preventDefault();


                    if (
                        typeof firebase === "undefined" ||
                        !firebase.apps.length
                    ) {

                        alert(
                            "Firebase সংযোগ পাওয়া যায়নি।\n" +
                            "দয়া করে কিছুক্ষণ পরে আবার চেষ্টা করুন।"
                        );

                        return;
                    }


                    const category =
                        categorySelect
                            ? categorySelect.value
                            : "";


                    const selectedPackage =
                        packageSelect
                            ? packageSelect.options[
                                packageSelect.selectedIndex
                              ]
                            : null;


                    const targetInput =
                        document.getElementById(
                            "targetInput"
                        );


                    const senderNumber =
                        document.getElementById(
                            "senderNumber"
                        );


                    const trxId =
                        document.getElementById(
                            "trxId"
                        );


                    const submitBtn =
                        document.getElementById(
                            "submitBtn"
                        );


                    // ----------------------------------
                    // Validation
                    // ----------------------------------

                    if (!category) {

                        alert(
                            "দয়া করে সার্ভিসের ধরন নির্বাচন করুন!"
                        );

                        return;
                    }


                    if (
                        !packageSelect ||
                        !packageSelect.value
                    ) {

                        alert(
                            "দয়া করে একটি প্যাকেজ নির্বাচন করুন!"
                        );

                        return;
                    }


                    if (
                        !targetInput ||
                        !targetInput.value.trim()
                    ) {

                        alert(
                            "দয়া করে Player ID / Link দিন!"
                        );

                        return;
                    }


                    if (
                        !senderNumber ||
                        !senderNumber.value.trim()
                    ) {

                        alert(
                            "যে নম্বর থেকে টাকা পাঠিয়েছেন সেটি দিন!"
                        );

                        return;
                    }


                    if (
                        !trxId ||
                        !trxId.value.trim()
                    ) {

                        alert(
                            "Transaction ID দিন!"
                        );

                        return;
                    }


                    const selectedPayment =
                        document.querySelector(
                            'input[name="paymentMethod"]:checked'
                        );


                    const paymentMethod =
                        selectedPayment
                            ? selectedPayment.value
                            : "N/A";


                    const categoryText =
                        categorySelect.options[
                            categorySelect.selectedIndex
                        ].text;


                    const packageName =
                        selectedPackage
                            ? selectedPackage.dataset.name
                            : "";


                    const price =
                        Number(
                            packageSelect.value
                        );


                    const orderId =
                        generateOrderId();


                    const orderDate =
                        new Date().toLocaleString(
                            "bn-BD"
                        );


                    if (submitBtn) {

                        submitBtn.disabled = true;

                        submitBtn.innerHTML =
                            '<i class="fa-solid fa-spinner fa-spin"></i> অর্ডার প্রসেস হচ্ছে...';
                    }


                    try {

                        const db =
                            firebase.firestore();


                        await db
                            .collection("orders")
                            .doc(orderId)
                            .set({

                                orderId: orderId,

                                category: category,

                                service: categoryText,

                                package: packageName,

                                target:
                                    targetInput.value.trim(),

                                price: price,

                                paymentMethod:
                                    paymentMethod,

                                senderNumber:
                                    senderNumber.value.trim(),

                                trxId:
                                    trxId.value.trim(),

                                status:
                                    "Pending (অপেক্ষমাণ)",

                                date:
                                    orderDate,

                                createdAt:
                                    firebase.firestore
                                        .FieldValue
                                        .serverTimestamp()

                            });


                        alert(
                            "অর্ডার সফলভাবে গ্রহণ করা হয়েছে!\n\n" +
                            "আপনার Order ID:\n" +
                            orderId +
                            "\n\nএই Order ID সংরক্ষণ করুন।"
                        );


                        orderForm.reset();


                        updatePackageOptions();

                        calculatePrice();

                        updatePaymentInfo(
                            "bKash"
                        );


                    } catch (error) {

                        console.error(
                            "Order submit error:",
                            error
                        );


                        alert(
                            "অর্ডার পাঠাতে সমস্যা হয়েছে!\n\n" +
                            "কারণ: " +
                            error.message
                        );


                    } finally {

                        if (submitBtn) {

                            submitBtn.disabled =
                                false;

                            submitBtn.innerHTML =
                                '<i class="fa-solid fa-paper-plane"></i> অর্ডার সাবমিট করুন';
                        }
                    }

                }
            );
        }

    }
);


// ======================================================
// 11. ORDER TRACKING
// ======================================================

async function trackOrder() {

    const trackInputObj =
        document.getElementById(
            "trackInput"
        );

    const trackResult =
        document.getElementById(
            "trackResult"
        );


    if (
        !trackInputObj ||
        !trackResult
    ) {
        return;
    }


    const orderId =
        trackInputObj.value.trim();


    if (!orderId) {

        alert(
            "দয়া করে Order ID দিন!"
        );

        return;
    }


    if (
        typeof firebase === "undefined" ||
        !firebase.apps.length
    ) {

        trackResult.innerHTML =
            '<p style="color:#ef4444;">Firebase সংযোগ পাওয়া যায়নি।</p>';

        return;
    }


    trackResult.innerHTML =
        '<p style="color:#f59e0b;">অর্ডার খোঁজা হচ্ছে...</p>';


    try {

        const db =
            firebase.firestore();


        const doc =
            await db
                .collection("orders")
                .doc(orderId)
                .get();


        if (!doc.exists) {

            trackResult.innerHTML =
                '<p style="color:#ef4444; margin-top:10px;">' +
                'কোনো অর্ডার পাওয়া যায়নি! সঠিক Order ID দিন।' +
                '</p>';

            return;
        }


        const data =
            doc.data();


        let statusColor =
            "#f59e0b";


        if (
            data.status &&
            data.status.includes(
                "Completed"
            )
        ) {

            statusColor =
                "#22c55e";


        } else if (
            data.status &&
            data.status.includes(
                "Cancelled"
            )
        ) {

            statusColor =
                "#ef4444";
        }


        trackResult.innerHTML = `

            <div style="
                background:#1e293b;
                padding:18px;
                border-radius:10px;
                margin-top:15px;
                border:1px solid #334155;
                color:#fff;
            ">

                <p>
                    <b>অর্ডার আইডি:</b>
                    ${escapeHtml(
                        data.orderId || orderId
                    )}
                </p>

                <p>
                    <b>সার্ভিস:</b>
                    ${escapeHtml(
                        data.service || "N/A"
                    )}
                </p>

                <p>
                    <b>প্যাকেজ:</b>
                    ${escapeHtml(
                        data.package || "N/A"
                    )}
                </p>

                <p>
                    <b>মূল্য:</b>
                    ${escapeHtml(
                        String(
                            data.price || "0"
                        )
                    )} BDT
                </p>

                <p>
                    <b>স্ট্যাটাস:</b>

                    <span style="
                        color:${statusColor};
                        font-weight:bold;
                    ">
                        ${escapeHtml(
                            data.status ||
                            "Pending"
                        )}
                    </span>
                </p>

                <p>
                    <b>তারিখ:</b>
                    ${escapeHtml(
                        data.date || "N/A"
                    )}
                </p>

            </div>
        `;


    } catch (error) {

        console.error(
            "Tracking error:",
            error
        );


        trackResult.innerHTML =
            '<p style="color:#ef4444;">' +
            'অর্ডার খুঁজতে সমস্যা হয়েছে: ' +
            escapeHtml(
                error.message
            ) +
            '</p>';
    }
}


// ======================================================
// 12. HTML ESCAPE
// ======================================================

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;
}