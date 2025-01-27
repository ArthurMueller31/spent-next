// tabela antes
export default function temp() {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <main className="flex-1 ml-64 md:ml-0 flex items-center justify-center bg-gray-50 p-4">
        {/* Table Container */}
        <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Pesquisar"
              className="border border-gray-300 rounded-lg p-2 w-1/4"
            />
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                + Adicionar Compra
              </button>
              <button className="bg-gray-200 text-black px-4 py-2 rounded-lg">
                Ações
              </button>
              <button className="bg-gray-200 text-black px-4 py-2 rounded-lg">
                Filtrar
              </button>
            </div>
          </div>
          {/* Table */}
          <table className="w-full border border-gray-300 text-sm text-left">
            <thead className="bg-gray-100">
              <tr className="flex justify-around">
                <th className="flex-1 p-3 border-b text-center">
                  Local da Compra
                </th>
                <th className="flex-1 p-3 border-b text-center">Dia</th>
                <th className="flex-1 p-3 border-b text-center">Item</th>
                <th className="flex-1 p-3 border-b text-center">Preço</th>
                <th className="flex-1 p-3 border-b text-center">Quantidade</th>
                <th className="flex-1 p-3 border-b text-center">Peso</th>
                <th className="flex-1 p-3 border-b text-center">
                  Editar/Excluir
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="flex justify-around">
                <td className="flex-1 p-3 border-b text-center">TOP</td>
                <td className="flex-1 p-3 border-b text-center">27/01/2025</td>
                <td className="flex-1 p-3 border-b text-center">Maçã</td>
                <td className="flex-1 p-3 border-b text-center">12,40</td>
                <td className="flex-1 p-3 border-b text-center">6</td>
                <td className="flex-1 p-3 border-b text-center">640</td>
                <td className="flex-1 p-3 border-b text-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 ml-2 rounded-md">
                    Delete
                  </button>
                </td>
              </tr>
              {/* Repita mais linhas aqui */}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <p>Mostrando 1-10</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-200 rounded-md">1</button>
              <button className="px-3 py-1 bg-gray-200 rounded-md">2</button>
              <button className="px-3 py-1 bg-gray-200 rounded-md">3</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
