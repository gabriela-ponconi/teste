
import React from 'react';
import { BagType, LabelData, LabelMode } from '../types';

interface PrintableLabelProps {
  data: LabelData;
}

const PrintableLabel: React.FC<PrintableLabelProps> = ({ data }) => {
  const isCold = data.type === BagType.GELADA;
  const isIFood = data.mode === LabelMode.IFOOD;
  const isPlaca = data.mode === LabelMode.PLACA;

  /**
   * Ajuste de dimensões para Segurança Total (Safe Zones):
   * A4 Portrait: 210 x 297mm.
   * Duas etiquetas: 135mm cada (270mm total).
   * A4 Landscape: 297 x 210mm.
   * Placa: 280 x 190mm para garantir margens de segurança.
   */
  const containerClasses = isPlaca 
    ? "print:w-[280mm] print:h-[190mm] print:border-[15px] print:my-0 min-h-[500px] w-full border-[10px]" 
    : "print:h-[135mm] print:w-[100%] print:border-[5px] h-[380px] w-full border-[6px]";

  return (
    <div className={`label-card relative ${containerClasses} border-black p-6 md:p-10 rounded-none flex flex-col justify-between bg-white mb-4 print:mb-0 overflow-hidden select-none box-border`}>
      
      {/* Marca d'água Escalonada */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0 overflow-hidden">
        <span className={`text-black font-black whitespace-nowrap -rotate-[25deg] uppercase tracking-[0.2em] leading-none ${isPlaca ? 'text-[180px]' : 'text-9xl'}`}>
          SEMAR ENTREGA
        </span>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        {isPlaca ? (
          /* MODO PLACA - Ajustado para evitar cortes */
          <div className="flex flex-col h-full items-center justify-between py-2">
            <div className="w-full border-b-[8px] border-black pb-4 text-center">
              <span className="text-6xl md:text-7xl print:text-[75px] font-black text-black uppercase tracking-tighter leading-none">
                {data.title}
              </span>
            </div>
            
            <div className="flex-grow flex items-center justify-center w-full px-2 text-center my-4">
              <span className="text-6xl md:text-8xl print:text-[110px] font-black text-black uppercase break-words leading-[1.1] max-w-full">
                {data.clientName || '---'}
              </span>
            </div>

            <div className="w-full border-t-[8px] border-black pt-4 text-center">
              <span className="text-3xl md:text-5xl print:text-[50px] font-bold text-black uppercase tracking-[0.4em]">
                SEMAR ENTREGA
              </span>
            </div>
          </div>
        ) : (
          /* MODO ETIQUETA: IFOOD / COMPRA */
          <>
            <header className="flex justify-between items-start border-b-4 border-black pb-2">
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className={`${isIFood ? 'text-xl' : 'text-2xl'} font-bold text-black uppercase tracking-tighter`}>
                  {isIFood ? 'PEDIDO IFOOD' : `COMPRA: #${data.title}`}
                </span>
                <span className={`${isIFood ? 'text-8xl' : 'text-6xl'} font-black text-black leading-tight mt-1 tracking-tighter uppercase truncate`}>
                  {isIFood ? `#${data.title}` : (data.clientName || 'AVULSO')}
                </span>
              </div>
              
              <div className={`ml-4 px-6 py-4 border-4 border-black shrink-0 ${isCold ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <span className="font-black text-4xl uppercase italic tracking-widest">
                  {data.type}
                </span>
              </div>
            </header>

            <main className="flex flex-col items-center justify-center flex-grow py-4 text-center">
              <div className="text-2xl font-bold text-black uppercase tracking-[0.2em] mb-2">
                VOLUME {data.currentVolume} DE {data.totalVolumes}
              </div>
              
              <div className="border-[5px] border-black px-10 py-4 bg-white/50 backdrop-blur-sm flex flex-col items-center w-full max-w-2xl">
                <div className="text-7xl font-black text-black leading-none uppercase mb-1">
                  {data.totalVolumes} VOLUMES
                </div>
                <div className="text-3xl font-bold text-black uppercase tracking-tight">
                  {data.dryTotal} SECOS • {data.coldTotal} GELADOS
                </div>
              </div>
            </main>
          </>
        )}

        <footer className="flex flex-col">
          {!isPlaca && (
            <div className="border-t-4 border-black pt-2 flex justify-between items-center font-bold uppercase italic text-sm">
               <span>{isIFood ? 'RESPONSÁVEL: _________________' : 'DATA: ____/____/____'}</span>
               <span className="tracking-widest font-black">
                 {isIFood ? 'IFOOD DELIVERY' : ''}
               </span>
            </div>
          )}
          <div className="flex justify-end pt-1">
             <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
               © Todos os direitos reservados a JM
             </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PrintableLabel;
