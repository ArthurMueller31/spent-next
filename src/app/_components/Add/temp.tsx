

/* <form onSubmit={handleSubmit}>
<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
  <div className="sm:col-span-2">
    <label
      htmlFor="name"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Nome do item
    </label>
    <input
      type="text"
      name="name"
      id="name"
      value={formData.name}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      placeholder="Digite o nome do produto"
      required
    />
  </div>
  <div className="w-full">
    <label
      htmlFor="establishment"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Estabelecimento
    </label>
    <input
      type="text"
      name="establishment"
      id="establishment"
      value={formData.establishment}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      placeholder="Local da Compra"
      required
    />
  </div>
  <div className="w-full">
    <label
      htmlFor="price"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Preço
    </label>
    <input
      type="text"
      name="price"
      id="price"
      value={formData.price}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 font-workSans"
      placeholder="R$1200,00"
      required
    />
  </div>
  <div>
    <label
      htmlFor="category"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Categoria
    </label>
    <select
      id="category"
      name="category"
      value={formData.category}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
    >
      <option defaultValue={""}>Selecionar</option>
      <option value="1">Compra do mercado</option>
      <option value="2">Eletrônicos</option>
      <option value="3">Utilidades Domésticas</option>
      <option value="4">Outro</option>
    </select>
  </div>
  <div>
    <label
      htmlFor="weight"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Peso (g)
    </label>
    <input
      type="text"
      name="weight"
      id="weight"
      value={formData.weight}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 font-workSans"
      placeholder="100"
      required
    />
  </div>
  <div className="sm:col-span-2">
    <label
      htmlFor="description"
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      Link da nota fiscal (opcional)
    </label>
    <input
      type="text"
      name="invoiceLink"
      id="invoiceLink"
      value={formData.invoiceLink}
      onChange={handleChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 font-workSans"
      placeholder="12"
    />
  </div>
</div>
<button
  type="submit"
  className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-black bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
>
  Adicionar produto
</button>
</form>

*/