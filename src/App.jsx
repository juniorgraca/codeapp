import { useState, useEffect } from 'react';
import './App.css';
import Quagga from 'quagga'; // Importando o Quagga

function App() {

  const [isScanning, setIsScanning] = useState(false); // Estado para controlar o início da leitura

  // Função para iniciar a captura quando o botão for clicado
  const startScanning = () => {
    setIsScanning(true);
  };

  useEffect(() => {
    if (isScanning) {
      // Inicializando o Quagga para captura de código de barras ou QR Code
      Quagga.init({
        inputStream: {
          type: 'LiveStream',  // Usando a câmera
          target: '#barcode-scanner',  // Referência ao elemento para mostrar a câmera
        },
        decoder: {
          readers: ['qr_reader', 'code_128_reader'], // Adicionando leitores de QR e código de barras
        },
        locator: {
          halfSample: true, // Melhorar a precisão da detecção
          patchSize: 'medium', // Tamanho da área de análise
          debug: {
            drawBoundingBox: true, // Desenha a caixa ao redor do código
            showFrequency: true, // Mostra a frequência da detecção
            drawScanline: true, // Desenha as linhas de leitura (scanlines)
            showPattern: true, // Exibe o padrão de leitura (ex: linhas horizontais ou verticais)
          },
        },
      }, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        // Aguardando o Quagga estar pronto para capturar
        Quagga.onDetected((result) => {
          console.log('QR Code detectado:', result.codeResult.code);
        });

        Quagga.start();  // Inicia a captura
      });
    }

    return () => {
      if (isScanning) {
        // Parar o Quagga quando o componente for desmontado ou se o estado mudar
        Quagga.stop();
      }
    };
  }, [isScanning]);

  return (
    <>
      {/* Botão para iniciar a leitura do QR Code */}
      <button onClick={startScanning} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}>
        Ler QR Code
      </button>

      {isScanning ? (
        <div id="barcode-scanner" style={{ width: '100%', height: '450px'}}></div>
      ) : (
        <div style={{ width: '100%', height: '450px'}}></div>
      )}
    </>
  );
}

export default App;
