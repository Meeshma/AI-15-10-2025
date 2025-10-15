// Toggle plan details
document.querySelectorAll(".toggle-details").forEach(button => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    details.classList.toggle("show");

    // Change button text
    if (details.classList.contains("show")) {
      button.textContent = "Hide Details";
    } else {
      button.textContent = "View Details";
    }
  });
});

// Contact form submission
document.querySelector(".contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("✅ Thank you! Your message has been sent. We'll contact you soon.");
  this.reset();
});
