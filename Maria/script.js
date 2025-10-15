// ======================
// DATA
// ======================
let selectedLocation = null;
let selectedMovie = null;
let selectedTheatre = null;
let selectedShowtime = null;
let selectedSeats = [];

// Theatres with showtimes
const theatres = [
  {
    name: "PVR Lulu Mall",
    price: 200,
    showtimes: ["09:30 AM", "12:15 PM", "03:00 PM", "06:15 PM", "09:30 PM"],
    features: ["Dolby Atmos", "Recliner Seats"]
  },
  {
    name: "INOX Forum Mall",
    price: 180,
    showtimes: ["10:00 AM", "01:15 PM", "04:30 PM", "07:45 PM", "10:45 PM"],
    features: ["4DX", "Premium Sound"]
  },
  {
    name: "Cinepolis Centre Square",
    price: 220,
    showtimes: ["11:00 AM", "02:00 PM", "05:15 PM", "08:30 PM", "11:15 PM"],
    features: ["IMAX", "Luxury Seating"]
  }
];

// Movie data for search functionality
const movies = [
  { title: "Lokah: Chapter 1 - Chandra", rating: "9.2/10", genre: "Action,Comedy,Fantasy", duration: "2h 31m", image: "1.jpg" },
  { title: "Demon Slayer: Kimetsu no Yaiba", rating: "9.5/10", genre: "Action,Adventure,Anime", duration: "2h 35m", image: "2.jpg" },
  { title: "The Conjuring: Last Rites", rating: "6.5/10", genre: "Horror,Thriller", duration: "2h 15m", image: "3.jpg" },
  { title: "Mirage", rating: "8.3/10", genre: "Mystery,Thriller", duration: "2h 32m", image: "5.jpg" },
  { title: "Hridayapoorvam", rating: "8.6/10", genre: "Comedy,Drama", duration: "2h 31m", image: "6.jpg" },
  { title: "Mirai", rating: "8.9/10", genre: "Action,Adventure,Fantasy,Thriller", duration: "2h 49m", image: "7.jpg" },
  { title: "Odum Kuthira Chaadum Kuthira", rating: "6.5/10", genre: "Comedy,Drama", duration: "2h 33m", image: "8.jpg" },
  { title: "Humans in the Loop", rating: "9.3/10", genre: "Drama", duration: "1h 14m", image: "9.jpg" },
  { title: "The Toxic Avenger", rating: "8.3/10", genre: "Action,Comedy,Horror,Sci-Fi", duration: "1h 44m", image: "10.jpg" },
  { title: "Ajey: The Untold Story of a Yogi", rating: "9.5/10", genre: "Biography,Drama", duration: "2h 30m", image: "4.jpg" }
];

// ======================
// STEP HANDLING
// ======================
function showStep(step) {
  document.querySelectorAll(".step-content").forEach((el, idx) => {
    el.classList.toggle("active", idx === step);
  });
  
  document.querySelectorAll(".step-pill").forEach((el, idx) => {
    el.classList.toggle("active", idx === step);
  });
}

// ======================
// LOCATION SELECTION
// ======================
function chooseLocation(loc) {
  selectedLocation = loc;
  document.querySelector('.location-selector').textContent = `📍 ${loc}`;
  showStep(1);
}

function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => {
        alert("Location detected! Going to Kochi.");
        chooseLocation('Kochi');
      },
      () => {
        alert("Location detection failed. Please choose manually.");
      }
    );
  } else {
    alert("Geolocation not supported. Please choose manually.");
  }
}

// ======================
// MOVIE SELECTION
// ======================
function selectMovie(movie) {
  selectedMovie = movie;
  renderTheatres();
  showStep(2);
}

