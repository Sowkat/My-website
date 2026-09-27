const firebaseConfig={
 apiKey:"AIzaSyCW6uxjJIwb8JorzDJXm9YntKu2vNLuvNU",
 authDomain:"my-web-8b105.firebaseapp.com",
 databaseURL:"https://my-web-8b105-default-rtdb.asia-southeast1.firebasedatabase.app",
 projectId:"my-web-8b105",storageBucket:"my-web-8b105.firebasestorage.app",
 messagingSenderId:"554855600124",appId:"1:554855600124:web:3bcb88dca98908b6d7ec79"
};
let db=null;
if(typeof firebase!=="undefined"){try{if(!firebase.apps.length)firebase.initializeApp(firebaseConfig);db=firebase.database();}catch(e){console.error(e)}}

const fallbackPackages={
 ff:[{name:"115 Diamond",price:80},{name:"240 Diamond",price:160},{name:"610 Diamond",price:400},{name:"Weekly Membership",price:160},{name:"Monthly Membership",price:750}],
 pubg:[{name:"60 UC",price:100},{name:"325 UC",price:480},{name:"660 UC",price:950},{name:"1800 UC",price:2400}],
 facebook:[{name:"1000 Facebook Page Likes",price:300},{name:"1000 Facebook Followers",price:350},{name:"Post Boost (1 Day)",price:250}],
 youtube:[{name:"1000 YouTube Views",price:200},{name:"100 Subscriber",price:400},{name:"4000 Hours Watch Time",price:3500}]
};
let packagesData={...fallbackPackages};
let settings={paymentNumbers:{bKash:"01700000000",Nagad:"01800000000",Rocket:"01900000000"},whatsapp:"8801960174982",facebook:"https://facebook.com",support:"01700000000"};

