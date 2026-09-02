import { StatusBar } from "expo-status-bar";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import React, { useState } from "react";



function App() {
  //variáveis
  const [valor, setValor] = useState("0");
  const [valorGuardado, setValorGuardado] = useState(null);
  const [operacao, setOperacao] = useState(null);
  const [expressao, setExpressao] = useState("");


  //Limitando número de caracteres no visor para 9 caracteres.
  const adicionarNumero = (numero) => {
    if (valor.length <10){
      setValor(valor === "0" ? numero : valor + numero);
      setExpressao(expressao + numero);
    }
  };

  //Adionando ponto "." nos números
  const adicionaPonto = () => {
    if (!valor.includes(".") && valor.length < 10) {
      setValor(valor + ".")
    };
  }

  //Botão de limpeza um a um - DEL
  const apagarValoresDel = () => {
    if (valor.length === 1) {
      setValor("0");
      setExpressao("");}
    else{
      setValor(valor.slice(0,-1));
      setExpressao(expressao.slice(0,-1));
    }
    };

  // Botão limpeza total - AC
  const limparTotal = () => {
    setValor("0");
    setExpressao("");
  };

  //Botão troca sinal - +/-
  const trocarSinal = () => {
    if (valor !== "0"){
      if(valor.startsWith("-")){
        setValor(valor.slice(1));}
      else {
        setValor("-" + valor);
      }
      }
    };

  //Botão de Porcentagem
  const calcularPorcentagem = () => {
    setValor (String(Number(valor/100)))
  }

  //Expressão do cálculo aparece no visor
  const selecionarOperacao = (tipoOperacao) => {
    setValorGuardado(valor);
    setOperacao(tipoOperacao);
    setExpressao(expressao + tipoOperacao)
    setValor("0");
  };

  //Calculando resultados
  const calcularResultado = () => {
    const numero1 = Number(valorGuardado);
    const numero2 = Number(valor);

    if(operacao === "+"){
      const resultado = numero1 + numero2;
      setValor(String(resultado));
      setExpressao(String(resultado));
    };
  }



  return (
    <View style={styles.container}>

      <StatusBar style="light" />
      <Text style={styles.titulo}>Calculadora da Bibi ♡</Text>

      <Text style={styles.painel}>{expressao || valor}</Text>


      <View style={styles.colunas}>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>MRC</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>M-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>M+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>RAIZ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao}>
          <Text style={styles.textoBotao}>OFF</Text>
        </TouchableOpacity>

      </View>




      <View style={styles.colunas}>

        <TouchableOpacity style={styles.botaoEspecial}
        onPress={limparTotal}>
          <Text style={styles.textoEspecial}>AC</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoEspecial}
        onPress={apagarValoresDel}>
          <Text style={styles.textoEspecial}>DEL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoEspecial}
        onPress={trocarSinal}>
          <Text style={styles.textoEspecial}>+/-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoEspecial}
        onPress={calcularPorcentagem}>
          <Text style={styles.textoEspecial}>%</Text>
        </TouchableOpacity>

      </View>




      <View style={styles.colunas}>

        <TouchableOpacity style={styles.botaoNumero}
         onPress={() => adicionarNumero("7")}>
         <Text style={styles.textoNumeros}>7</Text>
        </TouchableOpacity>




        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("8")}>
          <Text style={styles.textoNumeros}>8</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("9")}>
          <Text style={styles.textoNumeros}>9</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoOperacao}>
          <Text style={styles.textoOperacao}>÷</Text>
        </TouchableOpacity>

      </View>




      <View style={styles.colunas}>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("4")}>
          <Text style={styles.textoNumeros}>4</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("5")}>
          <Text style={styles.textoNumeros}>5</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("6")}>
          <Text style={styles.textoNumeros}>6</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoOperacao}>
          <Text style={styles.textoOperacao}>×</Text>
        </TouchableOpacity>

      </View>




      <View style={styles.colunas}>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("1")}>
          <Text style={styles.textoNumeros}>1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("2")}>
          <Text style={styles.textoNumeros}>2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("3")}>
          <Text style={styles.textoNumeros}>3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoOperacao}>
          <Text style={styles.textoOperacao}>−</Text>
        </TouchableOpacity>

      </View>




      <View style={styles.colunas}>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={() => adicionarNumero("0")}>
          <Text style={styles.textoNumeros}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoNumero}
        onPress={adicionaPonto}>
          <Text style={styles.textoNumeros}>.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoIgual}
        onPress={calcularResultado}>
          <Text style={styles.textoOperacao}>=</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoOperacao}
        onPress={() => selecionarOperacao ("+")}>
          <Text style={styles.textoOperacao}>+</Text>
        </TouchableOpacity>

      </View>


    <View style={styles.rodape}>
      <Text style={styles.rodapeNome}>Maria Gabriela ♡</Text>
    </View>

    </View>
  );
}

export default App;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F3FA",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },



  // Titulo
  titulo: {
    textAlign: "center",
    backgroundColor: "#6D4C7D",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 12,
    width: "100%",
  },


  // visor operacoes
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


  // linhas
  colunas: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },


  // Primeira linha
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


  // Segunda linha
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


  // Todos os numeros
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


  // botoes operacao
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


  // botao de igual
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