import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";

function App() {

  // =========================
  // ESTADOS
  // =========================

  const [valor, setValor] = useState("0");
  const [expressao, setExpressao] = useState("");
  const [memoria, setMemoria] = useState(0);
  const [novoNumero, setNovoNumero] = useState(false);
  const [resultadoCalculado, setResultadoCalculado] = useState(false);


  // =========================
  // FUNÇÕES AUXILIARES
  // =========================

  // Identifica os operadores matemáticos
  const ehOperador = (caractere) => {
    return ["+", "-", "*", "/"].includes(caractere);
  };


  // Formata os resultados numéricos
  const formatarResultado = (numero) => {

    if (!Number.isFinite(numero)) {
      return "Erro";
    }

    return String(Number(numero.toPrecision(10)));
  };


  // Exibe números negativos entre parênteses
  const mostrarNumero = (numero) => {

    if (numero.startsWith("-")) {
      return `(${numero})`;
    }

    return numero;
  };


  // Localiza o último número da expressão
  const obterUltimoNumero = (texto) => {

    const resultado = texto.match(
      /(\(-\d+(?:\.\d*)?\)|\d+(?:\.\d*)?)$/
    );

    if (!resultado) {
      return null;
    }

    const numeroExibido = resultado[0];

    return {
      texto: numeroExibido,
      numero: numeroExibido.replace(/[()]/g, ""),
      inicio: texto.length - numeroExibido.length,
    };
  };


  // Substitui apenas o último número da expressão
  const substituirUltimoNumero = (novoNumero) => {

    const ultimo = obterUltimoNumero(expressao);

    if (!ultimo) {
      setExpressao(mostrarNumero(novoNumero));
      return;
    }

    const parteAnterior = expressao.slice(0, ultimo.inicio);

    setExpressao(
      parteAnterior + mostrarNumero(novoNumero)
    );
  };


  // =========================
  // ADICIONAR NÚMEROS
  // =========================

  const adicionarNumero = (numero) => {

    // Se acabou de calcular, inicia outra expressão
    if (resultadoCalculado || valor === "Erro") {

      setValor(numero);
      setExpressao(numero);
      setNovoNumero(false);
      setResultadoCalculado(false);

      return;
    }

    // Se acabou de selecionar uma operação
    if (novoNumero) {

      setValor(numero);
      setExpressao(expressao + numero);
      setNovoNumero(false);

      return;
    }

    // Adiciona o número durante a digitação
    const novoValor =
      valor === "0" ? numero : valor + numero;

    // Limite de 10 caracteres por número
    if (novoValor.length > 10) {
      return;
    }

    setValor(novoValor);

    substituirUltimoNumero(novoValor);
  };


  // =========================
  // ADICIONAR PONTO DECIMAL
  // =========================

  const adicionaPonto = () => {

    // Após pressionar =
    if (resultadoCalculado || valor === "Erro") {

      setValor("0.");
      setExpressao("0.");
      setNovoNumero(false);
      setResultadoCalculado(false);

      return;
    }

    // Após selecionar uma operação
    if (novoNumero) {

      setValor("0.");
      setExpressao(expressao + "0.");
      setNovoNumero(false);

      return;
    }

    // Impede dois pontos no mesmo número
    if (
      valor.includes(".") ||
      valor.length >= 10
    ) {
      return;
    }

    const novoValor = valor + ".";

    setValor(novoValor);

    substituirUltimoNumero(novoValor);
  };


  // =========================
  // BOTÃO DEL
  // =========================

  const apagarValoresDel = () => {

    // Se houver erro, limpa o visor
    if (valor === "Erro") {

      setValor("0");
      setExpressao("");
      setNovoNumero(false);
      setResultadoCalculado(false);

      return;
    }

    // Permite editar um resultado
    if (resultadoCalculado) {
      setResultadoCalculado(false);
    }

    // Se o último caractere for uma operação
    if (novoNumero) {

      const novaExpressao = expressao.slice(0, -1);

      setExpressao(novaExpressao);

      const ultimo = obterUltimoNumero(novaExpressao);

      setValor(ultimo ? ultimo.numero : "0");
      setNovoNumero(false);

      return;
    }

    const ultimo = obterUltimoNumero(expressao);

    if (!ultimo) {

      setValor("0");
      setExpressao("");

      return;
    }

    // Apaga o último dígito
    const numeroAtual = ultimo.numero;

    let novoValor = numeroAtual.slice(0, -1);

    if (
      novoValor === "" ||
      novoValor === "-"
    ) {
      novoValor = "0";
    }

    const parteAnterior = expressao.slice(0, ultimo.inicio);

    // Se apagou o último dígito após uma operação
    if (
      novoValor === "0" &&
      parteAnterior.length > 0 &&
      ehOperador(parteAnterior.slice(-1))
    ) {

      setExpressao(parteAnterior);
      setValor("0");
      setNovoNumero(true);

      return;
    }

    setValor(novoValor);

    setExpressao(
      parteAnterior + mostrarNumero(novoValor)
    );
  };


  // =========================
  // BOTÃO AC
  // =========================

  const limparTotal = () => {

    setValor("0");
    setExpressao("");
    setMemoria(0);
    setNovoNumero(false);
    setResultadoCalculado(false);
  };


  // =========================
  // TROCAR SINAL +/-
  // =========================

  const trocarSinal = () => {

    if (valor === "Erro") {
      return;
    }

    // Se há uma operação aguardando número
    if (novoNumero) {
      return;
    }

    if (Number(valor) === 0) {
      return;
    }

    const novoValor = valor.startsWith("-")
      ? valor.slice(1)
      : "-" + valor;

    setValor(novoValor);

    substituirUltimoNumero(novoValor);

    setResultadoCalculado(false);
  };


  // =========================
  // PORCENTAGEM
  // =========================

  const calcularPorcentagem = () => {

    if (valor === "Erro" || novoNumero) {
      return;
    }

    const resultado = formatarResultado(
      Number(valor) / 100
    );

    setValor(resultado);

    substituirUltimoNumero(resultado);

    setResultadoCalculado(false);
  };


  // =========================
  // RAIZ QUADRADA
  // =========================

  const calcularRaiz = () => {

    if (valor === "Erro" || novoNumero) {
      return;
    }

    const numero = Number(valor);

    // Não permite raiz quadrada de número negativo
    if (numero < 0) {

      setValor("Erro");
      setExpressao("Erro");
      setResultadoCalculado(true);

      return;
    }

    const resultado = formatarResultado(
      Math.sqrt(numero)
    );

    setValor(resultado);

    substituirUltimoNumero(resultado);

    setResultadoCalculado(false);
  };


  // =========================
  // MEMÓRIA
  // =========================

  // M+
  const adicionarMemoria = () => {

    if (valor === "Erro") {
      return;
    }

    setMemoria(
      (anterior) => anterior + Number(valor)
    );
  };


  // M-
  const subtrairMemoria = () => {

    if (valor === "Erro") {
      return;
    }

    setMemoria(
      (anterior) => anterior - Number(valor)
    );
  };


  // MRC
  const recuperarMemoria = () => {

    const numero = formatarResultado(memoria);

    if (resultadoCalculado || valor === "Erro") {

      setValor(numero);
      setExpressao(mostrarNumero(numero));
      setResultadoCalculado(false);
      setNovoNumero(false);

      return;
    }

    if (novoNumero) {

      setValor(numero);

      setExpressao(
        expressao + mostrarNumero(numero)
      );

      setNovoNumero(false);

      return;
    }

    setValor(numero);

    substituirUltimoNumero(numero);
  };


  // =========================
  // SELECIONAR OPERAÇÃO
  // =========================

  const selecionarOperacao = (tipoOperacao) => {

    if (valor === "Erro") {
      return;
    }

    // Após pressionar =, continua usando o resultado
    if (resultadoCalculado) {

      setExpressao(
        mostrarNumero(valor) + tipoOperacao
      );

      setNovoNumero(true);
      setResultadoCalculado(false);

      return;
    }

    // Se já existe uma operação no final,
    // substitui pela nova operação
    if (novoNumero) {

      setExpressao(
        expressao.slice(0, -1) + tipoOperacao
      );

      return;
    }

    // Apenas adiciona a operação à expressão
    // NÃO realiza nenhum cálculo
    setExpressao(
      (expressao || valor) + tipoOperacao
    );

    setNovoNumero(true);
  };


  // =========================
  // INTERPRETAR EXPRESSÃO
  // =========================

  const interpretarExpressao = (texto) => {

    // Remove espaços
    const entrada = texto.replace(/\s/g, "");

    // Identifica números e operadores
    const partes = entrada.match(
      /\(-\d+(?:\.\d*)?\)|\d+(?:\.\d*)?|[+\-*/]/g
    );

    if (!partes || partes.join("") !== entrada) {
      return "Erro";
    }

    const numeros = [];
    const operadores = [];

    // Separa números e operações
    for (let i = 0; i < partes.length; i++) {

      const parte = partes[i];

      if (ehOperador(parte)) {

        operadores.push(parte);

      } else {

        const numero = Number(
          parte.replace(/[()]/g, "")
        );

        if (!Number.isFinite(numero)) {
          return "Erro";
        }

        numeros.push(numero);
      }
    }

    // Verifica se a expressão está completa
    if (numeros.length !== operadores.length + 1) {
      return "Erro";
    }

    // =========================
    // PRIMEIRO: MULTIPLICAÇÃO E DIVISÃO
    // =========================

    let i = 0;

    while (i < operadores.length) {

      const operador = operadores[i];

      if (operador === "*" || operador === "/") {

        const numero1 = numeros[i];
        const numero2 = numeros[i + 1];

        if (operador === "/" && numero2 === 0) {
          return "Erro";
        }

        const resultado =
          operador === "*"
            ? numero1 * numero2
            : numero1 / numero2;

        // Substitui os dois números pelo resultado
        numeros.splice(i, 2, resultado);

        // Remove a operação utilizada
        operadores.splice(i, 1);

      } else {

        i++;
      }
    }

    // =========================
    // DEPOIS: SOMA E SUBTRAÇÃO
    // =========================

    while (operadores.length > 0) {

      const operador = operadores.shift();

      const numero1 = numeros.shift();
      const numero2 = numeros.shift();

      const resultado =
        operador === "+"
          ? numero1 + numero2
          : numero1 - numero2;

      numeros.unshift(resultado);
    }

    return formatarResultado(numeros[0]);
  };


  // =========================
  // BOTÃO =
  // =========================

  const calcularResultado = () => {

    // Impede calcular uma expressão incompleta
    if (
      novoNumero ||
      resultadoCalculado ||
      expressao === "" ||
      expressao === "Erro"
    ) {
      return;
    }

    // Se não houver operação, mantém o número
    const resultado = interpretarExpressao(expressao);

    setValor(resultado);

    setExpressao(
      resultado === "Erro"
        ? "Erro"
        : mostrarNumero(resultado)
    );

    setNovoNumero(false);
    setResultadoCalculado(true);
  };


  // =========================
  // INTERFACE
  // =========================

  return (

    <View style={styles.container}>

      <StatusBar style="light" />

      <Text style={styles.titulo}>
        Calculadora da Bibi ♡
      </Text>

      {/* VISOR */}

      <Text style={styles.painel} numberOfLines={1} adjustsFontSizeToFit>
        {(expressao || valor)
          .replace(/\./g, ",")
          .replace(/\*/g, "×")
          .replace(/\//g, "÷")}
      </Text>


      {/* PRIMEIRA LINHA */}

      <View style={styles.colunas}>

        <TouchableOpacity
          style={styles.botao}
          onPress={recuperarMemoria}
        >
          <Text style={styles.textoBotao}>MRC</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={subtrairMemoria}
        >
          <Text style={styles.textoBotao}>M-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={adicionarMemoria}
        >
          <Text style={styles.textoBotao}>M+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={calcularRaiz}
        >
          <Text style={styles.textoBotao}>RAIZ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>OFF</Text>
        </TouchableOpacity>

      </View>


      {/* SEGUNDA LINHA */}

      <View style={styles.colunas}>

        <TouchableOpacity
          style={styles.botaoEspecial}
          onPress={limparTotal}
        >
          <Text style={styles.textoEspecial}>AC</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoEspecial}
          onPress={apagarValoresDel}
        >
          <Text style={styles.textoEspecial}>DEL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoEspecial}
          onPress={trocarSinal}
        >
          <Text style={styles.textoEspecial}>+/-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoEspecial}
          onPress={calcularPorcentagem}
        >
          <Text style={styles.textoEspecial}>%</Text>
        </TouchableOpacity>

      </View>


      {/* TERCEIRA LINHA */}

      <View style={styles.colunas}>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("7")}
        >
          <Text style={styles.textoNumeros}>7</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("8")}
        >
          <Text style={styles.textoNumeros}>8</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("9")}
        >
          <Text style={styles.textoNumeros}>9</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoOperacao}
          onPress={() => selecionarOperacao("/")}
        >
          <Text style={styles.textoOperacao}>÷</Text>
        </TouchableOpacity>

      </View>


      {/* QUARTA LINHA */}

      <View style={styles.colunas}>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("4")}
        >
          <Text style={styles.textoNumeros}>4</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("5")}
        >
          <Text style={styles.textoNumeros}>5</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("6")}
        >
          <Text style={styles.textoNumeros}>6</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoOperacao}
          onPress={() => selecionarOperacao("*")}
        >
          <Text style={styles.textoOperacao}>×</Text>
        </TouchableOpacity>

      </View>


      {/* QUINTA LINHA */}

      <View style={styles.colunas}>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("1")}
        >
          <Text style={styles.textoNumeros}>1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("2")}
        >
          <Text style={styles.textoNumeros}>2</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("3")}
        >
          <Text style={styles.textoNumeros}>3</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoOperacao}
          onPress={() => selecionarOperacao("-")}
        >
          <Text style={styles.textoOperacao}>−</Text>
        </TouchableOpacity>

      </View>


      {/* SEXTA LINHA */}

      <View style={styles.colunas}>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={() => adicionarNumero("0")}
        >
          <Text style={styles.textoNumeros}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoNumero}
          onPress={adicionaPonto}
        >
          <Text style={styles.textoNumeros}>,</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoIgual}
          onPress={calcularResultado}
        >
          <Text style={styles.textoOperacao}>=</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoOperacao}
          onPress={() => selecionarOperacao("+")}
        >
          <Text style={styles.textoOperacao}>+</Text>
        </TouchableOpacity>

      </View>


      {/* RODAPÉ */}

      <View style={styles.rodape}>

        <Text style={styles.rodapeNome}>
          Maria Gabriela ♡
        </Text>

      </View>

    </View>
  );
}

export default App;


// =========================
// ESTILIZAÇÃO
// =========================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F3FA",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },

  titulo: {
    textAlign: "center",
    backgroundColor: "#6D4C7D",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 12,
    width: "100%",
  },

  painel: {
    width: "92%",
    textAlign: "right",
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#29222E",
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    marginBottom: 8,
  },

  colunas: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  botao: {
    backgroundColor: "#E8DCEE",
    borderRadius: 12,
    height: 45,
    width: "17%",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    color: "#6D4C7D",
    fontSize: 13,
    fontWeight: "bold",
  },

  botaoEspecial: {
    backgroundColor: "#DCC8E5",
    borderRadius: 18,
    height: 62,
    width: "21%",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  textoEspecial: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#6D4C7D",
  },

  botaoNumero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    height: 62,
    width: "21%",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  textoNumeros: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3A3040",
    textAlign: "center",
  },

  botaoOperacao: {
    backgroundColor: "#C86B98",
    borderRadius: 18,
    height: 62,
    width: "21%",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  textoOperacao: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  botaoIgual: {
    backgroundColor: "#8E5A9F",
    borderRadius: 18,
    height: 62,
    width: "21%",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  rodape: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  rodapeNome: {
    color: "#8E5A9F",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },

});