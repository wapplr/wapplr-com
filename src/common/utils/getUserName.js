export default function getUserName(user) {
    const firstName = user?.name?.first || "User";
    const lastName = user?.name?.last || "";
    return (lastName) ? firstName + " " + lastName : firstName;
}
