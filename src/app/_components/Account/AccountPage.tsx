"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "../../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";

export default function AccountPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState(false);

  useEffect(() => {
    const getUserID = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserPhoto(user.photoURL);
        setUserEmail(user.email);

        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || "Usuário");
        } else {
          setUserName("Usuário");
        }
      }
    });

    return () => getUserID();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-[64px] font-hostGrotesk">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Minha Conta</h2>

        <div className="flex flex-col items-center">
          <Image
            src={userPhoto || "/icons/sidebar-account.svg"}
            alt="Foto de perfil"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="flex flex-row">
            <input
              type="email"
              className="m-10 p-2 w-fit border border-darkerCustomColor rounded bg-gray-50 placeholder:text-darkerCustomColor"
              placeholder={userEmail!}
              disabled={!editingEmail}
            />

            <button className="" onClick={() => setEditingEmail(true)}>
              {!editingEmail ? (
                <Image
                  src={"./icons/edit.svg"}
                  alt="edit-icon"
                  width={30}
                  height={30}
                />
              ) : (
                <Image
                  src={"./icons/check.svg"}
                  alt="confirm-icon"
                  width={30}
                  height={30}
                />
              )}
            </button>
          </div>
          <p className="mt-2 text-gray-700 font-medium">{userName}</p>
        </div>
      </div>
    </div>
  );
}
