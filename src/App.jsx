import { useState, useEffect } from 'react';
import './App.css';
import Quagga from 'quagga'; // Importando o Quagga

function App() {
  const [isScanning, setIsScanning] = useState(false); // Estado para controlar o início da leitura
  const [scannedCode, setScannedCode] = useState(''); // Estado para armazenar o código lido

  const startScanning = () => {
    setIsScanning(true);
  };

  useEffect(() => {
    if (isScanning) {
      Quagga.init(
        {
          inputStream: {
            name: 'Live',
            type: 'LiveStream',
            target: document.querySelector('#barcode-scanner'),
            constraints: {
              facingMode: 'environment', // Usar a câmera traseira
            },
          },
          decoder: {
            readers: ['qr_reader'], // Configurando para leitura apenas de QR Codes
          },
          locator: {
            patchSize: 'medium',
            halfSample: true,
          },
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true, // Mostra as linhas guias (scanlines)
          },
        },
        (err) => {
          if (err) {
            console.error('Erro ao inicializar o Quagga:', err);
            return;
          }

          console.log('Quagga iniciado com sucesso.');
          Quagga.start();
        }
      );

      Quagga.onDetected((result) => {
        console.log('QR Code detectado:', result.codeResult.code);
        setScannedCode(result.codeResult.code);
      });
    }

    return () => {
      if (isScanning) {
        Quagga.stop();
      }
    };
  }, [isScanning]);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button
        onClick={startScanning}
        style={{ padding: '10px 20px', fontSize: '16px', marginBottom: '20px' }}
      >
        Iniciar Leitura
      </button>

      <div
        id="barcode-scanner"
        style={{
          width: '100%',
          height: '450px',
          border: '1px solid #ddd',
          backgroundColor: '#f9f9f9',
        }}
      ></div>

      {scannedCode && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
          }}
        >
          <strong>QR Code detectado:</strong> {scannedCode}
        </div>
      )}
    </div>
  );
}

export default App;
