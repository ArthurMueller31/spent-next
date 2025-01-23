"use client";

import { firestore } from "../../../../firebase/firebase";
import { collection, addDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { format, toZonedTime } from "date-fns-tz";
import Image from "next/image";
import Tesseract from "tesseract.js";

export default function AddProducts() {
  const [formData, setFormData] = useState({
    name: "",
    establishment: "",
    price: "",
    category: "",
    weight: "",
    invoiceLink: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // arruma a hora no firestore
  const timeZone = "America/Sao_Paulo";
  const formattedDate = format(
    toZonedTime(new Date(), timeZone),
    "yyyy-MM-dd'T'HH:mm:ssXXX",
    {
      timeZone
    }
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      setSelectedFile(e.currentTarget.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(firestore, "purchases"), {
        ...formData,
        createdAt: formattedDate
      });

      console.log("Doc adicionado com id: ", docRef.id);
    } catch (error) {
      console.error("Erro ao adc doc", error);
    }
  };

  const handleOcrProcessing = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const reader = new FileReader();

      reader.onload = async () => {
        const imageData = reader.result as string;

        const result = await Tesseract.recognize(imageData, "por", {
          logger: (info) => console.log(info) // logs de progresso
        });

        console.log("Texto bruto: ", result.data.text);

        const processedData = cleanUpOcrData(result.data.text);
        console.log("Dados limpos: ", processedData);

        setOcrText(JSON.stringify(processedData, null, 2));
        setIsProcessing(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("erro: ", error);
      setIsProcessing(false);
    }
  };

  const cleanUpOcrData = (ocrText: string) => {
    const establishmentRegex = /^([\w\s&]+)\s+CNPJ/i;
    const itemRegex = /(.*?)\(Código:/gm;
    const totalRegex = /Valor a pagar R\$:\s*([\d,.]+)/i;
    const dateRegex = /Emissão:\s*(\d{2}\/\d{2}\/\d{4})/i;

    // extrair nome do mercado/estabelecimento
    const establishmentMatch = ocrText.match(establishmentRegex);
    const establishment = establishmentMatch
      ? establishmentMatch[1].trim()
      : "Nome do estabelecimento não encontrado";

    // extrair itens
    const items: { name: string}[] = [];
    let itemMatch;
    while ((itemMatch = itemRegex.exec(ocrText)) !== null) {
      const itemName = itemMatch[1]?.trim();
      
      if (itemName /* && itemMatch[3]*/) {
        items.push({
          name: itemName,
          // quantity: itemMatch[2].trim(),
          // price: parseFloat(itemMatch[3].replace(",", ".")) || 0
        });
      } else {
        console.warn("Item incompleto: ", itemMatch);
      }
    }

    // extrair valor total

    const totalMatch = ocrText.match(totalRegex);
    const total = totalMatch
      ? `Valor total: ${parseFloat(totalMatch[1].replace(",", "."))}`
      : "Total não encontrado";

    // extrair data da compra

    const dateMatch = ocrText.match(dateRegex);
    const purchaseDate = dateMatch ? dateMatch[1] : "Data não encontrada";

    return { establishment, items, total, purchaseDate };
  };

  
  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 font-raleway flex">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16 flex flex-col justify-center mt-10">
          <h2 className="mb-4 mt-4 text-xl font-medium text-gray-900 dark:text-white max-w-xl text-center">
            Adicione uma nova compra arrastando ou selecionando a imagem para
            escanear a nota fiscal e extrair os dados para você, ou de forma
            manual.
          </h2>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
            className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer flex flex-col bg-white"
          >
            <Image
              className="self-center"
              src={"/icons/drop-here.svg"}
              width={400}
              height={400}
              alt="drop-here"
            />
            {selectedFile ? (
              <p className="text-sm text-gray-700">
                Arquivo selecionado: {selectedFile.name}
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                Arraste e solte uma imagem aqui ou clique para selecionar.
              </p>
            )}
          </div>

          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            className="self-center mt-8 hidden"
          />

          <button
            className="mt-4 border border-black rounded-lg p-2 bg-white hover:bg-gray-100 transition duration-200 cursor-pointer"
            onClick={handleOcrProcessing}
            disabled={!selectedFile || isProcessing}
          >
            {isProcessing ? "Processando" : "Ler nota fiscal"}
          </button>

          {ocrText && (
            <div className="mt-4 p-4 border border-gray-300 rounded">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Texto extraído:
              </h3>
              <pre className="text-sm text-gray-700">{ocrText}</pre>
            </div>
          )}

          <div className="my-10 flex items-center gap-4 ">
            <hr className="w-full border-gray-300" />
            <p className="text-sm text-darkerCustomColor text-center">ou</p>
            <hr className="w-full border-gray-300" />
          </div>

          <div className="flex justify-center">
            <button className="border border-black border-solid rounded-lg p-2 bg-white hover:bg-gray-100 transition duration-200">
              Adicionar manualmente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
