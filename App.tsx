
import React, { useState, useMemo, useEffect } from 'react';
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

  const isIFood = mode === LabelMode.IFOOD;
  const isCompra = mode === LabelMode.COMPRA;
  const isPlaca = mode === LabelMode.PLACA;

  // Sincroniza a orientação de impressão do navegador via classe no body
  useEffect(() => {
    if (isPlaca) {
      document.body.classList.add('landscape-mode');
    } else {
      document.body.classList.remove('landscape-mode');
    }
  }, [isPlaca]);

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
    // Pequeno delay para garantir que o navegador processou a alteração de classe no body se necessário
    setTimeout(() => window.print(), 100);
  };

  const handleClear = () => {
    if (isIFood) {
      setOrderNumber('');
      setDryCount(1);
      setColdCount(0);
    } else if (isCompra) {
      setClientName('');
      setPurchaseNumber('');
      setCompraDryCount(1);
      setCompraColdCount(0);
    } else {
      setPlacaClientName('');
      setPlacaCount(1);
    }
  };

  const isValid = useMemo(() => {
    if (isIFood) return orderNumber.length >= 1 && (dryCount + coldCount > 0);
    if (isCompra) return (clientName.length > 0 || purchaseNumber.length > 0);
    if (isPlaca) return placaTitle.length > 0;
    return false;
  }, [isIFood, isCompra, isPlaca, orderNumber, dryCount, coldCount, clientName, purchaseNumber, placaTitle]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 print:p-0 print:max-w-none">
      {/* Navigation Tabs */}
      <nav className="no-print flex mb-6 bg-gray-200 p-1 rounded-xl shadow-inner">
        <button
          onClick={() => setMode(LabelMode.IFOOD)}
          className={`flex-1 py-4 font-black rounded-lg transition-all uppercase tracking-widest text-xs md:text-sm ${isIFood ? 'bg-black text-white shadow-lg' : 'text-gray-600 hover:bg-gray-300'}`}
        >
          IFOOD
        </button>
        <button
          onClick={() => setMode(LabelMode.COMPRA)}
          className={`flex-1 py-4 font-black rounded-lg transition-all uppercase tracking-widest text-xs md:text-sm ${isCompra ? 'bg-black text-white shadow-lg' : 'text-gray-600 hover:bg-gray-300'}`}
        >
          COMPRA
        </button>
        <button
          onClick={() => setMode(LabelMode.PLACA)}
          className={`flex-1 py-4 font-black rounded-lg transition-all uppercase tracking-widest text-xs md:text-sm ${isPlaca ? 'bg-black text-white shadow-lg' : 'text-gray-600 hover:bg-gray-300'}`}
        >
          PLACAS
        </button>
      </nav>

      {/* Input Form */}
      <section className="no-print bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8 sticky top-4 z-50">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center uppercase tracking-tight">
            <span className={`w-3 h-8 mr-3 rounded-full ${isIFood ? 'bg-red-600' : isCompra ? 'bg-green-600' : 'bg-orange-500'}`}></span>
            {isIFood ? 'Gerador iFood' : isCompra ? 'Etiqueta Compra' : 'Placas de Aviso'}
          </h1>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase">
            STABLE V3.0
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {isIFood && (
            <>
              <div className="md:col-span-4">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nº Pedido</label>
                <input
                  type="text"
                  placeholder="0000"
                  maxLength={4}
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-2xl font-black text-center focus:border-red-500 outline-none"
                />
              </div>
              <div className="md:col-span-4">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Secas</label>
                <div className="flex">
                  <button onClick={() => setDryCount(Math.max(0, dryCount - 1))} className="bg-gray-100 p-3 rounded-l-lg border-2 border-r-0 font-bold">-</button>
                  <input 
                    type="number" 
                    value={dryCount} 
                    onChange={(e) => setDryCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border-2 border-gray-300 p-3 text-xl font-black text-center outline-none" 
                  />
                  <button onClick={() => setDryCount(dryCount + 1)} className="bg-gray-100 p-3 rounded-r-lg border-2 border-l-0 font-bold">+</button>
                </div>
              </div>
              <div className="md:col-span-4">
                <label className="text-xs font-bold text-blue-500 uppercase mb-1 block">Geladas</label>
                <div className="flex">
                  <button onClick={() => setColdCount(Math.max(0, coldCount - 1))} className="bg-blue-50 p-3 rounded-l-lg border-2 border-r-0 border-blue-200 font-bold text-blue-600">-</button>
                  <input 
                    type="number" 
                    value={coldCount} 
                    onChange={(e) => setColdCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border-2 border-blue-200 p-3 text-xl font-black text-center text-blue-700 outline-none" 
                  />
                  <button onClick={() => setColdCount(coldCount + 1)} className="bg-blue-50 p-3 rounded-r-lg border-2 border-l-0 border-blue-200 font-bold text-blue-600">+</button>
                </div>
              </div>
            </>
          )}

          {isCompra && (
            <>
              <div className="md:col-span-4">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nº Compra</label>
                <input
                  type="text"
                  placeholder="0000000"
                  maxLength={7}
                  value={purchaseNumber}
                  onChange={(e) => setPurchaseNumber(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-2xl font-black text-center focus:border-green-600 outline-none"
                />
              </div>
              <div className="md:col-span-8">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Cliente</label>
                <input
                  type="text"
                  placeholder="NOME COMPLETO"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value.toUpperCase())}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-xl font-black focus:border-green-600 outline-none"
                />
              </div>
              <div className="md:col-span-6">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block text-center">Volumes Secos</label>
                <div className="flex">
                  <button onClick={() => setCompraDryCount(Math.max(0, compraDryCount - 1))} className="bg-gray-100 p-3 rounded-l-lg border-2 border-r-0 font-bold">-</button>
                  <input 
                    type="number" 
                    value={compraDryCount} 
                    onChange={(e) => setCompraDryCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border-2 border-gray-300 p-3 text-xl font-black text-center outline-none" 
                  />
                  <button onClick={() => setCompraDryCount(compraDryCount + 1)} className="bg-gray-100 p-3 rounded-r-lg border-2 border-l-0 font-bold">+</button>
                </div>
              </div>
              <div className="md:col-span-6">
                <label className="text-xs font-bold text-blue-500 uppercase mb-1 block text-center">Volumes Gelados</label>
                <div className="flex">
                  <button onClick={() => setCompraColdCount(Math.max(0, compraColdCount - 1))} className="bg-blue-50 p-3 rounded-l-lg border-2 border-r-0 border-blue-200 font-bold text-blue-600">-</button>
                  <input 
                    type="number" 
                    value={compraColdCount} 
                    onChange={(e) => setCompraColdCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border-2 border-blue-200 p-3 text-xl font-black text-center text-blue-600 outline-none" 
                  />
                  <button onClick={() => setCompraColdCount(compraColdCount + 1)} className="bg-blue-50 p-3 rounded-r-lg border-2 border-l-0 border-blue-200 font-bold text-blue-600">+</button>
                </div>
              </div>
            </>
          )}

          {isPlaca && (
            <>
              <div className="md:col-span-6">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Aviso Principal</label>
                <input
                  type="text"
                  value={placaTitle}
                  onChange={(e) => setPlacaTitle(e.target.value.toUpperCase())}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-xl font-black focus:border-orange-500 outline-none"
                />
              </div>
              <div className="md:col-span-4">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nome/Info</label>
                <input
                  type="text"
                  placeholder="OPCIONAL"
                  value={placaClientName}
                  onChange={(e) => setPlacaClientName(e.target.value.toUpperCase())}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-xl font-black focus:border-orange-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block text-center">Qtd</label>
                <input
                  type="number"
                  value={placaCount}
                  onChange={(e) => setPlacaCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full border-2 border-gray-300 rounded-lg p-3 text-xl font-black text-center outline-none"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handlePrint}
            disabled={!isValid}
            className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center uppercase tracking-widest"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            IMPRIMIR {isPlaca ? 'PLACA' : 'ETIQUETAS'}
          </button>
          <button onClick={handleClear} className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold rounded-xl border border-gray-300 uppercase text-xs">
            Limpar
          </button>
        </div>
      </section>

      {/* Render Area */}
      <main className={`w-full ${isPlaca ? 'print:p-0 print:m-0' : 'print:p-0 print:m-0'}`}>
        {labels.length > 0 ? (
          <div className={`${isPlaca ? 'flex flex-col' : 'flex flex-col print:block'}`}>
            {labels.map((label, idx) => (
              <div key={idx} className={isPlaca ? "print-page-break" : "print:mb-0"}>
                <PrintableLabel data={label} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-print text-center py-20 bg-white rounded-xl border-4 border-dotted border-gray-200">
            <p className="text-gray-300 text-xl font-black uppercase tracking-widest">Aguardando dados...</p>
          </div>
        )}
      </main>

      <footer className="no-print mt-12 py-8 border-t text-center">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
          © Todos os direitos reservados a JM
        </p>
      </footer>
    </div>
  );
};

export default App;
