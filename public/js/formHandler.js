export function initFormHandler() {
  const form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const loader = document.getElementById("loader");
      const successMessage = document.getElementById("success-message");
      const errorMessage = document.getElementById("error-message");

      loader.style.display = "block";
      successMessage.style.display = "none";
      errorMessage.style.display = "none";

      try {
        const response = await fetch(form.action, {
          method: form.method,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(new FormData(form)),
        });

        const result = await response.json();
        loader.style.display = "none";

        if (response.ok && result.success) {
          successMessage.textContent = result.message;
          successMessage.style.display = "block";

          // Reset the form
          form.reset();

          // Hide the success message after 5 seconds
          setTimeout(() => {
            successMessage.style.display = "none";
          }, 5000);
        } else {
          throw new Error(result.message || "Une erreur est survenue.");
        }
      } catch (error) {
        loader.style.display = "none";
        errorMessage.textContent = error.message;
        errorMessage.style.display = "block";

        // Hide the error message after 5 seconds
        setTimeout(() => {
          errorMessage.style.display = "none";
        }, 5000);
      }
    });
  }
}