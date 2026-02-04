
import React from 'react';
import { BagType, LabelData, LabelMode } from '../types';

interface PrintableLabelProps {
  data: LabelData;
}

const PrintableLabel: React.FC<PrintableLabelProps> = ({ data }) => {
  const isCold = data.type === BagType.GELADA;
  const isIFood = data.mode === LabelMode.IFOOD;
  const isPlaca = data.mode === LabelMode.PLACA;

  return (
    <div className={`label-card relative w-full border-[6px] border-black p-6 rounded-none flex flex-col justify-between h-[380px] bg-white mb-4 print:mb-12 print:shadow-none overflow-hidden`}>
      
      {/* Marca d'água */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.08] z-0">
        <span className="text-black font-black text-9xl whitespace-nowrap -rotate-[25deg] uppercase tracking-[0.2em]">
          SEMAR ENTREGA
        </span>
      </div>

      {/* Conteúdo da Etiqueta */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        
        {isPlaca ? (
          /* LAYOUT PARA PLACAS DE AVISO */
          <div className="flex flex-col h-full items-center justify-center text-center py-4">
            <div className="w-full border-b-8 border-black pb-4 mb-6">
               <span className="text-6xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
                 {data.title}
               </span>
            </div>
            
            <div className="flex-grow flex items-center justify-center w-full px-4">
               <span className="text-7xl md:text-8xl font-black text-black uppercase break-words leading-none">
                 {data.clientName || '---'}
               </span>
            </div>

            <div className="w-full border-t-8 border-black pt-4 mt-6">
               <span className="text-3xl font-bold text-black uppercase tracking-[0.3em]">
                 S E M A R &nbsp; E N T R E G A
               </span>
            </div>
          </div>
        ) : (
          /* LAYOUT PARA IFOOD E COMPRA */
          <>
            {/* Top Section */}
            <div className="flex justify-between items-start border-b-4 border-black pb-2">
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className={`${isIFood ? 'text-xl' : 'text-4xl md:text-5xl'} font-bold text-black uppercase tracking-tighter`}>
                  {isIFood ? 'PEDIDO IFOOD' : `COMPRA: #${data.title}`}
                </span>
                <div className="flex items-baseline">
                  <span className={`${isIFood ? 'text-8xl' : 'text-5xl md:text-6xl'} font-black text-black leading-tight mt-1 tracking-tighter uppercase break-words`}>
                    {isIFood ? `#${data.title}` : (data.clientName || 'NÃO INFORMADO')}
                  </span>
                </div>
              </div>
              
              {/* Type Badge */}
              <div className={`ml-4 px-6 py-4 border-4 border-black flex items-center justify-center shrink-0 ${isCold ? 'bg-black text-white' : 'bg-white text-black'}`}>
                <span className="font-black text-4xl uppercase italic tracking-widest">
                  {data.type}
                </span>
              </div>
            </div>

            {/* Middle Section: Volume Details */}
            <div className="flex flex-col items-center justify-center flex-grow py-4 text-center">
              <div className="text-3xl font-bold text-black uppercase tracking-widest mb-2">
                VOLUME {data.currentVolume} DE {data.totalVolumes}
              </div>
              
              <div className="border-[4px] border-black px-8 py-3 bg-white/80 backdrop-blur-sm flex flex-col items-center w-full max-w-xl">
                <div className="text-7xl font-black text-black leading-none uppercase mb-2">
                  {data.totalVolumes} VOLUMES
                </div>
                <div className="text-4xl font-bold text-black uppercase tracking-tight">
                  {data.dryTotal} SECOS / {data.coldTotal} GELADOS
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer Section (Comum a todos) */}
        <div className="flex flex-col">
          {!isPlaca && (
            <div className="border-t-4 border-black pt-2 flex justify-between items-center">
               <span className="text-base font-bold uppercase italic">
                 {isIFood ? 'Conferido por: _________________' : 'Data da Compra: ____/____/____'}
               </span>
               <span className="text-base font-black uppercase tracking-widest">
                 {isIFood ? 'IFOOD DELIVERY' : 'CONTROLE DE ESTOQUE'}
               </span>
            </div>
          )}
          <div className="flex justify-end pt-1">
             <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
               © Todos os direitos reservados a JM
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableLabel;