function escapeHtml(v){const d=document.createElement("div");d.textContent=v==null?"":String(v);return d.innerHTML}
async function loadRemoteData(){
 if(!db)return;
 try{
  const [p,s]=await Promise.all([db.ref("packages").once("value"),db.ref("settings").once("value")]);
  if(p.exists()){
   const raw=p.val(); const out={};
   Object.keys(raw).forEach(k=>{if(raw[k]&&raw[k].active!==false)out[k]=Array.isArray(raw[k])?raw[k]:Object.values(raw[k]).filter(x=>x&&x.active!==false)});
   if(Object.keys(out).length)packagesData=out;
  }
  if(s.exists())settings={...settings,...s.val(),paymentNumbers:{...settings.paymentNumbers,...(s.val().paymentNumbers||{})}};
 }catch(e){console.warn("Remote settings unavailable; fallback used.",e)}
 applySettings(); updatePackageOptions();
}
function applySettings(){
 const n=document.getElementById("payNumber"), f=document.getElementById("footerContact");
 const method=document.querySelector('input[name="paymentMethod"]:checked')?.value||"bKash";
 if(n)n.textContent=settings.paymentNumbers?.[method]||"";
 if(f)f.textContent="যোগাযোগ: "+(settings.support||"");
 const wa=document.querySelector(".whatsapp");if(wa&&settings.whatsapp)wa.href="https://wa.me/"+String(settings.whatsapp).replace(/\D/g,"");
 const fb=document.querySelector(".facebook");if(fb&&settings.facebook)fb.href=settings.facebook;
}
function updatePaymentInfo(method){const n=document.getElementById("payNumber");if(n)n.textContent=settings.paymentNumbers?.[method]||""}
function updatePackageOptions(){
 const c=document.getElementById("serviceCategory"),p=document.getElementById("packageSelect");if(!c||!p)return;
 p.innerHTML='<option value="">-- প্যাকেজ বেছে নিন --</option>';
 const list=packagesData[c.value]||[];
 list.forEach((x,i)=>{const o=document.createElement("option");o.value=String(x.price);o.dataset.name=x.name;o.dataset.id=x.id||i;o.textContent=x.name+" - "+x.price+" BDT";p.appendChild(o)});
 updateDynamicInput(c.value);calculatePrice();
}
function updateDynamicInput(c){
 const l=document.getElementById("dynamicLabel"),i=document.getElementById("targetInput");if(!l||!i)return;
 const map={ff:["Free Fire Player ID","আপনার Free Fire Player ID দিন"],pubg:["PUBG Player ID","আপনার PUBG Player ID দিন"],facebook:["Facebook Page/Post Link","Facebook Page বা Post Link দিন"],youtube:["YouTube Video/Channel Link","YouTube Video বা Channel Link দিন"]};
 const a=map[c]||["Player ID / Link","এখানে আইডি বা লিংক দিন"];l.textContent=a[0]+":";i.placeholder=a[1];
}
function calculatePrice(){const p=document.getElementById("packageSelect"),t=document.getElementById("totalPrice");if(t)t.textContent=p&&p.value?Number(p.value):0}
function copyNumber(){const n=document.getElementById("payNumber")?.textContent.trim()||"";navigator.clipboard?.writeText(n).then(()=>alert("নম্বর কপি হয়েছে: "+n)).catch(()=>alert("নম্বর: "+n))}
function selectServiceCategory(type){const c=document.getElementById("serviceCategory");if(!c)return;c.value=type==="gaming"?"ff":type;updatePackageOptions();document.getElementById("order")?.scrollIntoView({behavior:"smooth"})}
function generateOrderId(){return"ORD-"+Math.floor(100000+Math.random()*900000)}
async function trackOrder(){
 const id=document.getElementById("trackInput")?.value.trim(),r=document.getElementById("trackResult");if(!r)return;
 if(!id){alert("দয়া করে Order ID দিন!");return} if(!db){r.innerHTML='<p class="error-text">Database সংযোগ পাওয়া যায়নি।</p>';return}
 r.innerHTML='<p class="loading-text">অর্ডার খোঁজা হচ্ছে...</p>';
 try{const s=await db.ref("orders/"+id).once("value");if(!s.exists()){r.innerHTML='<p class="error-text">কোনো অর্ডার পাওয়া যায়নি!</p>';return}
 const d=s.val(),status=d.status||"Pending (অপেক্ষমাণ)";r.innerHTML=`<div class="status-card"><p><b>অর্ডার:</b> ${escapeHtml(d.orderId||id)}</p><p><b>সার্ভিস:</b> ${escapeHtml(d.service||"-")}</p><p><b>প্যাকেজ:</b> ${escapeHtml(d.package||"-")}</p><p><b>মূল্য:</b> ${escapeHtml(d.price||0)} BDT</p><p><b>স্ট্যাটাস:</b> <span class="status-badge">${escapeHtml(status)}</span></p><p><b>তারিখ:</b> ${escapeHtml(d.date||"-")}</p></div>`;
 }catch(e){r.innerHTML='<p class="error-text">'+escapeHtml(e.message)+'</p>'}
}
document.addEventListener("DOMContentLoaded",()=>{
 const c=document.getElementById("serviceCategory"),p=document.getElementById("packageSelect"),f=document.getElementById("orderForm");
 c?.addEventListener("change",updatePackageOptions);p?.addEventListener("change",calculatePrice);
 document.querySelectorAll('input[name="paymentMethod"]').forEach(x=>x.addEventListener("change",()=>{updatePaymentInfo(x.value)}));
 applySettings();loadRemoteData();
 f?.addEventListener("submit",async e=>{
  e.preventDefault();if(!db){alert("Firebase সংযোগ পাওয়া যায়নি।");return}
  const pkg=p.options[p.selectedIndex],target=document.getElementById("targetInput"),sender=document.getElementById("senderNumber"),trx=document.getElementById("trxId"),btn=document.getElementById("submitBtn");
  if(!c.value||!p.value||!target.value.trim()||!sender.value.trim()||!trx.value.trim()){alert("সব তথ্য পূরণ করুন।");return}
  const orderId=generateOrderId(),pay=document.querySelector('input[name="paymentMethod"]:checked')?.value||"N/A";
  const data={orderId,category:c.value,service:c.options[c.selectedIndex].text,package:pkg.dataset.name||"",target:target.value.trim(),price:Number(p.value),paymentMethod:pay,senderNumber:sender.value.trim(),trxId:trx.value.trim(),status:"Pending (অপেক্ষমাণ)",date:new Date().toLocaleString("bn-BD"),createdAt:firebase.database.ServerValue.TIMESTAMP};
  btn.disabled=true;btn.innerHTML="অর্ডার প্রসেস হচ্ছে...";
  try{await db.ref("orders/"+orderId).set(data);alert("অর্ডার সফল হয়েছে!\nOrder ID: "+orderId);f.reset();updatePackageOptions();applySettings()}catch(err){alert("অর্ডার পাঠাতে সমস্যা হয়েছে:\n"+err.message)}finally{btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-paper-plane"></i> অর্ডার সাবমিট করুন'}
 });
});