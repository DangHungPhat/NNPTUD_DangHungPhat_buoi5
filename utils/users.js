module.exports = {
    users: [
        {
            id: 1,
            username: "admin",
            password: "admin123",
            email: "admin@example.com",
            fullName: "Administrator",
            avatarUrl: "https://i.sstatic.net/l60Hf.png",
            status: true,
            role: 1,
            loginCount: 10,
            isDeleted: false,
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
            updatedAt: new Date("2026-01-01T00:00:00.000Z")
        },
        {
            id: 2,
            username: "johndoe",
            password: "john123",
            email: "john@example.com",
            fullName: "John Doe",
            avatarUrl: "https://i.sstatic.net/l60Hf.png",
            status: false,
            role: 2,
            loginCount: 3,
            isDeleted: false,
            createdAt: new Date("2026-01-02T00:00:00.000Z"),
            updatedAt: new Date("2026-01-02T00:00:00.000Z")
        }
    ]
};
