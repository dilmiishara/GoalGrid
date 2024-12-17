export async function register(previousState, formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    console.log({ email, password });

    const res = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data?.error) {
      return { ...previousState, error: data.error };
    }
    return { error: null, success: data };
  } catch (err) {
    console.error("Error during registration:", err);
    return { ...previousState, error: "Something went wrong" };
  }
}

// userActions.js
export const login = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { success: true, error: null }; // Return success state
      } else {
        return { success: null, error: data.error || "Login failed." }; // Return error message
      }
    } catch (error) {
      console.error("Error during login:", error);
      return { success: null, error: "An error occurred. Please try again." }; // Return error state
    }
  };
  