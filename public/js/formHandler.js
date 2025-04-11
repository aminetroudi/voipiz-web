export function initFormHandler() {
  const form = document.getElementById("contact-form");
  const loader = document.getElementById("loader");
  const successMessage = document.getElementById("success-message");
  const errorMessage = document.getElementById("error-message");

  if (form && loader && successMessage && errorMessage) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Show loader, hide messages
      loader.classList.remove("d-none");
      successMessage.classList.add("d-none");
      errorMessage.classList.add("d-none");

      const formData = new FormData(form);

      try {
        const response = await fetch("/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message"),
          }),
        });

        const result = await response.json();
        loader.classList.add("d-none");

        if (response.ok && result.success) {
          successMessage.textContent = result.message;
          successMessage.classList.remove("d-none");
          form.reset();

          setTimeout(() => {
            successMessage.classList.add("d-none");
          }, 5000);
        } else {
          throw new Error(result.message || "Une erreur est survenue.");
        }
      } catch (error) {
        loader.classList.add("d-none");
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("d-none");

        setTimeout(() => {
          errorMessage.classList.add("d-none");
        }, 5000);
      }
    });
  }
}