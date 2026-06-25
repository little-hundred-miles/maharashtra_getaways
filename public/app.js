const savedExperiences = JSON.parse(localStorage.getItem("mg-saved") || localStorage.getItem("sw-saved") || "[]");

const state = {
  experiences: [],
  filters: { category: "all", region: "all" },
  selected: null,
  saved: new Set(savedExperiences)
};

if (!localStorage.getItem("mg-saved") && savedExperiences.length) {
  localStorage.setItem("mg-saved", JSON.stringify(savedExperiences));
}

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const currency = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const COUNTRY_CODES = `
Afghanistan|+93
Albania|+355
Algeria|+213
Andorra|+376
Angola|+244
Antigua and Barbuda|+1-268
Argentina|+54
Armenia|+374
Australia|+61
Austria|+43
Azerbaijan|+994
Bahamas|+1-242
Bahrain|+973
Bangladesh|+880
Barbados|+1-246
Belarus|+375
Belgium|+32
Belize|+501
Benin|+229
Bhutan|+975
Bolivia|+591
Bosnia and Herzegovina|+387
Botswana|+267
Brazil|+55
Brunei|+673
Bulgaria|+359
Burkina Faso|+226
Burundi|+257
Cabo Verde|+238
Cambodia|+855
Cameroon|+237
Canada|+1
Central African Republic|+236
Chad|+235
Chile|+56
China|+86
Colombia|+57
Comoros|+269
Congo, Democratic Republic|+243
Congo, Republic|+242
Costa Rica|+506
Cote d'Ivoire|+225
Croatia|+385
Cuba|+53
Cyprus|+357
Czechia|+420
Denmark|+45
Djibouti|+253
Dominica|+1-767
Dominican Republic|+1-809
Ecuador|+593
Egypt|+20
El Salvador|+503
Equatorial Guinea|+240
Eritrea|+291
Estonia|+372
Eswatini|+268
Ethiopia|+251
Fiji|+679
Finland|+358
France|+33
Gabon|+241
Gambia|+220
Georgia|+995
Germany|+49
Ghana|+233
Greece|+30
Grenada|+1-473
Guatemala|+502
Guinea|+224
Guinea-Bissau|+245
Guyana|+592
Haiti|+509
Honduras|+504
Hungary|+36
Iceland|+354
India|+91
Indonesia|+62
Iran|+98
Iraq|+964
Ireland|+353
Israel|+972
Italy|+39
Jamaica|+1-876
Japan|+81
Jordan|+962
Kazakhstan|+7
Kenya|+254
Kiribati|+686
Kosovo|+383
Kuwait|+965
Kyrgyzstan|+996
Laos|+856
Latvia|+371
Lebanon|+961
Lesotho|+266
Liberia|+231
Libya|+218
Liechtenstein|+423
Lithuania|+370
Luxembourg|+352
Madagascar|+261
Malawi|+265
Malaysia|+60
Maldives|+960
Mali|+223
Malta|+356
Marshall Islands|+692
Mauritania|+222
Mauritius|+230
Mexico|+52
Micronesia|+691
Moldova|+373
Monaco|+377
Mongolia|+976
Montenegro|+382
Morocco|+212
Mozambique|+258
Myanmar|+95
Namibia|+264
Nauru|+674
Nepal|+977
Netherlands|+31
New Zealand|+64
Nicaragua|+505
Niger|+227
Nigeria|+234
North Korea|+850
North Macedonia|+389
Norway|+47
Oman|+968
Pakistan|+92
Palau|+680
Palestine|+970
Panama|+507
Papua New Guinea|+675
Paraguay|+595
Peru|+51
Philippines|+63
Poland|+48
Portugal|+351
Qatar|+974
Romania|+40
Russia|+7
Rwanda|+250
Saint Kitts and Nevis|+1-869
Saint Lucia|+1-758
Saint Vincent and the Grenadines|+1-784
Samoa|+685
San Marino|+378
Sao Tome and Principe|+239
Saudi Arabia|+966
Senegal|+221
Serbia|+381
Seychelles|+248
Sierra Leone|+232
Singapore|+65
Slovakia|+421
Slovenia|+386
Solomon Islands|+677
Somalia|+252
South Africa|+27
South Korea|+82
South Sudan|+211
Spain|+34
Sri Lanka|+94
Sudan|+249
Suriname|+597
Sweden|+46
Switzerland|+41
Syria|+963
Taiwan|+886
Tajikistan|+992
Tanzania|+255
Thailand|+66
Timor-Leste|+670
Togo|+228
Tonga|+676
Trinidad and Tobago|+1-868
Tunisia|+216
Turkiye|+90
Turkmenistan|+993
Tuvalu|+688
Uganda|+256
Ukraine|+380
United Arab Emirates|+971
United Kingdom|+44
United States|+1
Uruguay|+598
Uzbekistan|+998
Vanuatu|+678
Vatican City|+39
Venezuela|+58
Vietnam|+84
Yemen|+967
Zambia|+260
Zimbabwe|+263
`.trim().split("\n").map((entry) => {
  const [country, code] = entry.split("|");
  return { country, code };
});

