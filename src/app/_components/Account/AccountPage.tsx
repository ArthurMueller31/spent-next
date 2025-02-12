"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "../../../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

export default function AccountPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userAccCreation, setUserAccCreation] = useState<{
    createdAt?: string;
  } | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState<string>("");
  const [editingName, setEditingName] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const setUidFromLoggedUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => setUidFromLoggedUser();
  }, []);

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

  useEffect(() => {
    if (!userId) return;

    const fetchUserAccountCreation = async () => {
      try {
        const userRef = doc(firestore, `users/${userId}`);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          const createdAt = data.createdAt
            ? data.createdAt.substring(8, 10) +
              "/" +
              data.createdAt.substring(5, 7) +
              "/" +
              data.createdAt.substring(0, 4)
            : "Data não disponível";

          setUserAccCreation({ createdAt });
        } else {
          setUserAccCreation(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserAccountCreation();
  }, [userId]);

  const handleNameUpdate = async () => {
    if (!auth.currentUser) return;

    if (newUserName === "") {
      alert("O campo não pode estar vazio.");
      return;
    }

    try {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { name: newUserName });

      setUserName(newUserName);
      setEditingName(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="fixed top-24 left-14">
        <Link href={"/home"}>
          <button
            className="px-4 py-2 bg-darkerCustomColor border border-darkerCustomColor rounded-xl flex text-white
          hover:bg-slate-800 transition duration-200 font-raleway"
          >
            <Image
              src={"./icons/arrow-forward.svg"}
              alt="arrow-backwards-icon"
              width={15}
              height={15}
              className="transform scale-x-[-1] mr-2"
            />
            Voltar
          </button>
        </Link>
      </div>
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

            <div className="flex flex-col justify-center items-center">
              {editingName ? (
                <input
                  type="text"
                  placeholder="Insira o novo nome"
                  className="m-2 border border-black rounded px-2 py-2"
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              ) : (
                <p className="mt-2 text-gray-700 font-bold text-lg">
                  {userName}
                </p>
              )}
              {editingName && (
                <div>
                  <button
                    onClick={() => setEditingName(false)}
                    className="hover:bg-red-500 transition duration-200 rounded m-1"
                  >
                    <Image
                      className="m-1"
                      src={"./icons/cancel.svg"}
                      width={25}
                      height={25}
                      alt="cancel-icon"
                    />
                  </button>
                  <button
                    onClick={() => handleNameUpdate()}
                    className="hover:bg-green-500 transition duration-200 rounded m-1"
                  >
                    <Image
                      className="m-1"
                      src={"./icons/check.svg"}
                      width={25}
                      height={25}
                      alt="save-icon"
                    />
                  </button>
                </div>
              )}
            </div>
            <div>
              <button onClick={() => setEditingName(true)}>
                {!editingName && (
                  <Image
                    src={"./icons/edit.svg"}
                    alt="edit-icon"
                    width={20}
                    height={20}
                  />
                )}
              </button>
            </div>

            <div className="flex flex-col items-center">
              <p className="mt-5 mb-[-15px]">E-mail cadastrado:</p>
              <div className="m-7 px-10 py-2 w-fit border border-darkerCustomColor rounded bg-gray-50 text-center">
                <p>{userEmail}</p>
              </div>
            </div>
            <div>
              <p className="font-hostGrotesk">
                Data de criação da conta: {userAccCreation?.createdAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