// ======================
// SHOWTIMES
// ======================
function renderTheatres() {
  const container = document.getElementById("showtimes");
  container.innerHTML = "";

  const now = new Date();

  theatres.forEach(theatre => {
    const block = document.createElement("div");
    block.className = "theatre-block";

    const header = document.createElement("div");
    header.className = "theatre-header";
    
    const nameDiv = document.createElement("div");
    const nameEl = document.createElement("h3");
    nameEl.className = "theatre-name";
    nameEl.textContent = theatre.name;
    nameDiv.appendChild(nameEl);
    
    if (theatre.features) {
      const featuresEl = document.createElement("div");
      featuresEl.style.fontSize = "12px";
      featuresEl.style.color = "#64748b";
      featuresEl.textContent = theatre.features.join(" • ");
      nameDiv.appendChild(featuresEl);
    }
    
    const priceEl = document.createElement("div");
    priceEl.className = "theatre-price";
    priceEl.textContent = `₹${theatre.price}`;
    
    header.appendChild(nameDiv);
    header.appendChild(priceEl);
    block.appendChild(header);

    const stDiv = document.createElement("div");
    stDiv.className = "theatre-showtimes";

    theatre.showtimes.forEach(time => {
      if (isFutureTime(time, now)) {
        const btn = document.createElement("button");
        btn.className = "showtime-btn";
        btn.textContent = time;
        btn.onclick = () => selectShowtime(theatre, time);
        stDiv.appendChild(btn);
      }
    });

    block.appendChild(stDiv);
    container.appendChild(block);
  });
}

function isFutureTime(timeStr, now) {
  const [t, modifier] = timeStr.split(" ");
  let [hours, minutes] = t.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const showTime = new Date();
  showTime.setHours(hours, minutes, 0, 0);

  return showTime > now;
}

function selectShowtime(theatre, time) {
  selectedTheatre = theatre;
  selectedShowtime = time;
  renderSeats();
  showStep(3);
}

// ======================
// SEAT SELECTION
// ======================
function renderSeats() {
  const container = document.getElementById("seats");
  container.innerHTML = "";

  const rows = "ABCDEFGHIJ".split("");
  const cols = 20;

  rows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "seat-row";

    const label = document.createElement("span");
    label.className = "row-label";
    label.textContent = row;
    rowDiv.appendChild(label);

    for (let col = 1; col <= cols; col++) {
      const seatId = `${row}${col}`;
      const seat = document.createElement("button");
      seat.className = "seat";
      seat.textContent = col;
      
      if (Math.random() < 0.15) {
        seat.classList.add("occupied");
        seat.onclick = null;
      } else {
        seat.onclick = () => toggleSeat(seatId, seat);
      }
      
      rowDiv.appendChild(seat);
    }

    container.appendChild(rowDiv);
  });
}

function toggleSeat(seatId, seatEl) {
  if (selectedSeats.includes(seatId)) {
    selectedSeats = selectedSeats.filter(s => s !== seatId);
    seatEl.classList.remove("selected");
  } else {
    if (selectedSeats.length >= 10) {
      alert("Maximum 10 seats can be selected");
      return;
    }
    selectedSeats.push(seatId);
    seatEl.classList.add("selected");
  }
  
  const count = selectedSeats.length;
  const total = count * selectedTheatre.price;
  document.getElementById("seat-info").innerHTML = 
    `${count} seat(s) selected<br><strong>Total: ₹${total}</strong>`;
}