function iconHeart() {
  return `<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>`;
}

function cardTemplate(item) {
  const saved = state.saved.has(item.id);
  return `
    <article class="experience-card" data-id="${item.id}" tabindex="0">
      <div class="card-image">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <span class="card-tag">${item.tag}</span>
        <button class="save-btn ${saved ? "saved" : ""}" data-save="${item.id}" aria-label="${saved ? "Remove from" : "Add to"} saved adventures">${iconHeart()}</button>
      </div>
      <div class="card-body">
        <div class="card-meta"><span>${item.location}</span><i></i><span>${item.category}</span></div>
        <h3>${item.title}</h3>
        <div class="card-facts">
          <span>${item.duration}</span><span>${item.difficulty}</span><span><b>★</b> ${item.rating} (${item.reviews})</span>
        </div>
        <div class="card-bottom">
          <div class="price"><small>from / person</small><strong>${currency(item.price)}</strong><del>${currency(item.originalPrice)}</del></div>
          <span>↗</span>
        </div>
      </div>
    </article>`;
}

function renderExperiences() {
  const filtered = state.experiences.filter((item) => {
    const categoryMatch = state.filters.category === "all" || item.category === state.filters.category;
    const regionMatch = state.filters.region === "all" || item.region === state.filters.region;
    return categoryMatch && regionMatch;
  });
  $("#experienceGrid").innerHTML = filtered.map(cardTemplate).join("");
  $("#emptyState").classList.toggle("hidden", filtered.length > 0);
  $("#experienceGrid").classList.toggle("hidden", filtered.length === 0);
}

function updateSavedCount() {
  $("#savedCount").textContent = state.saved.size;
  $("#savedCount").classList.toggle("visible", state.saved.size > 0);
}

function toggleSave(id) {
  state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
  localStorage.setItem("mg-saved", JSON.stringify([...state.saved]));
  updateSavedCount();
  renderExperiences();
  showToast(state.saved.has(id) ? "Saved for later" : "Removed from saved");
}

function detailTemplate(item) {
  return `
    <div class="detail-hero">
      <img src="${item.image}" alt="${item.title}">
      <div class="detail-hero-copy">
        <span class="eyebrow light">${item.location} · ${item.category}</span>
        <h2 id="detailTitle">${item.title}</h2>
        <p>★ ${item.rating} from ${item.reviews} verified reviews</p>
      </div>
    </div>
    <div class="detail-body">
      <div class="detail-stats">
        <div><small>Duration</small><b>${item.duration}</b></div>
        <div><small>Difficulty</small><b>${item.difficulty}</b></div>
        <div><small>Group</small><b>${item.groupSize}</b></div>
        <div><small>Trail detail</small><b>${item.altitude}</b></div>
      </div>
      <p class="detail-summary">${item.summary}</p>
      <h3>Why you'll love it</h3>
      <ul class="highlight-list">${item.highlights.map((value) => `<li>${value}</li>`).join("")}</ul>
      <h3>Your itinerary</h3>
      <div>${item.itinerary.map((day) => `<div class="itinerary-item"><small>${day.day}</small><h4>${day.title}</h4><p>${day.detail}</p></div>`).join("")}</div>
      <h3>What's included</h3>
      <ul class="included-list">${item.included.map((value) => `<li>${value}</li>`).join("")}</ul>
      <h3>Your local operator</h3>
      <div class="operator-card">
        <div class="operator-avatar">${item.operator.name.charAt(0)}</div>
        <div><b>${item.operator.name}</b> <span class="verified">● Verified</span><p>★ ${item.operator.rating} · ${item.operator.trips} trips · Hosting since ${item.operator.since}</p></div>
      </div>
    </div>
    <div class="detail-bookbar">
      <div><strong>${currency(item.price)}</strong> <small>/ person</small></div>
      <button class="primary-btn" data-book="${item.id}">Check dates & book</button>
    </div>`;
}

