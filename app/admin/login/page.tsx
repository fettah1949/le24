import { LoginForm } from "@/components/admin/LoginForm";
import { getSiteName } from "@/lib/utils";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          {getSiteName()} Admin
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Connectez-vous pour accéder au back-office
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
