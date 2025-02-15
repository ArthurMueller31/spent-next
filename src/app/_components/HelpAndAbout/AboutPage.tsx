import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-24 font-raleway text-justify flex flex-col justify-center items-center pb-16 px-16">
      <div>
        <h1 className="font-bold text-3xl md:text-5xl mb-5 text-center md:text-start max-w-3xl">
          Sobre o SPENT
        </h1>
      </div>
      <div className="text-xl max-w-3xl space-y-4">
        <p>
          O site foi pensado para resolver um problema de um conhecido. Todas as
          vezes que ele fazia compras, seja no supermercado ou lojas diversas,
          chegando em casa, anotava tudo no Excel.
        </p>
        <p>
          Nisso, veio a ideia de construir o <strong>SPENT</strong>. E já que no
          Excel é possível construir gráficos e tabelas também, você teria que
          tirar um bom tempo para fazer cada coisa e ainda ter tempo de
          adicionar as compras depois.
        </p>
        <p>
          E pensando na <strong>otimização do tempo</strong> que iria trazer,
          esse site foi feito, então invés de estar usando esse tempo para{" "}
          <strong>você mesmo</strong> ter que aprender a como fazer tabelas em
          Excel, gráficos, e &quot;conectar&quot; todos os dados, pode ser usado
          cadastrando suas compras em nosso site e poupando{" "}
          <strong>muito</strong> esforço.
        </p>
        <p>
          Foram pensados gráficos e tabelas contendo todas as informações que
          você <strong>precisa saber</strong>, e que são necessárias para o{" "}
          <strong>controle</strong> de quanto você gastou.
        </p>
        <p>
          E quanto mais você usa, mais rápido é para adicionar novos itens na
          próxima vez que cadastrar a compra de um mesmo local, pois após
          preencher o campo do &quot;local da compra&quot;, o campo de{" "}
          <strong>&quot;Nome do item&quot;</strong> mostra sugestões com as
          letras que você digitar, e quando selecionar alguma opção que está
          disponível, as informações (preço, quantidade, peso) dele{" "}
          <strong>são preenchidas automaticamente!</strong> E claro, caso
          necessário, você pode alterá-las.
        </p>
        <p>
          ⓘ Note que somente os locais que você já adicionou anteriormente têm a
          possibilidade de preenchimento automático, pois geralmente os preços
          variam de um local para o outro.
        </p>
        <p>
          Além de itens, ao clicar/tocar sobre o campo de &quot;local da
          compra&quot;, o mesmo também mostra sugestões!
        </p>

        <p>
          Junto a isso, o site é responsivo, ou seja, funciona tanto em telas de
          computador quanto em celulares (apesar de ser mais fácil de ver todos
          os gráficos e informações em um computador, é possível usar sem
          problemas).
        </p>
        <p className="pt-5">
          <strong>Tem alguma pergunta?</strong>{" "}
          <a
            href="https://www.linkedin.com/in/arthurmueller31/"
            className="underline font-bold"
            target="_blank"
          >
            Envie uma mensagem em meu LinkedIn.
          </a>
        </p>
        <p>
          <strong>Em caso de dúvidas,</strong>{" "}
          <Link href="/duvidas" className="underline font-bold">
            clique aqui.
          </Link>
        </p>
      </div>
    </div>
  );
}
