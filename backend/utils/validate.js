export const validateRegisterInput = (name, email, phone, password) => {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return 'Name is required and must be a non-empty string';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return 'A valid email is required';
    }
    
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return 'A valid phone number is required';
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
        return 'Password is required and must be at least 6 characters long';
    }
    
    return null;
};

export const validateLoginInput = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return 'A valid email is required';
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
        return 'Password is required and must be at least 6 characters long';
    }
    
    return null;
};