function openDetail(id) {
  state.selected = state.experiences.find((item) => item.id === id);
  if (!state.selected) return;
  $("#detailContent").innerHTML = detailTemplate(state.selected);
  $("#detailModal").classList.add("open");
  $("#detailModal").setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  $(".modal-close", $("#detailModal")).focus();
}

function closeModal(id) {
  $(id).classList.remove("open");
  $(id).setAttribute("aria-hidden", "true");
  if (!$$(".modal.open").length) document.body.classList.remove("modal-open");
}

function bookingTemplate(item) {
  const tomorrow = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
  return `
    <div class="booking-header">
      <h2 id="bookingTitle">Almost adventure time.</h2>
      <p>Tell us who's coming. Your operator receives the trip details after secure payment.</p>
    </div>
    <div class="booking-experience">
      <img src="${item.image}" alt="">
      <div><h3>${item.title}</h3><span>${item.location} · Hosted by ${item.operator.name}</span></div>
    </div>
    <form id="bookingForm">
      <div class="form-grid">
        <div class="field"><label for="tripDate">Trip date</label><input id="tripDate" name="date" type="date" min="${tomorrow}" value="${tomorrow}" required></div>
        <div class="field"><label for="guests">Guests</label><select id="guests" name="guests">${Array.from({ length: 20 }, (_, index) => index + 1).map((n) => `<option value="${n}">${n} ${n === 1 ? "guest" : "guests"}</option>`).join("")}</select></div>
        <div class="field full"><label for="guestName">Full name</label><input id="guestName" name="name" autocomplete="name" required placeholder="Your full name"></div>
        <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required></div>
        <div class="field">
          <label for="phone">Phone</label>
          <div class="phone-field">
            <select id="countryCode" name="countryCode" aria-label="Country code">
              ${COUNTRY_CODES.map(({ country, code }) => `<option value="${code}"${country === "India" ? " selected" : ""}>${country} (${code})</option>`).join("")}
            </select>
            <input id="phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" required aria-label="Phone number">
          </div>
        </div>
      </div>
      <div class="booking-summary" id="priceSummary"></div>
      <button class="primary-btn booking-submit" type="submit">Continue to secure payment · <span id="payAmount"></span></button>
      <p class="secure-note">🔒 Payment details are encrypted and handled by your configured PCI-compliant payment provider.</p>
    </form>`;
}

function updatePrice() {
  const item = state.selected;
  const guests = Number($("#guests")?.value || 1);
  const subtotal = item.price * guests;
  const fee = Math.round(subtotal * 0.04);
  $("#priceSummary").innerHTML = `
    <div class="summary-line"><span>${currency(item.price)} × ${guests} ${guests === 1 ? "guest" : "guests"}</span><span>${currency(subtotal)}</span></div>
    <div class="summary-line"><span>Platform & trip support</span><span>${currency(fee)}</span></div>
    <div class="summary-line total"><span>Total</span><span>${currency(subtotal + fee)}</span></div>`;
  $("#payAmount").textContent = currency(subtotal + fee);
}

function openBooking(id) {
  state.selected = state.experiences.find((item) => item.id === id);
  closeModal("#detailModal");
  $("#bookingContent").innerHTML = bookingTemplate(state.selected);
  $("#bookingModal").classList.add("open");
  $("#bookingModal").setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  updatePrice();
  $("#guests").addEventListener("change", updatePrice);
  $("#bookingForm").addEventListener("submit", submitBooking);
}

