import Image from "next/image";

export default function HelpPage() {
  return (
    <div className="pt-24 font-raleway text-justify flex flex-col justify-center items-center pb-16 px-16">
      <div>
        <h1 className="font-bold text-3xl md:text-5xl mb-5 text-center md:text-start max-w-3xl">
          Como posso adicionar uma compra?
        </h1>
      </div>
      <div className="text-xl max-w-3xl space-y-3">
        <p>
          Se for sua primeira vez no site, saiba que é bem simples de ser usado.
          Você pode começar adicionando uma compra, clicando/tocando em qualquer
          lugar na tela.
        </p>
        <p>
          Após o clique/toque, você verá um <strong>formulário</strong> para
          preencher os dados de sua compra (mesmo que você tenha comprado algo
          há um bom tempo e queira cadastrar, fique à vontade).
        </p>
        <p>
          Quando terminar, clique em <strong>&quot;Salvar&quot;</strong>. E após
          salvar com sucesso a sua compra, você verá uma página com
          gráficos/resumos delas.
        </p>
        <p>
          Você pode adicionar e controlar seus gastos sempre, clicando em{" "}
          <strong>&quot;Adicionar compra&quot;</strong>, no menu à esquerda.
        </p>
        <p>
          O mesmo formulário de preenchimento de compras irá aparecer. Você pode
          adicionar quantos itens forem necessários; cada um deles ficará
          guardado na aba <strong>&quot;Minhas compras&quot;</strong>.
        </p>
      </div>
      <div>
        <h1 className="font-bold text-3xl md:text-5xl max-w-3xl mt-10 mb-5 text-center md:text-start">
          Como ver, editar e excluir minhas compras?
        </h1>
      </div>
      <div className="text-xl max-w-3xl space-y-2">
        <p>
          Para ver <strong>todas</strong> as suas compras, você pode clicar em
          <strong>&quot;Minhas compras&quot;</strong> no menu à esquerda, e uma
          tabela com tudo o que você adicionou até o momento será exibido.
        </p>
        <p className="flex">Ao clicar no ícone</p>
        <Image
          className="mx-2"
          src={"/icons/expand.svg"}
          width={30}
          height={30}
          alt="expand-icon"
        />
        <p>
          a tabela se expande e você pode ver todos os itens que foram
          adicionados. Caso esqueceu de algum, pode clicar em{" "}
          <strong>&quot;Adicionar item&quot;</strong>, fazendo com que apareçam
          campos para preencher com as informações do item novo.
        </p>
        <p>
          Para <strong>&quot;editar&quot;</strong> um item, você pode clicar no
          ícone
        </p>
        <Image
          className="mx-2"
          src={"/icons/edit.svg"}
          width={30}
          height={30}
          alt="edit-icon"
        />
        <p>
          Para <strong>&quot;excluir&quot;</strong> um item, você pode clicar no
          ícone
        </p>
        <Image
          className="mx-2"
          src={"/icons/delete.svg"}
          width={30}
          height={30}
          alt="bin-icon"
        />
        <p>
          Se você tem certeza que deseja excluir a compra{" "}
          <strong>inteira</strong>, clique em{" "}
          <strong>&quot;Confirmar&quot;</strong>.
        </p>
      </div>
      <div>
        <h1 className="font-bold text-3xl md:text-5xl max-w-3xl mt-10 mb-5 text-center md:text-start">
          Posso mudar o e-mail com qual criei a conta?
        </h1>
      </div>
      <div className="text-xl max-w-3xl space-y-2">
        <p>
          No momento, não é possível alterar o e-mail no qual você cadastrou a
          conta. A única informação do cadastro que pode ser alterada a qualquer
          momento é o <strong>nome</strong>.
        </p>
      </div>
      <div>
        <h1 className="font-bold text-3xl md:text-5xl max-w-3xl mt-10 mb-5 text-center md:text-start">
          Algo não está funcionando para mim
        </h1>
      </div>
      <div className="text-xl max-w-3xl space-y-2">
        <p>
          Caso algum problema apareça, por favor{" "}
          <a
            href="https://www.linkedin.com/in/arthurmueller31/"
            className="underline"
            target="_blank"
          >
            mande uma mensagem no LinkedIn
          </a>
          , ou{" "}
          <a
            href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=arthurmueller31@gmail.com&su=Assunto&body=Mensagem"
            className="underline"
            target="_blank"
          >
            mande um e-mail
          </a>{" "}
          para explicar e resolvermos o problema. Será de grande ajuda!
        </p>
        <p>Obrigado por usar o site!</p>
      </div>
    </div>
  );
}