// ======================
// SEARCH FUNCTIONALITY
// ======================
function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchContainer = document.querySelector('.search-container');
  
  if (!searchInput) {
    console.error("Search input not found!");
    return;
  }

  console.log("Search initialized successfully!");

  // Create search results dropdown
  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  searchResults.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    margin-top: 4px;
  `;
  
  searchContainer.appendChild(searchResults);

  // Search input event listener
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim().toLowerCase();
    console.log("Searching for:", query);
    
    if (query.length === 0) {
      searchResults.style.display = 'none';
      return;
    }

    const filteredMovies = movies.filter(movie => 
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query)
    );

    displaySearchResults(filteredMovies, searchResults, query);
  });

  // Close search results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchContainer.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });

  // Handle Enter key press
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = e.target.value.trim().toLowerCase();
      if (query.length > 0) {
        performSearch(query);
        searchResults.style.display = 'none';
        searchInput.blur();
      }
    }
  });
}

function displaySearchResults(results, container, query) {
  if (results.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px; text-align: center; color: #64748b;">
        <p>No results found for "${query}"</p>
        <small>Try searching for movie titles or genres like "Action", "Comedy", "Horror"</small>
      </div>
    `;
    container.style.display = 'block';
    return;
  }

  const resultsHTML = results.map(movie => `
    <div onclick="selectMovieFromSearch('${movie.title}')" style="
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background-color 0.2s;
    " onmouseover="this.style.backgroundColor='#f8fafc'" onmouseout="this.style.backgroundColor='white'">
      <img src="${movie.image}" alt="${movie.title}" style="
        width: 40px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 12px;
      ">
      <div>
        <div style="font-weight: 500; color: #1e293b; margin-bottom: 2px;">
          ${highlightSearchTerm(movie.title, query)}
        </div>
        <div style="font-size: 12px; color: #64748b;">
          ${movie.genre} • ${movie.duration} • ⭐ ${movie.rating}
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = resultsHTML;
  container.style.display = 'block';
}

function highlightSearchTerm(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background-color: #fef3c7; padding: 1px 2px; border-radius: 2px;">$1</mark>');
}

function selectMovieFromSearch(movieTitle) {
  const searchResults = document.querySelector('.search-results');
  if (searchResults) {
    searchResults.style.display = 'none';
  }
  
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.value = '';
  }
  
  showStep(1);
  
  setTimeout(() => {
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
      const titleElement = card.querySelector('.movie-title');
      if (titleElement && titleElement.textContent.trim() === movieTitle) {
        card.style.border = '3px solid #dc2626';
        card.style.transform = 'scale(1.02)';
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
          card.style.border = '';
          card.style.transform = '';
        }, 3000);
      }
    });
  }, 300);
}

function performSearch(query) {
  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(query) ||
    movie.genre.toLowerCase().includes(query)
  );
  
  if (filteredMovies.length > 0) {
    showStep(1);
    
    setTimeout(() => {
      const movieCards = document.querySelectorAll('.movie-card');
      
      movieCards.forEach(card => {
        const titleElement = card.querySelector('.movie-title');
        if (titleElement) {
          const movieTitle = titleElement.textContent.trim();
          const movieMatch = filteredMovies.some(movie => movie.title === movieTitle);
          
          if (movieMatch) {
            card.style.display = 'block';
            card.style.border = '2px solid #dc2626';
          } else {
            card.style.display = 'none';
          }
        }
      });
      
      addShowAllMoviesButton();
    }, 300);
  } else {
    alert(`No movies found for "${query}". Try searching for titles or genres like "Action", "Comedy", "Horror".`);
  }
}

function addShowAllMoviesButton() {
  const moviesContainer = document.querySelector('.movies-container');
  if (!moviesContainer || document.querySelector('.show-all-btn')) return;
  
  const showAllBtn = document.createElement('button');
  showAllBtn.className = 'show-all-btn btn';
  showAllBtn.textContent = 'Show All Movies';
  showAllBtn.style.cssText = `
    margin: 20px auto;
    display: block;
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #cbd5e1;
  `;
  
  showAllBtn.onclick = function() {
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
      card.style.display = 'block';
      card.style.border = '';
    });
    showAllBtn.remove();
  };
  
  moviesContainer.appendChild(showAllBtn);
}

// ======================
// BOOKING CONFIRM
// ======================
function showStep4Summary() {
  const summary = document.getElementById("summary");
  const total = selectedSeats.length * selectedTheatre.price;
  
  summary.innerHTML = `
    <div class="summary-item">
      <span><strong>Movie:</strong></span>
      <span>${selectedMovie}</span>
    </div>
    <div class="summary-item">
      <span><strong>Theatre:</strong></span>
      <span>${selectedTheatre.name}</span>
    </div>
    <div class="summary-item">
      <span><strong>Date & Time:</strong></span>
      <span>Today, ${selectedShowtime}</span>
    </div>
    <div class="summary-item">
      <span><strong>Seats:</strong></span>
      <span>${selectedSeats.join(", ")}</span>
    </div>
    <div class="summary-item">
      <span><strong>Number of Tickets:</strong></span>
      <span>${selectedSeats.length} x ₹${selectedTheatre.price}</span>
    </div>
    <div class="summary-item">
      <span><strong>Total Amount:</strong></span>
      <span>₹${total}</span>
    </div>
  `;
}

function confirmBooking() {
  showStep4Summary();
  showStep(4);
  
  setTimeout(() => {
    const step4 = document.getElementById('step4');
    if (step4) {
      const confirmBtn = step4.querySelector('.btn.primary');
      if (confirmBtn) {
        confirmBtn.onclick = generateTicket;
      }
    }
  }, 100);
}

function generateTicket() {
  const total = selectedSeats.length * selectedTheatre.price;
  const bookingId = 'BMS' + Math.random().toString(36).substr(2, 9).toUpperCase();
  
  document.getElementById("ticket-movie").textContent = selectedMovie;
  document.getElementById("ticket-theatre").innerHTML = `<strong>Theatre:</strong> ${selectedTheatre.name}`;
  document.getElementById("ticket-showtime").innerHTML = `<strong>Show Time:</strong> Today, ${selectedShowtime}`;
  document.getElementById("ticket-seats").innerHTML = `<strong>Seats:</strong> ${selectedSeats.join(", ")}`;
  document.getElementById("ticket-price").innerHTML = `<strong>Total Amount:</strong> ₹${total}`;
  document.getElementById("booking-id").textContent = bookingId;

  document.getElementById("qrcode").innerHTML = "";
  
  new QRCode(document.getElementById("qrcode"), {
    text: `FILMPass Ticket\nMovie: ${selectedMovie}\nTheatre: ${selectedTheatre.name}\nTime: ${selectedShowtime}\nSeats: ${selectedSeats.join(", ")}\nBooking ID: ${bookingId}`,
    width: 120,
    height: 120,
    colorDark: "#000000",
    colorLight: "#ffffff"
  });

  showStep(5);
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const movie = document.getElementById("ticket-movie").textContent;
  const theatre = document.getElementById("ticket-theatre").textContent.replace("Theatre: ", "");
  const showtime = document.getElementById("ticket-showtime").textContent.replace("Show Time: ", "");
  const seats = document.getElementById("ticket-seats").textContent.replace("Seats: ", "");
  const price = document.getElementById("ticket-price").textContent.replace("Total Amount: ", "");
  const bookingId = document.getElementById("booking-id").textContent;

  doc.setFontSize(18);
  doc.text("🎟️ FILMPass Ticket", 20, 20);

  doc.setFontSize(12);
  doc.text(`Movie: ${movie}`, 20, 40);
  doc.text(`Theatre: ${theatre}`, 20, 50);
  doc.text(`Date & Time: ${showtime}`, 20, 60);
  doc.text(`Seats: ${seats}`, 20, 70);
  doc.text(`Total Amount: ${price}`, 20, 80);
  doc.text(`Booking ID: ${bookingId}`, 20, 90);

  const qrCanvas = document.querySelector("#qrcode canvas");
  if (qrCanvas) {
    const qrDataUrl = qrCanvas.toDataURL("image/png");
    doc.addImage(qrDataUrl, "PNG", 150, 40, 40, 40);
  }

  doc.save(`${movie}_Ticket.pdf`);
}

function resetBooking() {
  selectedLocation = null;
  selectedMovie = null;
  selectedTheatre = null;
  selectedShowtime = null;
  selectedSeats = [];
  
  document.querySelector('.location-selector').textContent = '📍 Select City';
  document.getElementById("seat-info").textContent = "0 seat(s) selected";
  
  showStep(0);
}

// ======================
// INIT
// ======================
document.addEventListener('DOMContentLoaded', function() {
  console.log("Page loaded, initializing...");
  
  // Initialize search
  initializeSearch();
  
  // Setup step observer
  const observer = new MutationObserver(function() {
    const step4 = document.getElementById('step4');
    if (step4 && step4.classList.contains('active')) {
      showStep4Summary();
    }
  });
  
  observer.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
  });
});