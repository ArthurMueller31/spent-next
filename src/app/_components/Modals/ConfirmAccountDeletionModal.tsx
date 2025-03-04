import React, { useEffect, useState } from "react";
import { auth, firestore } from "../../../../firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch
} from "firebase/firestore";
import {
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { useRouter } from "next/navigation";

type ConfirmAccountDeletionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function ConfirmAccountDeletionModal({
  isOpen,
  onClose
}: ConfirmAccountDeletionModalProps) {
  const [confirmAccountDeletionText, setConfirmAccountDeletionText] =
    useState("");
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isUserLogged = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => isUserLogged();
  }, [router]);

  if (!isOpen) return null;

  const handleReauthenticate = async () => {
    setDeleteError(null);
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    try {
      const isGoogleUser = user.providerData.some(
        (provider) => provider.providerId === "google.com"
      );

      if (isGoogleUser) {
        await reauthenticateWithPopup(user, new GoogleAuthProvider());
      } else {
        if (!passwordInput) {
          setDeleteError("Digite sua senha para confirmar exclusão.");
          return;
        }
        const credential = EmailAuthProvider.credential(
          user.email!,
          passwordInput
        );
        await reauthenticateWithCredential(user, credential);
      }
      setIsReauthenticated(true);
    } catch (error) {
      setDeleteError("Verifique a senha e tente novamente.");
      console.log(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmAccountDeletionText !== "EXCLUIR") {
      setDeleteError("Confirmação de exclusão incorreta.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError(null);

    const user = auth.currentUser;

    if (!user) {
      return;
    }

    try {
      // exclui todas as compras do user primeiro
      const purchasesRef = collection(
        firestore,
        "users",
        user.uid,
        "purchases"
      );
      const purchasesSnapshot = await getDocs(purchasesRef);
      const batch = writeBatch(firestore);
      purchasesSnapshot.forEach((purchaseDoc) => {
        batch.delete(purchaseDoc.ref);
      });

      await batch.commit();

      // exclui o doc do user (email, nome, etc)
      const userDocRef = doc(firestore, "users", user.uid);
      await deleteDoc(userDocRef);

      // por fim deleta o user do firebase auth
      await deleteUser(user);

      setDeleteLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setDeleteError("Erro ao excluir conta. Tenta novamente.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-raleway p-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-white">
        <div className="p-4 bg-red-50 border border-red-600 rounded w-full max-w-lg">
          <h3
            className={`${
              !isReauthenticated
                ? "text-black font-bold mb-2"
                : "text-red-600 font-bold mb-2"
            } `}
          >
            Excluir Conta
          </h3>
          {!isReauthenticated ? (
            <>
              {/* Se for usuário de email/senha, exibe input para senha */}
              {auth.currentUser?.providerData.some(
                (provider) => provider.providerId === "google.com"
              ) ? (
                <p className="mb-2 text-sm text-black">
                  Clique no botão &quot;OK&quot; para reautenticar com o Google.
                </p>
              ) : (
                <>
                  <p className="mb-2 text-sm text-black font-medium">
                    Para confirmar a exclusão, digite sua senha no campo abaixo:
                  </p>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Digite sua senha"
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                  />
                </>
              )}
              {deleteError && (
                <p className="text-sm text-red-500 mb-2">{deleteError}</p>
              )}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  disabled={deleteLoading}
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-5 hover:bg-gray-400 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReauthenticate}
                  disabled={deleteLoading}
                  className="bg-darkerCustomColor text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  {deleteLoading ? "Carregando..." : "OK"}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-2 text-sm text-black font-medium">
                Reautenticação realizada com sucesso. Agora, para confirmar a
                exclusão definitiva, digite <strong>EXCLUIR</strong> no campo
                abaixo.
              </p>
              <input
                type="text"
                value={confirmAccountDeletionText}
                onChange={(e) => setConfirmAccountDeletionText(e.target.value)}
                placeholder="Digite EXCLUIR para confirmar"
                className="mb-2 p-2 border border-gray-300 rounded w-full"
              />
              {deleteError && (
                <p className="text-sm text-red-500 mb-2">{deleteError}</p>
              )}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  disabled={deleteLoading}
                  className="bg-gray-300 text-black px-4 py-2 rounded mr-5 hover:bg-gray-400 transition duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  {deleteLoading ? "Excluindo..." : "Excluir Conta"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
