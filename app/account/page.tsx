import { UserProfile } from "@clerk/nextjs";

const AccountPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-black py-12">
    <UserProfile path="/account" />
  </div>
);

export default AccountPage;
