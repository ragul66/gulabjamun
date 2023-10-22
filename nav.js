const loginIcon = document.getElementById("loginIcon");

let isLoggedIn = false;

loginIcon.addEventListener("click", () => {
    isLoggedIn = !isLoggedIn;
    loginIcon.innerHTML = `<i class="fas fa-user"></i> ${isLoggedIn ? "Logout" : "Login"}`;
});
