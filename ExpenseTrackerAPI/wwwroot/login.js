
const LOGIN_API = "/api/auth/login";
const REGISTER_API = "/api/auth/register";

// GET ELEMENTS
const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");


// SWITCH TO REGISTRATION FORM

showRegister.addEventListener("click", function (event) {

    event.preventDefault();

    loginBox.style.display = "none";
    registerBox.style.display = "block";

    // Clear old messages
    document.getElementById("message").textContent = "";
    document.getElementById("registerMessage").textContent = "";

});


// SWITCH TO LOGIN FORM

showLogin.addEventListener("click", function (event) {

    event.preventDefault();

    registerBox.style.display = "none";
    loginBox.style.display = "block";

    document.getElementById("message").textContent = "";
    document.getElementById("registerMessage").textContent = "";

});


// LOGIN FUNCTIONALITY

document.getElementById("loginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const button = document.getElementById("loginBtn");
        const message = document.getElementById("message");

        button.disabled = true;
        button.textContent = "Logging in...";
        message.textContent = "";

        try {

            const response = await fetch(LOGIN_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Invalid email or password."
                );

            }

            if (!data.token) {

                throw new Error("Token missing in API response.");

            }

            // SAVE LOGIN DETAILS

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("fullName", data.fullName);
            sessionStorage.setItem("email", data.email);

            message.style.color = "green";
            message.textContent = "Login successful!";

            // REDIRECT TO DASHBOARD

            window.location.href = "index.html";

        }
        catch (error) {

            message.style.color = "red";
            message.textContent = error.message;

            console.error("Login error:", error);

        }
        finally {

            button.disabled = false;
            button.textContent = "Login to Account";

        }

    });


// REGISTRATION FUNCTIONALITY

document.getElementById("registerForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const fullName =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const button = document.getElementById("registerBtn");
        const message = document.getElementById("registerMessage");

        message.textContent = "";

        // CHECK FULL NAME

        if (!fullName) {

            message.style.color = "red";
            message.textContent = "Please enter your full name.";
            return;

        }

        // CHECK PASSWORD LENGTH

        if (password.length < 8) {

            message.style.color = "red";
            message.textContent =
                "Password must contain at least 8 characters.";

            return;

        }

        // CHECK PASSWORD MATCH

        if (password !== confirmPassword) {

            message.style.color = "red";
            message.textContent = "Passwords do not match.";

            return;

        }

        button.disabled = true;
        button.textContent = "Creating Account...";

        try {

            const response = await fetch(REGISTER_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    fullName: fullName,
                    email: email,
                    password: password

                })

            });

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    data.title ||
                    "Registration failed. Please try again."
                );

            }

            // REGISTRATION SUCCESS

            message.style.color = "green";

            message.textContent =
                data.message || "Account created successfully!";

            // CLEAR REGISTRATION FORM

            document.getElementById("registerForm").reset();

            // SWITCH TO LOGIN FORM

            setTimeout(function () {

                registerBox.style.display = "none";
                loginBox.style.display = "block";

                // Automatically fill registered email

                document.getElementById("email").value = email;

                document.getElementById("message").style.color = "green";

                document.getElementById("message").textContent =
                    "Account created successfully! Please login.";

            }, 1200);

        }
        catch (error) {

            message.style.color = "red";
            message.textContent = error.message;

            console.error("Registration error:", error);

        }
        finally {

            button.disabled = false;
            button.textContent = "Create Account";

        }

    });
