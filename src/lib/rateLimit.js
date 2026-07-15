// ponytail: simple localStorage rate-limiting utility for client side spam protection

export const checkRateLimit = (formName) => {
  const key = `trbg_rl_${formName}`;
  const now = Date.now();
  const history = JSON.parse(
    localStorage.getItem(key) || "[]"
  );
  // Remove entries older than 1 hour
  const recent = history.filter((t) => now - t < 3600000);
  
  if (recent.length >= 3) {
    return { 
      allowed: false, 
      message: "Too many submissions. Please try again in an hour." 
    };
  }
  
  recent.push(now);
  localStorage.setItem(key, JSON.stringify(recent));
  return { allowed: true };
};
