import { clerk } from "./clerk.js";
import { convex } from "./convex.js";
import { api } from "../convex/_generated/api.js";

await clerk.load();

/* =========================
   CONVEX AUTH
========================= */

convex.setAuth(async () => {
  return (
    await clerk.session?.getToken({
      template: "convex",
    })
  ) ?? null;
});

/* =========================
   LOAD CURRENT USER
========================= */

if (!clerk.isSignedIn) {
  console.warn("No signed-in AlumniForge user.");
} else {
  try {
    const user = await convex.query(
      api.users.getCurrentUser,
      {}
    );

    if (user) {
      console.log("AlumniForge user loaded successfully.");
    } else {
      console.warn("No AlumniForge user profile found.");
    }
  } catch (error) {
    console.error(
      "Failed to load AlumniForge user:",
      error
    );
  }
}

/* =========================
   LOGOUT
========================= */

const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {
  logoutLink.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      await clerk.signOut();
      window.location.href = "./index.html";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}