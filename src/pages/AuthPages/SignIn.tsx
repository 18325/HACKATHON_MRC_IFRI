import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="AI4CKD"
        description="Une application dédiée aux médecin pour la gestion des patients"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
