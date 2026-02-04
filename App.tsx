
import React, { useState, useMemo } from 'react';
import { BagType, LabelData, LabelMode } from './types';
import PrintableLabel from './components/PrintableLabel';

const App: React.FC = () => {
  const [mode, setMode] = useState<LabelMode>(LabelMode.IFOOD);
  
  // iFood States
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [dryCount, setDryCount] = useState<number>(1);
  const [coldCount, setColdCount] = useState<number>(0);

  // Compra States
  const [clientName, setClientName] = useState<string>('');
  const [purchaseNumber, setPurchaseNumber] = useState<string>('');
  const [compraDryCount, setCompraDryCount] = useState<number>(1);
  const [compraColdCount, setCompraColdCount] = useState<number>(0);

  // Placa States
  const [placaTitle, setPlacaTitle] = useState<string>('RESERVADO DRIVE');
  const [placaClientName, setPlacaClientName] = useState<string>('');
  const [placaCount, setPlacaCount] = useState<number>(1);

  const labels = useMemo(() => {
    const generatedLabels: LabelData[] = [];

    if (mode === LabelMode.IFOOD) {
      if (!orderNumber) return [];
      const total = dryCount + coldCount;
      
      for (let i = 1; i <= dryCount; i++) {
        generatedLabels.push({
          title: orderNumber,
          type: BagType.SECA,
          currentVolume: generatedLabels.length + 1,
          totalVolumes: total,
          dryTotal: dryCount,
          coldTotal: coldCount,
          mode: LabelMode.IFOOD
        });
      }
      for (let i = 1; i <= coldCount; i++) {
        generatedLabels.push({
          title: orderNumber,
          type: BagType.GELADA,
          currentVolume: generatedLabels.length + 1,
          totalVolumes: total,
          dryTotal: dryCount,
          coldTotal: coldCount,
          mode: LabelMode.IFOOD
        });
      }
    } else if (mode === LabelMode.COMPRA) {
      if (!purchaseNumber && !clientName) return [];
      const total = compraDryCount + compraColdCount;

      for (let i = 1; i <= compraDryCount; i++) {
        generatedLabels.push({
          title: purchaseNumber,
          clientName: clientName,
          type: BagType.SECA,
          currentVolume: generatedLabels.length + 1,
          totalVolumes: total,
          dryTotal: compraDryCount,
          coldTotal: compraColdCount,
          mode: LabelMode.COMPRA
        });
      }
      // CORREÇÃO: Usando compraColdCount em vez de coldCount
      for (let i = 1; i <= compraColdCount; i++) {
        generatedLabels.push({
          title: purchaseNumber,
          clientName: clientName,
          type: BagType.GELADA,
          currentVolume: generatedLabels.length + 1,
          totalVolumes: total,
          dryTotal: compraDryCount,
          coldTotal: compraColdCount,
          mode: LabelMode.COMPRA
        });
      }
    } else if (mode === LabelMode.PLACA) {
      if (!placaTitle) return [];
      for (let i = 0; i < placaCount; i++) {
        generatedLabels.push({
          title: placaTitle,
          clientName: placaClientName,
          type: BagType.GENERICO,
          currentVolume: 1,
          totalVolumes: 1,
          dryTotal: 0,
          coldTotal: 0,
          mode: LabelMode.PLACA
        });
      }
    }

    return generatedLabels;
  }, [mode, orderNumber, dryCount, coldCount, clientName, purchaseNumber, compraDryCount, compraColdCount, placaTitle, placaClientName, placaCount]);

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Pequeno delay para garantir que o estado de clique não interfira em alguns navegadores
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const handleClear = () => {
    if (mode === LabelMode.IFOOD) {
      setOrderNumber('');
      setDryCount(1);
      setColdCount(0);
    } else if (mode === LabelMode.COMPRA) {
      setClientName('');
      setPurchaseNumber('');
      setCompraDryCount(1);
      setCompraColdCount(0);
    } else {
      setPlacaClientName('');
      setPlacaCount(1);
    }
  };

  const isIFood = mode === LabelMode.IFOOD;
  const isCompra = mode === LabelMode.COMPRA;
  const isPlaca = mode === LabelMode.PLACA;

  // Verificação de validade para habilitar botão
  const isValid = useMemo(() => {
    if (isIFood) return orderNumber.length > 0 && (dryCount + coldCount > 0);
    if (isCompra) return (clientName.length > 0 || purchaseNumber.length > 0) && (compraDryCount + compraColdCount > 0);
    if (isPlaca) return placaTitle.length > 0;
    return false;
  }, [isIFood, isCompra, isPlaca, orderNumber, dryCount, coldCount, clientName, purchaseNumber, compraDryCount, compraColdCount, placaTitle]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Selection Tabs */}
      <div className="no-print flex mb-4 bg-gray-200 p-1 rounded-xl shadow-inner">
        <button
          onClick={() => setMode(LabelMode.IFOOD)}
          className={`flex-1 py-4 font-black rounded-lg transition-all uppercase tracking-widest text-sm md:text-base ${isIFood ? 'bg-black text-white shadow-lg scale-[1.02]' : 'text-gray-600 hover:bg-gray-300'}`}
        >
          PEDIDO IFOOD
        </button>
        <button
          onClick={() => setMode(LabelMode.COMPRA)}
          className={`flex-1 py-4 font-black rounded-lg transition-all uppercase tracking-widest text-sm md:text-base ${isCompra ? 'bg-black text-white shadow-lg scale-[1.02]' : 'text-gray-600 hover:bg-gray-300'}`}
        >
          ETIQUETA COMPRA
        </button>
        <button
          onClick={() => setMode(LabelMode.PLACA)}
          className={`flex-1 py-4 font-black rounded-lg transition-all uppercase tracking-widest text-sm md:text-base ${isPlaca ? 'bg-black text-white shadow-lg scale-[1.02]' : 'text-gray-600 hover:bg-gray-300'}`}
        >
          PLACAS DE AVISO
        </button>
      </div>

      {/* Input Section - UI only */}
      <div className="no-print bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 sticky top-4 z-50">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-gray-800 flex items-center uppercase tracking-tight">
            <svg className={`w-8 h-8 mr-3 ${isIFood ? 'text-red-600' : isCompra ? 'text-green-600' : 'text-orange-600'}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
            </svg>
            {isIFood ? 'Gerador iFood' : isCompra ? 'Identificação de Compras' : 'Placas de Sinalização'}
          </h1>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500 uppercase">
            v2.6 - SEMAR ENTREGA
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {isIFood && (
            <>
              <div className="md:col-span-4 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 uppercase">Nº Pedido (4 Dígitos)</label>
                <input
                  type="text"
                  placeholder="Ex: 1234"
                  maxLength={4}
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg p-3 text-3xl font-black focus:border-red-500 outline-none transition-colors text-center"
                />
              </div>
              <div className="md:col-span-4 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 uppercase text-center">Sacolas SECAS</label>
                <div className="flex items-center h-full">
                  <button onClick={() => setDryCount(Math.max(0, dryCount - 1))} className="bg-gray-100 hover:bg-gray-200 p-4 rounded-l-lg font-black text-2xl border-2 border-r-0 border-gray-300">-</button>
                  <input
                    type="number"
                    value={dryCount}
                    onChange={(e) => setDryCount(parseInt(e.target.value) || 0)}
                    className="border-2 border-gray-300 w-full text-center p-3 text-2xl font-black outline-none h-full"
                  />
                  <button onClick={() => setDryCount(dryCount + 1)} className="bg-gray-100 hover:bg-gray-200 p-4 rounded-r-lg font-black text-2xl border-2 border-l-0 border-gray-300">+</button>
                </div>
              </div>
              <div className="md:col-span-4 flex flex-col">
                <label className="text-sm font-bold text-blue-600 mb-1 uppercase text-center">Sacolas GELADAS</label>
                <div className="flex items-center h-full">
                  <button onClick={() => setColdCount(Math.max(0, coldCount - 1))} className="bg-blue-50 hover:bg-blue-100 p-4 rounded-l-lg font-black text-2xl border-2 border-r-0 border-blue-200 text-blue-700">-</button>
                  <input
                    type="number"
                    value={coldCount}
                    onChange={(e) => setColdCount(parseInt(e.target.value) || 0)}
                    className="border-2 border-blue-200 w-full text-center p-3 text-2xl font-black outline-none text-blue-700 h-full"
                  />
                  <button onClick={() => setColdCount(coldCount + 1)} className="bg-blue-50 hover:bg-blue-100 p-4 rounded-r-lg font-black text-2xl border-2 border-l-0 border-blue-200 text-blue-700">+</button>
                </div>
              </div>
            </>
          )}

          {isCompra && (
            <>
              <div className="md:col-span-4 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 uppercase">Nº da Compra (7 Dígitos)</label>
                <input
                  type="text"
                  placeholder="Ex: 1234567"
                  maxLength={7}
                  value={purchaseNumber}
                  onChange={(e) => setPurchaseNumber(e.target.value)}
                  className="border-2 border-gray-300 rounded-lg p-3 text-3xl font-black focus:border-green-600 outline-none transition-colors text-center"
                />
              </div>
              <div className="md:col-span-8 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 uppercase">Nome do Cliente</label>
                <input
                  type="text"
                  placeholder="NOME COMPLETO"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value.toUpperCase())}
                  className="border-2 border-gray-300 rounded-lg p-3 text-2xl font-black focus:border-green-600 outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-6 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 uppercase text-center">Volumes SECOS</label>
                <div className="flex items-center h-full">
                  <button onClick={() => setCompraDryCount(Math.max(0, compraDryCount - 1))} className="bg-gray-100 hover:bg-gray-200 p-4 rounded-l-lg font-black text-2xl border-2 border-r-0 border-gray-300">-</button>
                  <input
                    type="number"
                    value={compraDryCount}
                    onChange={(e) => setCompraDryCount(parseInt(e.target.value) || 0)}
                    className="border-2 border-gray-300 w-full text-center p-3 text-2xl font-black outline-none h-full"
                  />
                  <button onClick={() => setCompraDryCount(compraDryCount + 1)} className="bg-gray-100 hover:bg-gray-200 p-4 rounded-r-lg font-black text-2xl border-2 border-l-0 border-gray-300">+</button>
                </div>
              </div>
              <div className="md:col-span-6 flex flex-col">
                <label className="text-sm font-bold text-blue-600 mb-1 uppercase text-center">Volumes GELADOS</label>
                <div className="flex items-center h-full">
                  <button onClick={() => setCompraColdCount(Math.max(0, compraColdCount - 1))} className="bg-blue-50 hover:bg-blue-100 p-4 rounded-l-lg font-black text-2xl border-2 border-r-0 border-blue-200 text-blue-700">-</button>
                  <input
                    type="number"
                    value={compraColdCount}
                    onChange={(e) => setCompraColdCount(parseInt(e.target.value) || 0)}
                    className="border-2 border-blue-200 w-full text-center p-3 text-2xl font-black outline-none text-blue-700 h-full"
                  />
                  <button onClick={() => setCompraColdCount(compraColdCount + 1)} className="bg-blue-50 hover:bg-blue-100 p-4 rounded-r-lg font-black text-2xl border-2 border-l-0 border-blue-200 text-blue-700">+</button>
                </div>
              </div>
            </>
          )}

          {isPlaca && (
            <>
              <div className="md:col-span-5 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 uppercase">Aviso Principal</label>
                <input
                  type="text"
                  placeholder="Ex: RESERVADO DRIVE"
                  value={placaTitle}
                  onChange={(e) => setPlacaTitle(e.target.value.toUpperCase())}
                  className="border-2 border-gray-300 rounded-lg p-3 text-2xl font-black focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-5 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 uppercase">Nome do Cliente / Info</label>
                <input
                  type="text"
                  placeholder="EX: JOÃO DA SILVA"
                  value={placaClientName}
                  onChange={(e) => setPlacaClientName(e.target.value.toUpperCase())}
                  className="border-2 border-gray-300 rounded-lg p-3 text-2xl font-black focus:border-orange-500 outline-none transition-colors"
                />
              </div>
              <div className="md:col-span-2 flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1 uppercase text-center">Qtd</label>
                <input
                  type="number"
                  value={placaCount}
                  onChange={(e) => setPlacaCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border-2 border-gray-300 w-full text-center p-3 text-2xl font-black outline-none h-full rounded-lg"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={handlePrint}
            disabled={!isValid}
            className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-black py-5 rounded-xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center text-2xl uppercase tracking-[0.2em]"
          >
            <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            IMPRIMIR {isPlaca ? 'PLACA' : 'ETIQUETAS'}
          </button>
          <button
            onClick={handleClear}
            className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-colors border-2 border-gray-300 uppercase text-sm"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Preview / Print Content */}
      <div className="w-full">
        {labels.length > 0 ? (
          <div className="flex flex-col gap-8 print:gap-0">
            {labels.map((label, index) => (
              <PrintableLabel key={`${label.mode}-${index}`} data={label} />
            ))}
          </div>
        ) : (
          <div className="no-print text-center py-20 bg-white rounded-xl border-4 border-dotted border-gray-300 flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 text-2xl font-black uppercase tracking-widest">
              {isIFood ? 'Aguardando Pedido iFood' : isCompra ? 'Preencha os Dados da Compra' : 'Aguardando Texto da Placa'}
            </p>
          </div>
        )}
      </div>

      {/* Footer / Instructions */}
      <footer className="no-print mt-12 text-center text-gray-500 pb-10 border-t pt-8">
        <h2 className="font-black text-gray-800 mb-4 text-xl uppercase tracking-tighter">Configuração de Impressão Recomendada:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm max-w-3xl mx-auto mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="font-bold block mb-1 text-black">CORES:</span>
            Modo <strong>Preto e Branco</strong> para sinalização clara e legível.
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="font-bold block mb-1 text-black">TAMANHO:</span>
            Para placas, use <strong>"Ajustar à Página"</strong> para tamanho máximo.
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span className="font-bold block mb-1 text-black">PAPEL:</span>
            Papel comum A4 ou cartolina branca para maior durabilidade.
          </div>
        </div>
        
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          © Todos os direitos reservados a JM
        </p>
      </footer>
    </div>
  );
};

export default App;
