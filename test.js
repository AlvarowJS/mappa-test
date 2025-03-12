const testRateLimiter = async () => {
    for (let i = 0; i < 10; i++) {
        const response = await fetch("http://localhost:3000");
        const data = await response.text();
        console.log(`Request ${i + 1}:`, data);
    }
};

testRateLimiter();