async function submitBooking(event) {
  event.preventDefault();
  const button = $(".booking-submit");
  const data = Object.fromEntries(new FormData(event.currentTarget));
  data.phone = `${data.countryCode} ${data.phone.trim()}`;
  delete data.countryCode;
  button.disabled = true;
  button.textContent = "Authorizing securely…";
  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, experienceId: state.selected.id, guests: Number(data.guests) })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    $$(".booking-steps span").forEach((step) => step.classList.add("active"));
    $("#bookingContent").innerHTML = `
      <div class="success-view">
        <div class="success-icon">✓</div>
        <h2>Your getaway is booked.</h2>
        <p>Your place on <b>${state.selected.title}</b> is confirmed.<br>Your local operator will be in touch with the meeting details.</p>
        <div class="booking-reference">${result.data.id}</div>
        <p>A confirmation has been prepared for ${result.data.email}.</p>
        <button class="primary-btn" data-close-booking>Back to exploring</button>
      </div>`;
  } catch (error) {
    showToast(error.message || "Something went wrong. Please try again.");
    button.disabled = false;
    button.innerHTML = `Continue to secure payment · <span id="payAmount"></span>`;
    updatePrice();
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function applyFilters() {
  state.filters.region = $("#destinationFilter").value;
  state.filters.category = $("#categoryFilter").value;
  $$("#filterPills button").forEach((button) => button.classList.toggle("active", button.dataset.filter === state.filters.category));
  renderExperiences();
  $("#experiences").scrollIntoView({ behavior: "smooth" });
}

async function init() {
  try {
    const response = await fetch("/api/experiences");
    const result = await response.json();
    state.experiences = result.data;
    renderExperiences();
    updateSavedCount();
  } catch {
    $("#experienceGrid").innerHTML = `<p>We couldn't load the adventures. Please refresh the page.</p>`;
  }
}

$("#searchForm").addEventListener("submit", (event) => { event.preventDefault(); applyFilters(); });
$("#experienceGrid").addEventListener("click", (event) => {
  const save = event.target.closest("[data-save]");
  if (save) { event.stopPropagation(); return toggleSave(save.dataset.save); }
  const card = event.target.closest("[data-id]");
  if (card) openDetail(card.dataset.id);
});
$("#experienceGrid").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches("[data-id]")) openDetail(event.target.dataset.id);
});
$("#filterPills").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filters.category = button.dataset.filter;
  $("#categoryFilter").value = state.filters.category;
  $$("#filterPills button").forEach((item) => item.classList.toggle("active", item === button));
  renderExperiences();
});
$("#detailModal").addEventListener("click", (event) => {
  if (event.target.closest("[data-close-modal]")) closeModal("#detailModal");
  const book = event.target.closest("[data-book]");
  if (book) openBooking(book.dataset.book);
});
$("#bookingModal").addEventListener("click", (event) => {
  if (event.target.closest("[data-close-booking]")) closeModal("#bookingModal");
});
$$(".destination-card").forEach((button) => button.addEventListener("click", () => {
  state.filters.region = button.dataset.region;
  $("#destinationFilter").value = state.filters.region;
  renderExperiences();
  $("#experiences").scrollIntoView({ behavior: "smooth" });
}));
$$("[data-scroll]").forEach((button) => button.addEventListener("click", () => $(button.dataset.scroll).scrollIntoView({ behavior: "smooth" })));
$("#resetFilters").addEventListener("click", () => {
  state.filters = { category: "all", region: "all" };
  $("#destinationFilter").value = "all";
  $("#categoryFilter").value = "all";
  $$("#filterPills button").forEach((button) => button.classList.toggle("active", button.dataset.filter === "all"));
  renderExperiences();
});
$("#savedBtn").addEventListener("click", () => showToast(state.saved.size ? `${state.saved.size} adventure${state.saved.size > 1 ? "s" : ""} saved on this device` : "Save an adventure and it will appear here"));
$("#operatorBtn").addEventListener("click", () => showToast("Operator onboarding opens soon — hello@mahagetaways.in"));
$("#menuBtn").addEventListener("click", () => {
  const open = $(".site-header nav").classList.toggle("open");
  $("#menuBtn").setAttribute("aria-expanded", String(open));
  $("#menuBtn").setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
$$(".site-header nav a").forEach((link) => link.addEventListener("click", () => {
  $(".site-header nav").classList.remove("open");
  $("#menuBtn").setAttribute("aria-expanded", "false");
  $("#menuBtn").setAttribute("aria-label", "Open menu");
}));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { closeModal("#detailModal"); closeModal("#bookingModal"); }
});

init();
