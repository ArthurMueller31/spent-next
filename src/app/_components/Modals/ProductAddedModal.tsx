export default function ProductAddedModal() {
  const handleGoBack = () => {
    location.reload();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-raleway z-10">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="bg-green-100 rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">
          Compra adicionada com sucesso!
        </h2>
        <p className="text-gray-600 mb-4">
          Sua compra foi adicionada. Você pode vê-la em &quot;Minhas
          Compras&quot;, ou outras partes do app.
        </p>
        <button
          className="bg-darkerCustomColor text-white px-4 py-2 rounded-lg"
          onClick={handleGoBack}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
